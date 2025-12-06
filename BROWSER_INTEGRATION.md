# Browser Integration

This feature allows Sam Download Manager to intercept downloads from your web browser, giving you full control over when and how files are downloaded.

## How It Works

1. **Chrome Extension**: A browser extension monitors all download attempts
2. **Download Interception**: When a download starts, the extension cancels it and sends the URL to Sam
3. **User Choice**: Sam shows a dialog asking if you want to "Download Now", "Download Later", or "Cancel"
4. **Smart Queueing**: Downloads are added to your queue based on your choice

## Installation

### Step 1: Install the Chrome Extension

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from the Sam installation directory
5. The extension will appear in your extensions list

### Step 2: Verify Sam is Running

- Sam must be running for the browser integration to work
- The app listens on `localhost:8765` for download requests
- If Sam isn't running, the browser will proceed with the normal download

## Features

### Download Now
- Immediately starts downloading the file
- File is saved to the appropriate category folder
- Progress is shown in real-time in Sam

### Download Later
- Adds the file to your download queue in "Paused" state
- You can start it manually when ready
- Useful for scheduling downloads or managing bandwidth

### Cancel
- Ignores the download completely
- Neither Sam nor the browser will download the file

## Technical Details

### HTTP Server
- **Port**: 8765
- **Host**: localhost only (for security)
- **Endpoints**:
  - `POST /add-download` - Receives download requests from browser
  - `POST /open-app` - Brings Sam to the foreground

### Extension Permissions
- `downloads` - Required to intercept download events
- `nativeMessaging` - For communication with Sam
- `notifications` - To show status messages
- `<all_urls>` - To handle downloads from any website

### Security
- The HTTP server only accepts connections from localhost
- CORS is enabled but restricted to local origins
- All download URLs are validated before processing

## Troubleshooting

### Extension Not Working
1. Check that Sam is running
2. Verify the extension is enabled in `chrome://extensions/`
3. Check for errors in the extension's console (click "Errors" button)

### Downloads Still Go to Browser
- This happens if Sam isn't running or port 8765 is blocked
- The extension will automatically resume the browser download as fallback
- Check Sam's console for "Browser integration server listening" message

### Port 8765 Already in Use
- Another application may be using port 8765
- Close other applications or restart your computer
- Sam will log an error: "Port 8765 is already in use"

## Fallback Behavior

If Sam Download Manager is not running when a download is triggered:
1. The extension tries to contact Sam on `localhost:8765`
2. If the connection fails, a notification is shown
3. The browser's normal download resumes automatically
4. No downloads are lost!

## Supported Browsers

- ✅ Google Chrome (version 88+)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera (Chromium-based)
- ❌ Firefox (requires different extension format)
- ❌ Safari (requires different extension format)

## Future Enhancements

- [ ] Firefox extension version
- [ ] Safari extension version
- [ ] Custom protocol handler (`sdm://` links)
- [ ] File type filtering (only intercept specific types)
- [ ] Auto-categorization preview in dialog
- [ ] Download scheduling directly from browser
