# Changelog

All notable changes to Sam Download Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-06

### Added - Core Features
- **Multi-threaded Download Engine**: Up to 8 parallel connections per file for maximum speed
- **Pause/Resume/Cancel**: Full control over download lifecycle
- **Queue Management**: Organized download queue with automatic processing
- **Download Scheduler**: Schedule downloads for specific times and days
- **Settings Manager**: Persistent configuration with JSON storage

### Added - Browser Integration 🌐
- **Chrome Extension**: Intercepts downloads from Chrome, Edge, Brave, and Opera
- **Interactive Dialog**: "Download Now", "Download Later", or "Cancel" options
- **HTTP Server**: Localhost server on port 8765 for browser-to-app communication
- **Smart Fallback**: Resumes browser download if Sam is not running
- **Notifications**: User feedback for download interception

### Added - File Organization 📁
- **Auto-categorization**: 13 intelligent categories (Compressed, Music, Video, Images, Documents, Programs, Code, Data, Fonts, Ebooks, 3D Models, Disk Images, Other)
- **100+ File Types**: Comprehensive extension mapping
- **Auto-folder Creation**: Automatic folder structure in Downloads directory
- **Category Icons**: Visual indicators (📦🎵🖼️💻📄🎬📊🔤📚🎨💿📁)

### Added - User Interface 🎨
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Multi-select**: Checkboxes for bulk operations
- **Bulk Delete**: Remove multiple downloads with confirmation dialog
- **Sortable Columns**: Sort by filename, size, progress, speed, status, or date
- **Filter Views**: View all, downloading, completed, or paused items
- **System Tray**: Minimize to tray with quick access menu
- **Auto-refresh**: UI updates every 2 seconds

### Added - Advanced Download Features
- **Three-tier Fallback**: HEAD request → GET with Range → Streaming mode
- **Streaming Download**: Support for files without Content-Length header
- **Smart Retry**: Exponential backoff on connection failures
- **Progress Tracking**: Real-time speed, ETA, and percentage
- **Concurrent Control**: Limit simultaneous downloads

### Added - Technical
- **TypeScript**: Type-safe development with strict compilation
- **React 18**: Modern UI framework with hooks
- **Vite 5**: Fast development server with HMR
- **Electron 30+**: Desktop application framework
- **ESLint + Prettier**: Code quality and formatting tools

### Fixed
- Queue not processing after download completion
- Content-Length: 0 from HEAD requests on some servers
- Remove button not updating UI
- Delete confirmation dialog in dark mode
- File organization not creating folders
- Download status not persisting

### Technical Details
- Built with Electron 28.3.3
- React 18.2.0
- TypeScript 5.0+
- Vite 5.4.21
- Node.js 18+ required

### Known Issues
- ESLint 9.x requires new config format (migration in progress)
- Some servers return 403/404 for test downloads (server-side issue)
- Large files (>4GB) not yet tested extensively

## [Unreleased]

### Planned for v1.1.0
- Firefox extension support
- Safari extension support
- Protocol handler (sdm:// links)
- Drag & drop URL support
- Import/Export download list
- Download history with search
- File verification (checksums)
- Bandwidth limiter
- Mirror support
- Proxy configuration
- HTTP authentication (Basic/Digest)

### Planned for v1.2.0
- Video downloader integration (YouTube, etc.)
- Cloud storage integration (Google Drive, OneDrive)
- Mobile companion app
- Remote download management
- Internationalization (i18n)
- Custom themes
- Plugin system

### Future Considerations
- Torrent support
- FTP/SFTP downloads
- Download segments visualization
- Statistics dashboard
- Browser bookmarklet
- Command-line interface
- Docker container support

---

## Release Notes

### v1.0.0 - First Stable Release 🎉

This is the first stable release of Sam Download Manager! After extensive testing and development, we're proud to deliver a powerful, feature-rich download manager that rivals commercial alternatives.

**Highlights:**
- Complete browser integration for Chrome and Edge
- Intelligent file categorization with 13 categories
- Beautiful dark mode for comfortable use
- Multi-threaded downloads for maximum speed
- Robust error handling and retry mechanisms

**Installation:**
1. Download the installer from the Releases page
2. Run the setup wizard
3. Install the browser extension (optional but recommended)
4. Start managing your downloads like a pro!

**System Requirements:**
- Windows 10/11 (64-bit)
- 4GB RAM minimum
- Node.js 18+ (for development only)

**Credits:**
Special thanks to all contributors and testers who helped make this release possible.

---

[1.0.0]: https://github.com/yourusername/sam-download-manager/releases/tag/v1.0.0
