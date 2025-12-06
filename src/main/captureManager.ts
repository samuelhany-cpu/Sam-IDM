import { clipboard, Notification, BrowserWindow } from 'electron';

export class CaptureManager {
  private mainWindow: BrowserWindow | null = null;
  private clipboardHistory: Set<string> = new Set();
  private clipboardMonitorInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  constructor() {
    console.log('[Capture Manager] Initialized');
  }

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
    console.log('[Capture Manager] Main window set');
  }

  // ==========================================
  // METHOD 1: Clipboard Monitor
  // ==========================================
  startClipboardMonitor() {
    if (this.isMonitoring) {
      console.log('[Capture Manager] Clipboard monitor already running');
      return;
    }

    console.log('[Capture Manager] Starting clipboard monitor...');
    this.isMonitoring = true;

    // Check clipboard every 1 second
    this.clipboardMonitorInterval = setInterval(() => {
      try {
        const text = clipboard.readText();

        // Check if it's a URL and not already processed
        if (this.isValidUrl(text) && !this.clipboardHistory.has(text)) {
          this.clipboardHistory.add(text);
          console.log('[Capture Manager] URL detected in clipboard:', text);

          // Show notification
          this.showCaptureNotification(text, 'clipboard');

          // Keep only last 50 URLs in history to prevent memory leak
          if (this.clipboardHistory.size > 50) {
            const firstItem = Array.from(this.clipboardHistory)[0];
            this.clipboardHistory.delete(firstItem);
          }
        }
      } catch (error) {
        console.error('[Capture Manager] Clipboard read error:', error);
      }
    }, 1000);

    console.log('[Capture Manager] Clipboard monitor started');
  }

  stopClipboardMonitor() {
    if (this.clipboardMonitorInterval) {
      clearInterval(this.clipboardMonitorInterval);
      this.clipboardMonitorInterval = null;
      this.isMonitoring = false;
      console.log('[Capture Manager] Clipboard monitor stopped');
    }
  }

  isClipboardMonitoring(): boolean {
    return this.isMonitoring;
  }

  // ==========================================
  // Helper Methods
  // ==========================================
  private isValidUrl(text: string): boolean {
    if (!text || text.length > 2048 || text.length < 10) return false;

    try {
      const url = new URL(text.trim());
      return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'ftp:';
    } catch {
      return false;
    }
  }

  private showCaptureNotification(url: string, method: string) {
    if (!this.mainWindow) {
      console.log('[Capture Manager] No main window available for notification');
      return;
    }

    try {
      // Show notification
      const notification = new Notification({
        title: 'Download URL Detected',
        body: `From ${method}: ${this.truncateUrl(url, 60)}\nClick to download`,
        icon: undefined, // Use default icon
        timeoutType: 'default',
      });

      notification.on('click', () => {
        console.log('[Capture Manager] Notification clicked for URL:', url);
        // Bring window to front and send URL
        if (this.mainWindow) {
          if (this.mainWindow.isMinimized()) this.mainWindow.restore();
          this.mainWindow.show();
          this.mainWindow.focus();
          this.mainWindow.webContents.send('url-captured', { url, method });
        }
      });

      notification.show();
      console.log('[Capture Manager] Notification shown for URL:', url);
    } catch (error) {
      console.error('[Capture Manager] Failed to show notification:', error);
    }
  }

  private truncateUrl(url: string, maxLength: number): string {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  }

  // Clear history
  clearHistory() {
    this.clipboardHistory.clear();
    console.log('[Capture Manager] Clipboard history cleared');
  }

  // Get stats
  getStats() {
    return {
      monitoring: this.isMonitoring,
      historySize: this.clipboardHistory.size,
    };
  }
}
