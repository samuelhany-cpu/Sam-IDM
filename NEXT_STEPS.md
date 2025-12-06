# Next Steps for GitHub Release

This guide walks through the remaining tasks to prepare Sam Download Manager for GitHub release.

## 🎯 Immediate Actions Required

### 1. Test the Browser Integration (15 minutes)

The HTTP server is now implemented. Test it:

```cmd
# Make sure Sam is running
npm run dev

# In another terminal, test the server
curl -X POST http://localhost:8765/add-download -H "Content-Type: application/json" -d "{\"url\":\"https://example.com/file.zip\",\"filename\":\"test.zip\"}"
```

**Expected behavior:**
- Sam window should come to foreground
- Dialog appears: "Download Now", "Download Later", "Cancel"
- Clicking a button adds download to queue

**To test with browser:**
1. Load the extension in Chrome (`chrome://extensions/`)
2. Click any download link on a website
3. Sam should intercept and show the dialog

### 2. Run Code Linting (10 minutes)

```cmd
# Check for errors
npm run lint

# Auto-fix what can be fixed
npm run lint:fix

# Check remaining issues
npm run lint
```

**Expected issues to fix manually:**
- Remove unused variables
- Fix `any` types with proper types
- Remove console.log statements (keep console.error/warn)
- Add missing return types

### 3. Format All Code (5 minutes)

```cmd
# Check formatting
npm run format:check

# Apply formatting
npm run format
```

This will standardize indentation, quotes, semicolons, etc.

### 4. Create Extension Icons (20 minutes)

Quick solution - create simple icons:

```cmd
# Create browser-extension/icons folder
mkdir browser-extension\icons
```

Then:
1. Use https://favicon.io/favicon-generator/
2. Generate icons with text "SDM" or "Sam"
3. Download and extract
4. Rename to icon16.png, icon48.png, icon128.png
5. Copy to browser-extension/ folder

Or use the main app icon if you have one.

### 5. Update .gitignore (2 minutes)

Ensure these are in .gitignore:
```
node_modules/
dist/
build/
out/
release/
*.log
.env
downloads.json
settings.json
.DS_Store
Thumbs.db
```

Check current .gitignore:
```cmd
type .gitignore
```

### 6. Create GitHub Repository (10 minutes)

1. Go to https://github.com/new
2. Repository name: `sam-download-manager`
3. Description: "A powerful download manager with browser integration, multi-threading, and automatic file categorization"
4. **Choose visibility**: Public or Private
5. **DO NOT** initialize with README (we have one)
6. Click "Create repository"

Then push:
```cmd
git init
git add .
git commit -m "Initial commit: Sam Download Manager v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sam-download-manager.git
git push -u origin main
```

## 📦 Building the Installer

### Prerequisites

Update package.json build config (already done):
```json
"build": {
  "appId": "com.sam.downloadmanager",
  "productName": "Sam Download Manager",
  "win": {
    "target": ["nsis"],
    "icon": "build/icon.ico"
  }
}
```

### Create App Icon (Optional but Recommended)

You need a `build/icon.ico` file. Quick solution:

1. Find or create a 256×256 PNG icon
2. Convert to ICO using https://convertio.co/png-ico/
3. Save as `build/icon.ico`

### Build the Installer

```cmd
# Build the app
npm run build

# Create installer (will be in release/ folder)
npm run package
```

**Output:**
- `release/Sam Download Manager Setup 1.0.0.exe` - Installer
- `release/win-unpacked/` - Portable version

**Installer size:** ~150-200MB (includes Electron runtime)

## 🧪 Testing the Installer

Test on a **clean system or VM**:

1. Copy installer to test machine
2. Run `Sam Download Manager Setup 1.0.0.exe`
3. Follow installation wizard
4. Launch Sam from Start Menu
5. Test all features:
   - Add download via URL
   - Test browser extension
   - Test pause/resume
   - Test dark mode
   - Test multi-select delete
   - Test file categorization
   - Check Downloads folder structure
   - Test system tray
   - Test scheduler

## 📝 Documentation Tasks

### Create CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2024-XX-XX

