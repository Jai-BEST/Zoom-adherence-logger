# The Undertaker
### Zoom Recorder Timestamp & Adherence Logger

A lightweight Chrome extension designed to track Zoom meeting timestamps, detect recording bot attendance and identify recording delays.

## The Problem

Recording bots occasionally join Zoom meetings late or fail to join altogether. This creates discrepancies in meeting records and makes it difficult to accurately account for time spent in meetings.

Manually tracking timestamps across multiple meetings is inefficient and prone to errors.

## The Solution

The Undertaker automatically detects when a recording bot joins a Zoom meeting and calculates the delay between the manually recorded meeting start time and the recorder's arrival.

## Key Features

- **Timestamp Tracking:** Record meeting start and end times.
- **Automatic Detection:** Identify when the recording bot joins.
- **Delay Calculation:** Calculate missing recording time.
- **Manual Override:** Manually mark recorder arrival when necessary.
- **Session References:** Associate meetings with reference numbers.
- **Session History:** Review previously recorded sessions.
- **CSV Export:** Download timestamp reports for documentation and schedule adjustments.

## How to Use

1. Join a Zoom meeting through Chrome.
2. Open The Undertaker and click Start.
3. Keep the Participants panel visible for automatic recorder detection.
4. Click End when your meeting finishes.
5. Export your timestamp logs whenever required.

## Privacy & Security

- All session information is stored locally in Chrome.
- No automatic transmission to external servers.
- No audio or video recording.
- No collection of passwords or authentication credentials.
- Zoom webpage access is used exclusively for recorder detection.

## Technical Information

- Platform: Google Chrome
- Architecture: Manifest V3
- Languages: JavaScript, HTML and CSS
- Storage: Chrome Local Storage
- Export Format: CSV

## Developer

**Jai Balaji Kamma**

*An independent productivity tool for meeting timestamp tracking and recording delay analysis. Not affiliated with or endorsed by Zoom.*
