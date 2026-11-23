# TidyInbox

TidyInbox helps you identify recurring marketing, unsubscribe failures, and clutter in Gmail or Outlook. It uses mailbox actions you connect to ChatGPT; it never collects mailbox passwords or stores message contents. A local MCP helper provides RFC 8058 HTTPS one-click unsubscribe support.

## Install and invoke

Use ChatGPT Desktop. The HTTPS one-click helper requires Node.js 18 or later.

1. In Terminal, run: `codex plugin marketplace add NiceMLT/tidyinbox`
2. Restart ChatGPT Desktop. Open the Plugins Directory and install TidyInbox from the **tidyinbox-marketplace** source.
3. Connect Gmail or Outlook under **Settings → Apps** if needed.
4. Start a new chat, type **@tidyinbox**, and select TidyInbox. Ask in plain language; you do not need to type “run.”

## Ask for a cleanup

Name the mailbox and any exceptions to keep. A broad request such as “clean my Outlook inbox” should scan the full Inbox, paginate through results, and group recurring marketing/newsletters, unsubscribe failure notices, protected transactional mail, and uncertain items. It should propose one batch with sender names and counts, then ask once before changing mail.

> @tidyinbox Clean up my Outlook inbox. Find recurring promotions and unsubscribe failures, keep receipts and account notices, and show me one proposed cleanup.

After reviewing the proposal, a short exception list is enough:

> Keep On3, ditch the rest.

That authorizes unsubscribe requests for the other displayed, high-confidence marketing senders and recoverable deletion of their matching promotional messages. TidyInbox should not ask again whether to move the same messages. Uncertain or protected mail stays untouched.

## Review without changes

> @tidyinbox Review promotional mail in my Outlook Inbox from the past 60 days. Group by sender and show counts and unsubscribe options. Do not change anything.

“Review” and “show me” requests are read-only until the user authorizes a cleanup.

## Handle unsubscribe failures

> @tidyinbox Find undeliverable replies to my unsubscribe requests. Tell me which requests failed. Move only those reply notices to Deleted Items, and do not count them as successful unsubscribes.

An undeliverable reply means the request failed. TidyInbox must not retry automatically or claim the sender unsubscribed. A provider accepting a request means it was submitted; report it as confirmed only when there is evidence from the sender.

## Scope and safety

- Treat recurring retailer, club, ticketing, entertainment, sports-newsletter, and fundraising mail as marketing when messages are offers or newsletters. A familiar brand does not make its promotional mail transactional.
- Protect bills, receipts, orders, shipping notices, account/security alerts, medical, school, family, travel, legal, tax, and uncertain mail.
- Check recipients against the connected mailbox and verified aliases before acting.
- Use supported header-based unsubscribe methods; do not guess or follow unsubscribe links from message bodies.
- Move eligible mail only to recoverable Deleted Items (Outlook) or Trash (Gmail). Never empty Trash or permanently delete mail.
- TidyInbox runs only when asked; it does not monitor or clean new mail in the background.

## Share

Add the GitHub marketplace with the command above, install TidyInbox in ChatGPT Desktop, connect a mailbox, and invoke it with **@tidyinbox**. The local HTTPS helper makes this desktop-only. The marketplace source is [NiceMLT/tidyinbox](https://github.com/NiceMLT/tidyinbox).

## Privacy and limits

The helper only sends the RFC 8058 one-click POST to the exact HTTPS URL provided by the email header. It has no mailbox credentials and cannot search, read, or delete mail. It rejects private/local network destinations and redirects, and does not log unsubscribe URLs. A one-click URL may contain a per-recipient token, so only submit it for a sender the user chose to unsubscribe from.
