# Contributing to Sam Download Manager

First off, thank you for considering contributing to Sam Download Manager! It's people like you that make this project great.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```
**Description:**
A clear and concise description of the bug.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What you expected to happen.

**Actual Behavior:**
What actually happened.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Sam Version: [e.g., 1.0.0]
- Browser: [e.g., Chrome 120]

**Additional Context:**
Any other relevant information.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Enhancement Template:**
```
**Feature Description:**
A clear description of the feature.

**Problem It Solves:**
What problem does this solve?

**Proposed Solution:**
How would you implement this?

**Alternatives Considered:**
What alternatives have you considered?

**Additional Context:**
Any mockups, examples, or references.
```

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Run the test suite
6. Commit your changes
7. Push to your fork
8. Open a Pull Request

**Pull Request Guidelines:**
- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep PRs focused and small

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Windows 10/11 (for Windows development)

### Setup Steps

```cmd
# Clone your fork
git clone https://github.com/your-username/sam-download-manager.git
cd sam-download-manager

# Add upstream remote
git remote add upstream https://github.com/original-repo/sam-download-manager.git

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

### Project Structure

```
sam-download-manager/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts              # Entry point
│   │   ├── downloadManager.ts   # Download engine
│   │   ├── schedulerManager.ts  # Scheduler
│   │   └── settingsManager.ts   # Settings
│   ├── renderer/       # React UI
│   │   ├── App.tsx              # Main component
│   │   ├── components/          # UI components
│   │   └── styles/              # CSS files
│   └── preload.ts      # Context bridge
├── browser-extension/  # Chrome extension
├── docs/              # Documentation
└── tests/             # Test files
```

## Coding Guidelines

### TypeScript Style

- Use TypeScript for all new code
- Avoid `any` types when possible
- Define interfaces for complex objects
- Use meaningful variable names
- Add JSDoc comments for public functions

**Example:**
```typescript
/**
 * Downloads a file from the given URL
 * @param url - The URL to download from
 * @param filename - Optional custom filename
 * @returns Promise that resolves when download starts
 */
async function downloadFile(url: string, filename?: string): Promise<void> {
  // Implementation
}
```

### React Style

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and small
- Use meaningful prop names
- Add prop type definitions

**Example:**
```typescript
interface DownloadItemProps {
  download: Download;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRemove: (id: string) => void;
}

function DownloadItem({ download, onPause, onResume, onRemove }: DownloadItemProps) {
  // Component implementation
}
```

### CSS Style

- Use CSS custom properties for theming
- Follow BEM naming convention when appropriate
- Keep selectors specific but not overly nested
- Support dark mode with `.dark-mode` class
- Use meaningful class names

**Example:**
```css
.download-item {
  background: var(--card-bg);
  color: var(--text-color);
}

.dark-mode .download-item {
  background: var(--card-bg-dark);
  color: var(--text-color-dark);
}
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add video downloader support
fix: resolve memory leak in download manager
docs: update installation instructions
style: format code with prettier
refactor: extract download logic into separate module
test: add unit tests for file categorization
chore: update dependencies
```

## Submitting Changes

### Before Submitting

1. **Run linting:**
   ```cmd
   npm run lint
   npm run lint:fix
   ```

2. **Format code:**
   ```cmd
   npm run format
   ```

3. **Type check:**
   ```cmd
   npm run type-check
   ```

4. **Run tests:**
   ```cmd
   npm test
   ```

5. **Build the app:**
   ```cmd
   npm run build
   ```

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review feedback
6. Wait for approval and merge

### After Your PR is Merged

- Delete your feature branch
- Update your local repository
- Celebrate! 🎉

## Testing

### Running Tests

```cmd
# Run all tests
npm test

# Run specific test file
node test-suite.js

# Run browser integration tests
node test-browser-integration.js
```

### Writing Tests

- Write tests for new features
- Update tests when changing existing features
- Aim for high code coverage
- Test edge cases and error scenarios

## Questions?

Don't hesitate to ask questions! You can:
- Open an issue with the "question" label
- Start a discussion on GitHub Discussions
- Contact the maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Sam Download Manager! 🚀