### Added
- Multi-threaded download engine with up to 8 parallel connections
- Browser integration (Chrome extension)
- Dark mode with persistent preference
- Multi-select with bulk delete
- Automatic file categorization (13 categories)
- Sortable columns
- Download scheduler
- System tray integration
- Real-time progress tracking

### Features
- Pause/Resume/Cancel downloads
- Smart fallback (HEAD → GET → Streaming)
- Auto-folder creation
- Queue management
- Settings persistence

### Technical
- Built with Electron 30+
- React 18 UI
- TypeScript 5
- Vite 5 for fast development
```

### Create LICENSE

If using MIT License:
```cmd
# Create LICENSE file
echo. > LICENSE
```

Then add MIT License text or use GitHub's template.

### Create CONTRIBUTING.md

Basic template:
```markdown
# Contributing to Sam Download Manager

## How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Format code: `npm run format`
7. Commit with clear message
8. Push and create Pull Request

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Add JSDoc comments for public APIs
- Write tests for new features

## Bug Reports

Use the issue tracker with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- System information
- Screenshots if applicable
```

## 🚀 Release Process

### 1. Prepare Release

```cmd
# Update version
npm version 1.0.0

# Build everything
npm run build
npm run package

# Test installer
# (run on clean machine)
```

### 2. Create GitHub Release

1. Go to repository → Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Title: `Sam Download Manager v1.0.0`
4. Description:
```markdown
## Sam Download Manager v1.0.0

First stable release! 🎉

### Features
- Multi-threaded downloads (up to 8x faster)
- Browser integration (Chrome/Edge)
- Dark mode
- Auto-categorization (13 categories)
- Multi-select bulk operations
- Smart download fallback
- Download scheduler

### Download
- **Installer**: Sam-Download-Manager-Setup-1.0.0.exe (150MB)
- **Portable**: Sam-Download-Manager-1.0.0-Portable.zip (140MB)

### Requirements
- Windows 10/11 (64-bit)
- 4GB RAM minimum

### Installation
1. Download installer
2. Run and follow wizard
3. Install browser extension (see README)

For more information, see [README.md](README.md)
```

5. Upload files:
   - Installer exe
   - Portable zip (create by zipping win-unpacked folder)
   - SHA256 checksums

6. Click "Publish release"

### 3. Generate Checksums

```cmd
cd release
certutil -hashfile "Sam Download Manager Setup 1.0.0.exe" SHA256 > checksums.txt
```

## 📊 Post-Release

### Monitor

- GitHub Issues
- User feedback
- Error reports
- Feature requests

### Update README

Add badges:
```markdown
![GitHub release](https://img.shields.io/github/v/release/username/sam-download-manager)
![GitHub downloads](https://img.shields.io/github/downloads/username/sam-download-manager/total)
![License](https://img.shields.io/github/license/username/sam-download-manager)
```

### Share

- Reddit: r/programming, r/software
- Hacker News
- Product Hunt
- Twitter/X
- Dev.to

## 🐛 Known Issues Before Release

Must fix:
- [ ] Test on Windows 11
- [ ] Test with antivirus software
- [ ] Test installer with UAC enabled
- [ ] Verify all dialogs work in dark mode
- [ ] Test with special characters in filenames
- [ ] Test with very long URLs
- [ ] Check memory usage over time

Nice to fix:
- [ ] Improve error messages
- [ ] Add tooltips
- [ ] Better loading states
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements

## ⏰ Estimated Timeline

- **Testing & Bug Fixes**: 2-3 hours
- **Documentation**: 1-2 hours  
- **Icon Creation**: 30 minutes
- **Build & Test Installer**: 1 hour
- **GitHub Setup**: 30 minutes
- **Release**: 30 minutes

**Total**: 5-7 hours

## 📞 Need Help?

Common issues:

**Build fails:**
- Delete node_modules and run `npm install`
- Check Node.js version: `node --version` (should be 18+)

**Installer too large:**
- Normal! Electron includes Chromium runtime
- Consider asar archive: add `"asar": true` to build config

**Extension not working:**
- Check manifest.json syntax
- Verify permissions
- Check background.js for errors
- Ensure Sam is running on port 8765

---

**Ready to release?** Start with step 1 (Browser Integration Testing) and work through the checklist!
