# TidyInbox

TidyInbox helps you review unwanted promotional email, unsubscribe where supported, and clear old promotions from Gmail or Outlook.

## Install once

Install it with the Codex CLI, then use it in ChatGPT Desktop. The HTTPS one-click unsubscribe helper requires Node.js 18 or later.

1. Open Terminal and run:

   ```sh
   codex plugin marketplace add NiceMLT/tidyinbox
   ```

2. Restart ChatGPT Desktop. Open the Plugins Directory, select the **tidyinbox-marketplace** source, and install **TidyInbox**.
3. Connect Gmail or Outlook in ChatGPT under **Settings → Apps** if you have not already.
4. Start a new chat, type **@tidyinbox**, and choose TidyInbox from the mention menu.

## Tell TidyInbox what you want

A useful request names four things: **which mailbox**, **what messages to look at**, **what action you want**, and **what to leave alone**. You can use plain language. Ask for a review without changes when you want to inspect candidates first.

### Review first, make no changes

```
@tidyinbox Review promotional mail in my Outlook Inbox from the past 60 days. Group it by sender, show counts and supported unsubscribe options, and do not change anything yet.
```

### Unsubscribe and clear a specific sender

```
@tidyinbox In my Outlook Inbox, unsubscribe from [sender] where supported and move that sender's promotional messages to Deleted Items. Keep receipts, account notices, and anything uncertain. Report requests as submitted or confirmed, and list failures separately.
```

### Clean up failed unsubscribe replies

```
@tidyinbox Find undeliverable or bounced replies to my unsubscribe requests. Move those reply notices out of my Outlook Inbox, tell me which unsubscribe attempts failed, and do not count them as successful.
```

### Triage a large backlog

```
@tidyinbox Review my Gmail Inbox and group likely promotional mail by sender. Protect bills, security notices, orders, school, family, travel, and medical messages. Show me the candidate groups first; don't unsubscribe or move messages yet.
```

If you ask only to “clean my inbox,” TidyInbox should start by showing clear promotional groups and asking which ones to process before making bulk changes. For the fastest targeted cleanup, name the sender and say whether to unsubscribe, move old messages, or both.

## What TidyInbox does

- Checks that messages are addressed to the connected mailbox before acting.
- Protects billing, security, order, school, family, medical, travel, legal, tax, and uncertain messages.
- Uses supported unsubscribe methods, including RFC 8058 HTTPS one-click headers.
- Moves eligible promotions to recoverable Deleted Items or Trash. It never empties Trash.
- Reports an unsubscribe request as **submitted** until there is evidence it was confirmed. An undeliverable reply is a failure, not a successful unsubscribe.

TidyInbox runs when you ask it to; it does not monitor or clean the mailbox in the background. It uses your existing ChatGPT mailbox connection and does not ask for mailbox passwords or store message contents.

## Share

Send people this repository: https://github.com/NiceMLT/tidyinbox. They can follow the install steps above, then invoke it with **@tidyinbox** in a new ChatGPT Desktop chat.
