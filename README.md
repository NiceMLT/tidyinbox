# TidyInbox

TidyInbox is a ChatGPT plugin for reviewing promotional email, unsubscribing safely, and clearing old messages from Gmail or Outlook.

## Download and install

1. Download `tidyinbox-source.zip` from this repository and extract it.
2. Open the extracted folder in ChatGPT desktop as a local plugin marketplace source. The package includes `.claude-plugin/marketplace.json` and the plugin under `tidyinbox/`.
3. Install **TidyInbox** from the Plugins Directory.
4. Connect your own Gmail or Outlook account in ChatGPT under **Settings → Apps**.

The local HTTPS one-click helper requires Node.js and ChatGPT desktop. Gmail and Outlook access uses the mailbox actions already connected in ChatGPT; TidyInbox does not collect mailbox passwords or store message contents.

## What it does

- Checks that messages are addressed to the connected mailbox before changing them.
- Protects billing, security, order, school, family, medical, travel, legal, tax, and uncertain messages.
- Uses supported unsubscribe methods, including RFC 8058 HTTPS one-click headers.
- Moves eligible promotions to recoverable Deleted Items or Trash. It never empties Trash.

## Source

The complete plugin source, marketplace entry, setup instructions, and local MCP helper are in [`tidyinbox-source.zip`](./tidyinbox-source.zip).
