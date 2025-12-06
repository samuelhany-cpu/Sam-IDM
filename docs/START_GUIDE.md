# Starting Sam Download Manager

## Quick Start (Simple UI)

The fastest way to test the download functionality:

```cmd
npm start
```

This will open the app with a simple, working UI where you can:
- Add downloads
- Test the download engine
- Verify all backend functionality works

## Full React UI (Development Mode)

For the complete React interface with all features:

### Option 1: Using dev.bat (Recommended)
```cmd
dev.bat
```

This automatically:
1. Builds the main process
2. Starts Vite dev server
3. Opens the app with full React UI

### Option 2: Manual (2 terminals)

Terminal 1 - Start Vite:
```cmd
npm run dev:vite
```

Terminal 2 - Start Electron:
```cmd
set ELECTRON_START_URL=http://localhost:5173
npm start
```

## Which Mode Should I Use?

### Use Simple UI (`npm start`) when:
- ✅ Testing download functionality quickly
- ✅ You don't need to modify the UI
- ✅ You want the fastest startup
- ✅ Just want to use the app

### Use Full React UI (`dev.bat`) when:
- ✅ Developing/modifying the interface
- ✅ Need all UI features (queues, scheduler dialogs, etc.)
- ✅ Want to customize the appearance
- ✅ Full app experience with hot reload

## Current Status

✅ **Backend**: Fully functional
- Multi-threaded download engine ✅
- Pause/Resume/Cancel ✅
- Download queues ✅
- Scheduler ✅
- Settings management ✅
- All IPC handlers working ✅

✅ **Simple UI**: Working
- Can add downloads ✅
- Shows basic interface ✅
- Electron API connected ✅

⚠️ **Full React UI**: Requires Vite dev server
- Use `dev.bat` to enable
- All React components are ready
- Needs Vite to transpile TypeScript/JSX

## Production Build

To create a standalone installer:

```cmd
npm run build
npm run package
```

The installer will be in the `release/` folder and will include the full React UI.

## Troubleshooting

### Blank white screen
- Make sure you're using either `npm start` (simple UI) or `dev.bat` (full UI)
- Don't use `electron .` directly

### Cannot find module errors in console
- These are TypeScript editor warnings only
- The app runs fine despite these
- They don't affect functionality

### Port 5173 already in use
- Close any running Vite servers
- Or change port in `vite.config.ts`

## Files

- `simple.html` - Basic functional UI (no build required)
- `index.html` - Full React UI entry point (needs Vite)
- `dev.bat` - Start with full React UI
- `run.bat` - Start with simple UI
- `npm start` - Quick start with simple UI
