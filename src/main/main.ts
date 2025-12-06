import { app, BrowserWindow, ipcMain, Tray, Menu, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import { DownloadManager } from './downloadManager';
import { SchedulerManager } from './scheduler';
import { SettingsManager } from './settings';
import { CaptureManager } from './captureManager';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let downloadManager: DownloadManager;
let schedulerManager: SchedulerManager;
let settingsManager: SettingsManager;
let captureManager: CaptureManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Load the renderer
  const isDev = !app.isPackaged;
  const startUrl = process.env.ELECTRON_START_URL;
  const testMode = process.env.ELECTRON_TEST_MODE;

  if (testMode) {
    // Test runner mode
    mainWindow.loadFile(path.join(__dirname, '../../test-runner.html'));
    mainWindow.webContents.openDevTools();
  } else if (startUrl) {
    // Using Vite dev server
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
  } else if (isDev) {
    // Development mode - use simple HTML
    mainWindow.loadFile(path.join(__dirname, '../../simple.html'));
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode - use built React app
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (settingsManager.get('minimizeToTray')) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Skip tray creation if no icon available
  const iconPath = path.join(__dirname, '../../assets/icon.png');
  if (!fs.existsSync(iconPath)) {
    console.log('Tray icon not found, skipping tray creation');
    return;
  }

  try {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          mainWindow?.show();
        },
      },
      {
        label: 'Start All Downloads',
        click: () => {
          downloadManager.startAll();
        },
      },
      {
        label: 'Pause All Downloads',
        click: () => {
          downloadManager.pauseAll();
        },
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setToolTip('Sam Download Manager');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      mainWindow?.show();
    });
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
}

function startBrowserIntegrationServer() {
  const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/add-download') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const { url, filename } = data;

          // Show the main window
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }

          // Show dialog to user
          dialog
            .showMessageBox(mainWindow!, {
              type: 'question',
              buttons: ['Download Now', 'Download Later', 'Cancel'],
              defaultId: 0,
              title: 'New Download',
              message: 'A download was intercepted from your browser',
              detail: `URL: ${url}\nFilename: ${filename || 'Unknown'}\n\nWhat would you like to do?`,
            })
            .then((response) => {
              if (response.response === 0) {
                // Download Now
                downloadManager.addDownload(url, filename);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, action: 'now' }));
              } else if (response.response === 1) {
                // Download Later (add to queue but don't start)
                downloadManager.addDownload(url, filename);
                downloadManager.pauseDownload(url);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, action: 'later' }));
              } else {
                // Cancel
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, action: 'cancelled' }));
              }
            });
        } catch (error) {
          console.error('Error parsing download request:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
        }
      });
    } else if (req.method === 'POST' && req.url === '/open-app') {
      // Just bring the app to front
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });

  server.listen(8765, 'localhost', () => {
    console.log('Browser integration server listening on http://localhost:8765');
  });

  server.on('error', (error: any) => {
    if (error.code === 'EADDRINUSE') {
      console.error('Port 8765 is already in use. Browser integration will not work.');
    } else {
      console.error('Server error:', error);
    }
  });
}

app.whenReady().then(() => {
  // Initialize managers
  settingsManager = new SettingsManager();
  downloadManager = new DownloadManager(settingsManager);
  schedulerManager = new SchedulerManager(downloadManager, settingsManager);
  captureManager = new CaptureManager();

  createWindow();
  createTray();

  // Set capture manager window reference
  if (mainWindow) {
    captureManager.setMainWindow(mainWindow);
  }

  // Set up IPC handlers
  setupIpcHandlers();

  // Start browser integration server
  startBrowserIntegrationServer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function setupIpcHandlers() {
  // Download operations
  ipcMain.handle('download:add', async (_, url: string, options?: any) => {
    return await downloadManager.addDownload(url, options);
  });

  ipcMain.handle('download:pause', async (_, id: string) => {
    return await downloadManager.pauseDownload(id);
  });

  ipcMain.handle('download:resume', async (_, id: string) => {
    return await downloadManager.resumeDownload(id);
  });

  ipcMain.handle('download:cancel', async (_, id: string) => {
    return await downloadManager.cancelDownload(id);
  });

  ipcMain.handle('download:remove', async (_, id: string) => {
    return await downloadManager.removeDownload(id);
  });

  ipcMain.handle('download:getAll', async () => {
    return downloadManager.getAllDownloads();
  });

  ipcMain.handle('download:openFile', async (_, id: string) => {
    const download = downloadManager.getDownload(id);
    if (download && download.status === 'completed') {
      shell.openPath(download.filePath);
    }
  });

  ipcMain.handle('download:openFolder', async (_, id: string) => {
    const download = downloadManager.getDownload(id);
    if (download) {
      shell.showItemInFolder(download.filePath);
    }
  });

  // Batch operations
  ipcMain.handle('download:addBatch', async (_, urls: string[], options?: any) => {
    return await downloadManager.addBatchDownloads(urls, options);
  });

  ipcMain.handle('download:startAll', async () => {
    return downloadManager.startAll();
  });

  ipcMain.handle('download:pauseAll', async () => {
    return downloadManager.pauseAll();
  });

  // Queue operations
  ipcMain.handle('queue:create', async (_, name: string) => {
    return downloadManager.createQueue(name);
  });

  ipcMain.handle('queue:getAll', async () => {
    return downloadManager.getAllQueues();
  });

  ipcMain.handle('queue:addToQueue', async (_, queueId: string, downloadId: string) => {
    return downloadManager.addToQueue(queueId, downloadId);
  });

  ipcMain.handle('queue:start', async (_, queueId: string) => {
    return downloadManager.startQueue(queueId);
  });

  // Category operations
  ipcMain.handle('category:getAll', async () => {
    return downloadManager.getAllCategories();
  });

  ipcMain.handle('category:add', async (_, category: any) => {
    return downloadManager.addCategory(category);
  });

  // Scheduler operations
  ipcMain.handle('scheduler:add', async (_, task: any) => {
    return schedulerManager.addTask(task);
  });

  ipcMain.handle('scheduler:getAll', async () => {
    return schedulerManager.getAllTasks();
  });

  ipcMain.handle('scheduler:remove', async (_, taskId: string) => {
    return schedulerManager.removeTask(taskId);
  });

  // Settings operations
  ipcMain.handle('settings:get', async (_, key?: string) => {
    return key ? settingsManager.get(key as any) : settingsManager.getAll();
  });

  ipcMain.handle('settings:set', async (_, key: string, value: any) => {
    return settingsManager.set(key as any, value);
  });

  ipcMain.handle('settings:selectFolder', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // File system operations
  ipcMain.handle('fs:openFolder', async (_, folderPath: string) => {
    return shell.openPath(folderPath);
  });

  // Capture methods
  ipcMain.handle('capture:toggle-clipboard', async (_, enabled: boolean) => {
    if (enabled) {
      captureManager.startClipboardMonitor();
    } else {
      captureManager.stopClipboardMonitor();
    }
    return { success: true };
  });

  ipcMain.handle('capture:get-status', async () => {
    return captureManager.getStats();
  });

  // Listen for download progress updates
  downloadManager.on('progress', (download: any) => {
    mainWindow?.webContents.send('download:progress', download);
  });

  downloadManager.on('completed', (download: any) => {
    mainWindow?.webContents.send('download:completed', download);
  });

  downloadManager.on('error', (download: any, error: any) => {
    mainWindow?.webContents.send('download:error', { download, error });
  });
}
