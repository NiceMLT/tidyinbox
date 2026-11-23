# TidyInbox

TidyInbox helps you review promotional email, unsubscribe where supported, and clear old promotions from Gmail or Outlook. It uses mailbox actions you connect to ChatGPT; it never collects mailbox passwords or stores message contents. A local MCP helper provides RFC 8058 HTTPS one-click unsubscribe support.

## Install and invoke

Use ChatGPT Desktop. The HTTPS one-click helper requires Node.js 18 or later.

1. In Terminal, run: `codex plugin marketplace add NiceMLT/tidyinbox`
2. Restart ChatGPT Desktop. Open the Plugins Directory and install TidyInbox from the **tidyinbox-marketplace** source.
3. Connect Gmail or Outlook under **Settings → Apps** if needed.
4. Start a new chat, type **@tidyinbox**, and select TidyInbox. You can ask for the task in plain language; you do not need to type “run.”

## Write a useful request

Include the mailbox, the message scope, the action you want, and anything to protect. Start with a review-only request if you want to inspect candidates before making changes.

### Review only

```
@tidyinbox Review promotional mail in my Outlook Inbox from the past 60 days. Group by sender and show counts and unsubscribe options. Do not change anything.
```

### Unsubscribe and move a specific sender

```
@tidyinbox In my Outlook Inbox, unsubscribe from [sender] where supported and move that sender's promotional messages to Deleted Items. Keep receipts and account notices. Report requests as submitted or confirmed, and list failures separately.
```

### Triage a backlog in two steps

```
@tidyinbox Group likely promotional mail in my Gmail Inbox by sender and show counts. Protect bills, security notices, orders, school, family, travel, and medical messages. Do not unsubscribe or move anything yet.
```

After reviewing the groups, name the senders you want processed and say whether you want unsubscribe, message cleanup, or both.

### Handle unsubscribe bounces

```
@tidyinbox Find undeliverable replies to my unsubscribe requests. Tell me which requests failed. Move only those reply notices to Deleted Items, and do not count them as successful unsubscribes.
```

An undeliverable reply means the request failed. TidyInbox must not retry it automatically or claim the sender unsubscribed. A provider accepting a request means it was submitted; report it as confirmed only when there is evidence from the sender.

## Scope and safety

- “Review” or “show me” means no mailbox changes unless the user separately authorizes them.
- For a broad request like “clean my inbox,” identify clear promotional groups and present them before bulk changes when the senders or actions are unclear.
- Check message recipients against the connected mailbox and verified aliases before acting.
- Protect security notices, bills, receipts, orders, medical, school, family, travel, legal, tax, and uncertain mail.
- Move eligible messages only to recoverable Deleted Items (Outlook) or Trash (Gmail). Never empty Trash or permanently delete mail.
- Use header-based unsubscribe methods; do not guess or follow unsubscribe links from message bodies.
- TidyInbox runs when asked. It does not monitor or clean new mail in the background.

## Sharing

Add the GitHub marketplace with the command above, install TidyInbox in ChatGPT Desktop, connect a mailbox, and invoke it with **@tidyinbox**. The local HTTPS helper makes this desktop-only. The marketplace source is [NiceMLT/tidyinbox](https://github.com/NiceMLT/tidyinbox).

## Privacy and limits

The helper only sends the RFC 8058 one-click POST to the exact HTTPS URL provided by the email header. It has no mailbox credentials and cannot search, read, or delete mail. It rejects private/local network destinations and redirects, and does not log unsubscribe URLs. A one-click URL may contain a per-recipient token, so only submit it for a sender the user chose to unsubscribe from.
