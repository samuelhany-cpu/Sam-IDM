# Sam Download Manager

A powerful, feature-rich download manager built with Electron, React, and TypeScript. Sam provides advanced download management with browser integration, automatic file categorization, dark mode, and multi-threaded downloading for maximum speed.

## ✨ Features

### Core Download Features
- 🚀 **Multi-threaded Downloads**: Parallel segment downloading with up to 8 connections
- 📊 **Real-time Progress**: Live download speed, progress, and ETA tracking
- ⏸️ **Pause/Resume**: Full control over your downloads with resume capability
- 🔄 **Auto-retry**: Intelligent retry with exponential backoff on failures
- 📦 **Queue Management**: Organized download queue with priority support
- 🎯 **Smart Fallback**: Three-tier file size detection (HEAD → GET → Streaming)

### Browser Integration 🌐
- **Chrome Extension**: Intercepts downloads from your browser automatically
- **Interactive Dialog**: Choose "Download Now", "Download Later", or "Cancel"
- **Notifications**: Stay informed about download status
- **Secure Communication**: Localhost-only HTTP server on port 8765

### File Organization 📁
- **Auto-categorization**: 13 intelligent categories for your files
- **Category Icons**: Visual indicators (📦🎵🖼️💻📄🎬📊🔤📚🎨💿📁)
- **Auto-folder Creation**: Organized folder structure in Downloads
- **100+ File Types**: Supports all common file extensions

### User Interface 🎨
- 🌙 **Dark Mode**: Easy on the eyes with persistent theme preference
- ☑️ **Multi-select**: Bulk operations for multiple downloads
- 📊 **Sortable Columns**: Sort by name, size, progress, speed, status, or date
- 🔍 **Filtering**: View all, downloading, completed, or paused items
- 🖥️ **System Tray**: Minimize to tray for background operation

### Advanced Features ⚙️
- ⏰ **Download Scheduler**: Schedule downloads for specific times and days
- 🚦 **Concurrent Control**: Limit simultaneous downloads
- 📈 **Progress Tracking**: Real-time speed, ETA, and completion percentage
- 💾 **Persistent Storage**: All settings and queue saved automatically

## 📋 System Requirements

- **Operating System**: Windows 10/11 (64-bit)
- **Node.js**: 18.x or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 100MB for application, plus space for downloads

## 🚀 Installation

### For Developers

```cmd
# Clone the repository
git clone https://github.com/yourusername/sam-download-manager.git
cd sam-download-manager

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 🌐 Browser Extension Setup

1. Open Chrome/Edge and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `browser-extension` folder from the project directory
5. The extension icon will appear in your browser toolbar

For detailed instructions, see [BROWSER_INTEGRATION.md](./BROWSER_INTEGRATION.md)

4. **Package for Distribution**
```cmd
npm run package
```

The installer will be created in the `release` folder.

## Usage

### Adding Downloads

1. Click "Add Download" button
2. Enter URL or paste multiple URLs (one per line)
3. Optionally specify save location
4. Click "Add" to start downloading

### Managing Downloads

- **Pause**: Click pause button to temporarily stop
- **Resume**: Click play button to continue
- **Cancel**: Stop and delete partial file
- **Remove**: Remove from list
- **Open File**: Open completed file
- **Open Folder**: Show file in folder

### Creating Queues

1. Click "Queues" button
2. Enter queue name and click "Create Queue"
3. Drag downloads to queue or use context menu
4. Start queue to download sequentially

### Scheduling Tasks

1. Click "Scheduler" button
2. Click "Add Schedule Task"
3. Configure task name, type, and schedule (cron format)
4. Task will run automatically at scheduled time

### Settings

Click the settings gear icon to configure:
- **Download folder**: Default save location
- **Max concurrent downloads**: How many files to download simultaneously (1-20)
- **Segments per download**: Number of parallel connections (1-16)
- **Speed limit**: Bandwidth throttling (0 = unlimited)
- **Auto-start**: Start downloads immediately when added
- **Minimize to tray**: Keep running in background

## Performance Optimization

The download engine is optimized for maximum speed:

1. **Dynamic Segmentation**: Files are split into multiple segments downloaded in parallel
2. **Connection Reuse**: Existing connections are reused to avoid overhead
3. **Adaptive Threading**: Automatically adjusts based on server capabilities
4. **Memory Efficient**: Streams data directly to disk without loading into memory
5. **Native Performance**: Uses Node.js native modules for I/O operations

### Recommended Settings

For best performance:
- **Segments**: 8 (for files > 10MB)
- **Concurrent Segments**: 4
- **Max Concurrent Downloads**: 5
- **Speed Limit**: 0 (unlimited)

## Architecture

### Technology Stack
- **Electron**: Desktop application framework
- **TypeScript**: Type-safe development
- **React**: User interface
- **Node.js**: Backend logic and download engine
- **electron-store**: Persistent settings storage

### Project Structure
```
src/
├── main/              # Electron main process (backend)
│   ├── main.ts        # Application entry point
│   ├── downloadManager.ts    # Download engine
│   ├── scheduler.ts   # Task scheduler
│   ├── settings.ts    # Settings management
│   └── preload.ts     # IPC bridge
└── renderer/          # React UI (frontend)
    ├── App.tsx        # Main application
    ├── components/    # UI components
    └── styles/        # CSS styles
```

## Development

### Scripts

- `npm run dev` - Start development mode
- `npm run build` - Build for production
- `npm run start` - Start production build
- `npm run package` - Create installer

### Adding Features

The codebase is modular and easy to extend:

1. **New download features**: Modify `downloadManager.ts`
2. **UI components**: Add to `src/renderer/components/`
3. **Settings**: Update `settings.ts` and SettingsDialog
4. **IPC handlers**: Add to `main.ts` setupIpcHandlers()

## Troubleshooting

### Downloads not starting
- Check internet connection
- Verify URL is accessible
- Check max concurrent downloads setting

### Slow download speeds
- Increase segments per download
- Remove speed limit
- Check system network performance

### Application won't start
- Ensure Node.js is installed
- Run `npm install` again
- Check for port conflicts

## License

MIT License - Free for personal and commercial use

## Support

For issues, feature requests, or contributions, please contact the developer.

---

Built with performance and reliability in mind.
