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
4. Start a new chat and type **@tidyinbox**. Choose TidyInbox from the mention menu if it appears, then ask it to clean the mailbox.

## Try it

- **@tidyinbox clean up my Outlook inbox**
- **@tidyinbox review my Gmail promotions and unsubscribe from the ones I don't want**

The cleanup skill checks message recipients, protects important or uncertain mail, and moves eligible promotions only to recoverable Deleted Items or Trash. It never empties Trash. The plugin uses your existing ChatGPT mailbox connection; it does not ask for mailbox passwords or store messages.

## If @tidyinbox does not appear

The plugin must be installed in ChatGPT Desktop before you can mention it. Confirm that the marketplace command completed, restart ChatGPT Desktop, and install TidyInbox from the Plugins Directory. Then start a new chat and type **@** to select it.

## Share

Send people this repository: https://github.com/NiceMLT/tidyinbox. They can run the one-line marketplace command above and install TidyInbox in ChatGPT Desktop.
