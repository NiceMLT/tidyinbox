# TidyInbox

TidyInbox is a ChatGPT plugin package for guided Gmail and Outlook cleanup. It uses the mailbox tools the user already connects in ChatGPT; it never collects mailbox passwords or stores mailbox contents. A small local MCP helper adds support for RFC 8058 HTTPS one-click unsubscribe headers.

## What it does

- Prompts the user to connect Gmail or Outlook through ChatGPT when no provider is available.
- Groups repeat senders and checks that messages are addressed to the connected mailbox.
- Keeps billing, security, order, medical, school, family, travel, legal, tax, and uncertain mail protected.
- Uses provider unsubscribe actions or valid `List-Unsubscribe` headers.
- Sends HTTPS one-click unsubscribe requests only when `List-Unsubscribe-Post` is exactly `List-Unsubscribe=One-Click`.
- Moves eligible old promotions to recoverable Deleted Items or Trash; it never empties Trash.
- Reports requests as submitted until there is evidence of confirmation.

## Install and invoke

1. Install Node.js 18 or later.
2. Add the marketplace with `codex plugin marketplace add NiceMLT/tidyinbox`.
3. Restart ChatGPT desktop and install **TidyInbox** from the Plugins Directory.
4. Connect Gmail or Outlook under **Settings → Apps**.
5. Start a new chat and type `@tidyinbox`.

For example: `@tidyinbox run my Outlook cleanup. Review unwanted promotions, unsubscribe where supported, and move eligible old messages to recoverable Deleted Items.`

The bundled MCP helper only performs the final HTTPS one-click POST. It has no mailbox credentials and cannot search, read, or delete messages. It validates the URL, resolves and rejects private/local network destinations, pins the selected public IP for the request, refuses redirects, times out, and does not log unsubscribe URLs.

## Sharing

The GitHub repository is configured as a local marketplace. The included HTTPS one-click helper runs as a local MCP server, so it is desktop-only. Submission of local-MCP plugins to the public Plugins Directory is limited to approved partners; Git marketplace installation is the sharing path available now.

## Current limits

- Requires ChatGPT desktop for the local one-click helper. The skill-only workflow can still use connected provider actions on supported surfaces, but HTTPS-only headers need the helper.
- Google may require restricted-scope verification for a separate app that directly accesses Gmail. TidyInbox does not register its own Google OAuth app; it uses the user's ChatGPT connection.
- A successful POST means the request was submitted. The sender may take time to stop mail or may still send transactional/account messages.

## Privacy

TidyInbox does not store messages, provider tokens, or unsubscribe URLs. The HTTPS helper sends the header URL and the RFC 8058 form body directly to the sender's HTTPS host. That URL can contain a per-recipient token; use this action only for a sender the user has chosen to unsubscribe from.
