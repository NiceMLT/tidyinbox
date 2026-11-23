import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import { URL } from "node:url";

const PROTOCOL_VERSION = "2025-03-26";
const ONE_CLICK_VALUE = "List-Unsubscribe=One-Click";
const MAX_RESPONSE_BYTES = 4096;
const REQUEST_TIMEOUT_MS = 8000;

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function jsonRpcError(id, code, message) {
  writeMessage({ jsonrpc: "2.0", id, error: { code, message } });
}

function inV4Cidr(address, base, bits) {
  const value = address.split(".").reduce((n, octet) => (n * 256) + Number(octet), 0);
  const network = base.split(".").reduce((n, octet) => (n * 256) + Number(octet), 0);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (value & mask) === (network & mask);
}

function isPublicIPv4(address) {
  if (net.isIP(address) !== 4) return false;
  const blocked = [
    ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10],
    ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
    ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24],
    ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
    ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4]
  ];
  return !blocked.some(([base, bits]) => inV4Cidr(address, base, bits));
}

function isPublicIPv6(address) {
  if (net.isIP(address) !== 6) return false;
  const lower = address.toLowerCase();
  if (lower.startsWith("::ffff:") || lower === "::" || lower === "::1") return false;
  // Accept global unicast (2000::/3) only, excluding the documentation range.
  const first = Number.parseInt(lower.split(":")[0] || "0", 16);
  const globalUnicast = first >= 0x2000 && first <= 0x3fff;
  const documentation = lower.startsWith("2001:db8:") || lower === "2001:db8";
  return globalUnicast && !documentation;
}

function isPublicAddress(address) {
  return net.isIP(address) === 4 ? isPublicIPv4(address) : isPublicIPv6(address);
}

async function resolvePublicAddress(hostname) {
  if (!hostname || net.isIP(hostname)) throw new Error("IP-literal hosts are not allowed.");
  const records = await dns.promises.lookup(hostname, { all: true, verbatim: true });
  if (!records.length || records.some((record) => !isPublicAddress(record.address))) {
    throw new Error("The destination does not resolve only to public IP addresses.");
  }
  return records[0];
}

function parseUnsubscribeUrl(value) {
  if (typeof value !== "string" || value.length > 4096) throw new Error("The unsubscribe URL is missing or too long.");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The unsubscribe URL is invalid.");
  }
  if (url.protocol !== "https:") throw new Error("Only HTTPS unsubscribe URLs are allowed.");
  if (url.username || url.password || url.hash) throw new Error("Credentials and fragments are not allowed in the unsubscribe URL.");
  if (url.port && url.port !== "443") throw new Error("Only the standard HTTPS port is allowed.");
  if (!url.hostname) throw new Error("The unsubscribe URL has no host.");
  return url;
}

async function postOneClick(url, sender) {
  const pinned = await resolvePublicAddress(url.hostname);
  const body = ONE_CLICK_VALUE;
  return new Promise((resolve, reject) => {
    const request = https.request({
      protocol: "https:",
      hostname: url.hostname,
      port: 443,
      path: `${url.pathname}${url.search}`,
      method: "POST",
      servername: url.hostname,
      lookup(_hostname, options, callback) {
        if (options?.all) callback(null, [pinned]);
        else callback(null, pinned.address, pinned.family);
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "content-length": Buffer.byteLength(body),
        "user-agent": "TidyInbox/0.2.0 one-click unsubscribe"
      }
    }, (response) => {
      let bytes = 0;
      response.on("data", (chunk) => {
        bytes += chunk.length;
        if (bytes > MAX_RESPONSE_BYTES) request.destroy(new Error("Response too large."));
      });
      response.on("end", () => {
        const status = response.statusCode || 0;
        resolve({
          status,
          submitted: status >= 200 && status < 300,
          sender: sender.slice(0, 160)
        });
      });
      response.on("error", reject);
      response.resume();
    });
    request.setTimeout(REQUEST_TIMEOUT_MS, () => request.destroy(new Error("The unsubscribe request timed out.")));
    request.on("error", reject);
    request.end(body);
  });
}

const tools = [{
  name: "unsubscribe_one_click",
  title: "Submit one-click unsubscribe",
  description: "Submit the RFC 8058 HTTPS one-click request from a verified List-Unsubscribe header. Use only after the user has chosen to unsubscribe from this sender and the exact List-Unsubscribe-Post header is List-Unsubscribe=One-Click. This sends the tokenized URL to its sender-controlled HTTPS host; it does not follow redirects or send mailbox credentials.",
  inputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      url: { type: "string", description: "Exact HTTPS URL from the message's List-Unsubscribe header." },
      list_unsubscribe_post: { type: "string", enum: [ONE_CLICK_VALUE], description: "Exact List-Unsubscribe-Post header value from the same message." },
      sender: { type: "string", description: "Display name or sender address, for the result summary." }
    },
    required: ["url", "list_unsubscribe_post", "sender"]
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true
  }
}];

async function callTool(name, args) {
  if (name !== "unsubscribe_one_click") throw new Error("Unknown TidyInbox tool.");
  if (args?.list_unsubscribe_post !== ONE_CLICK_VALUE) {
    throw new Error("The exact RFC 8058 one-click header was not supplied.");
  }
  const url = parseUnsubscribeUrl(args.url);
  const result = await postOneClick(url, String(args.sender || "Unknown sender"));
  const submitted = result.submitted;
  return {
    content: [{
      type: "text",
      text: submitted
        ? `Unsubscribe request submitted for ${result.sender} (HTTP ${result.status}). This does not confirm that the sender has stopped future email.`
        : `The sender did not accept the unsubscribe request for ${result.sender} (HTTP ${result.status}).`
    }],
    structuredContent: {
      sender: result.sender,
      status: submitted ? "submitted" : "not_accepted",
      http_status: result.status
    },
    isError: !submitted
  };
}

async function handleMessage(message) {
  if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") return;
  if (message.method.startsWith("notifications/")) return;
  const id = message.id;
  if (message.method === "initialize") {
    writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: message.params?.protocolVersion || PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "tidyinbox-actions", version: "0.2.0" }
      }
    });
    return;
  }
  if (message.method === "ping") {
    writeMessage({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (message.method === "tools/list") {
    writeMessage({ jsonrpc: "2.0", id, result: { tools } });
    return;
  }
  if (message.method === "tools/call") {
    try {
      const result = await callTool(message.params?.name, message.params?.arguments || {});
      writeMessage({ jsonrpc: "2.0", id, result });
    } catch (error) {
      writeMessage({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: error instanceof Error ? error.message : "The request could not be submitted." }],
          isError: true
        }
      });
    }
    return;
  }
  if (message.method === "resources/list") {
    writeMessage({ jsonrpc: "2.0", id, result: { resources: [] } });
    return;
  }
  jsonRpcError(id, -32601, "Method not found.");
}

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
  let newline = input.indexOf("\n");
  while (newline !== -1) {
    const line = input.slice(0, newline).trim();
    input = input.slice(newline + 1);
    if (line) {
      try {
        void handleMessage(JSON.parse(line)).catch(() => {});
      } catch {
        jsonRpcError(null, -32700, "Parse error.");
      }
    }
    newline = input.indexOf("\n");
  }
});
