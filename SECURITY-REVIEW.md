# Security Review: The Undertaker

## Business purpose

CX agents use Zoom during customer support chats. The existing recording participant can join late or fail to join, creating a mismatch between the agent's actual Zoom time and the recorded time. This extension creates a local timestamp record for retroactive adherence review.

## Single purpose

Record three timestamps only:

1. When the user clicks **Start**.
2. When the configured display name `Rippling Recorder` appears in the Zoom web meeting.
3. When the user clicks **End**.

The extension exports the timestamps as a local CSV file.

## Data handled

- Start timestamp
- Recorder-join timestamp
- End timestamp
- Recorder status and calculated delay/duration

The extension scans rendered Zoom page text locally, which may include displayed chat text. It stores only session IDs, manually entered session names or chat/case references, timestamps, recorder matches and settings, not the scanned page text. It does not capture meeting audio or video or access credentials, cookies or Salesforce/Rippling data.

## Data storage and transfer

- Data is stored only in `chrome.storage.local` within the user's Chrome profile.
- No backend, database, analytics, telemetry or third-party vendor is used.
- No data is transmitted over the network by the extension.
- CSV export is initiated manually by the user and saved locally.

## Permissions

| Permission | Reason |
|---|---|
| `storage` | Store timestamps and settings locally in the Chrome profile. |
| `https://app.zoom.us/wc/*` | Detect the configured recorder display name on Zoom web meeting pages only. |

The extension does not request `tabs`, browsing history, cookies, downloads, microphone, camera, audio capture, video capture or access to Salesforce/Rippling domains.

## Controls

- Manifest V3 extension.
- Source code is available for internal review.
- Recorder-name detection is a local text match.
- Users explicitly start and end each timestamp session.
- The extension does not change Zoom, Salesforce or Omni state.

## Requested approval

Allowlist the Chrome Web Store extension ID for the approved CX user group after source and security review.
