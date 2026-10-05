# The Undertaker

This Chrome extension records only three timestamps:

- When you click **Start**
- When the recorder name appears in a Zoom web meeting
- When you click **End**

It stores the data locally in Chrome and exports a CSV that opens in Excel. It does not send data to any server.

## Install

1. Unzip the folder.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `zoom-adherence-logger` folder.
6. Pin **The Undertaker** from the Extensions menu.

## Use

1. Join the meeting using **Zoom in Chrome**, not the separate Zoom desktop app.
2. Keep Zoom's Participants panel open so participant names exist on the page.
3. Open the extension, enter a session name or chat/case number, and click **Start**.
4. The extension automatically saves the time when a configured recorder name appears.
5. Click **End** when the meeting ends.
6. Click **Export CSV** when you need a report. It exports every saved completed call.

Enter the recorder's exact display name in the extension settings. Multiple possible names can be separated with commas.

## Permissions

The extension requests only:

- `storage` to keep timestamps locally in the current Chrome profile.
- Page access limited to `https://app.zoom.us/wc/*` so it can detect the configured recorder display name in the Zoom web meeting.

It does not request access to tabs, browsing history, Salesforce, Rippling, microphone, camera, audio, video, downloads, cookies or external servers.

## Important limit

Chrome extensions cannot read the participant list inside the separate Zoom desktop application. The manual **Mark recorder joined** button is included as a fallback. Automatic detection works only when the meeting runs in Zoom's web client and the participant name is present in the page.

## Saved history and reset

History never resets at midnight or at a shift boundary. All completed calls remain visible and exportable until you click **Reset data** and confirm **Yes, reset all data**. Cancel keeps everything. Reset also stops the active log but keeps your recorder-name settings. Times and dates are explicitly IST; CSV includes both start and end dates for overnight calls.

Session names are entered manually, stored locally, displayed in history and included in CSV exports. Older calls without a name display as Zoom session.
