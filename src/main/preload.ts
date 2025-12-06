import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Download operations
  addDownload: (url: string, options?: any) => ipcRenderer.invoke('download:add', url, options),
  pauseDownload: (id: string) => ipcRenderer.invoke('download:pause', id),
  resumeDownload: (id: string) => ipcRenderer.invoke('download:resume', id),
  cancelDownload: (id: string) => ipcRenderer.invoke('download:cancel', id),
  removeDownload: (id: string) => ipcRenderer.invoke('download:remove', id),
  getAllDownloads: () => ipcRenderer.invoke('download:getAll'),
  openFile: (id: string) => ipcRenderer.invoke('download:openFile', id),
  openFolder: (id: string) => ipcRenderer.invoke('download:openFolder', id),

  // Batch operations
  addBatchDownloads: (urls: string[], options?: any) =>
    ipcRenderer.invoke('download:addBatch', urls, options),
  startAllDownloads: () => ipcRenderer.invoke('download:startAll'),
  pauseAllDownloads: () => ipcRenderer.invoke('download:pauseAll'),

  // Queue operations
  createQueue: (name: string) => ipcRenderer.invoke('queue:create', name),
  getAllQueues: () => ipcRenderer.invoke('queue:getAll'),
  addToQueue: (queueId: string, downloadId: string) =>
    ipcRenderer.invoke('queue:addToQueue', queueId, downloadId),
  startQueue: (queueId: string) => ipcRenderer.invoke('queue:start', queueId),

  // Category operations
  getAllCategories: () => ipcRenderer.invoke('category:getAll'),
  addCategory: (category: any) => ipcRenderer.invoke('category:add', category),

  // Scheduler operations
  addScheduleTask: (task: any) => ipcRenderer.invoke('scheduler:add', task),
  getAllScheduleTasks: () => ipcRenderer.invoke('scheduler:getAll'),
  removeScheduleTask: (taskId: string) => ipcRenderer.invoke('scheduler:remove', taskId),

  // Settings operations
  getSettings: (key?: string) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
  selectFolder: () => ipcRenderer.invoke('settings:selectFolder'),

  // File system operations
  openFolderPath: (path: string) => ipcRenderer.invoke('fs:openFolder', path),

  // Capture methods
  toggleClipboardMonitor: (enabled: boolean) =>
    ipcRenderer.invoke('capture:toggle-clipboard', enabled),
  getCaptureStatus: () => ipcRenderer.invoke('capture:get-status'),
  onUrlCaptured: (callback: (data: { url: string; method: string }) => void) => {
    ipcRenderer.on('url-captured', (_, data) => callback(data));
  },

  // Event listeners
  onDownloadProgress: (callback: (download: any) => void) => {
    ipcRenderer.on('download:progress', (_, download) => callback(download));
  },
  onDownloadCompleted: (callback: (download: any) => void) => {
    ipcRenderer.on('download:completed', (_, download) => callback(download));
  },
  onDownloadError: (callback: (data: any) => void) => {
    ipcRenderer.on('download:error', (_, data) => callback(data));
  },
});
