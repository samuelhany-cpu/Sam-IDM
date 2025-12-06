# Browser Extension Icons

The browser extension requires three icon sizes for proper display in Chrome/Edge:

## Required Icons

1. **icon16.png** (16×16px) - Extension toolbar icon
2. **icon48.png** (48×48px) - Extension management page
3. **icon128.png** (128×128px) - Chrome Web Store listing

## Temporary Solution

For development, you can use simple placeholder icons or emoji-based icons. Here's how:

### Option 1: Use Existing App Icons
Copy your app icons to the browser-extension folder:
```cmd
copy icons\icon.png browser-extension\icon128.png
```
Then resize for other sizes using an image editor.

### Option 2: Generate Simple Icons
Use an online icon generator like:
- https://favicon.io/
- https://www.iconfinder.com/
- https://icon-icons.com/

### Option 3: Create from Text
Use a simple graphic editor to create icons with:
- Background: Blue gradient (#4A90E2 to #357ABD)
- Text: "SDM" in white, bold font
- Border: 2px white rounded rectangle

## Current Status

⚠️ **Icons are missing** - The manifest.json references icons that don't exist yet.

The extension will still work without icons, but will show a default Chrome extension icon.

## To Add Icons

1. Create the three PNG files (16px, 48px, 128px)
2. Place them in the `browser-extension/` folder
3. Name them: `icon16.png`, `icon48.png`, `icon128.png`
4. Reload the extension in Chrome

## Future: Professional Icons

For production release, create professional icons with:
- Vector format (SVG) for scalability
- Consistent branding with main app
- Clear, recognizable symbol
- Good contrast and visibility
- Proper padding (20% margin recommended)
