/// <reference types="vite/client" />

declare module '*.tsx' {
  import React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface Window {
  electronAPI: {
    addDownload: (url: string, options?: any) => Promise<any>;
    pauseDownload: (id: string) => Promise<void>;
    resumeDownload: (id: string) => Promise<void>;
    cancelDownload: (id: string) => Promise<void>;
    removeDownload: (id: string) => Promise<void>;
    getAllDownloads: () => Promise<any[]>;
    openFile: (id: string) => Promise<void>;
    openFolder: (id: string) => Promise<void>;
    addBatchDownloads: (urls: string[], options?: any) => Promise<any[]>;
    startAllDownloads: () => Promise<void>;
    pauseAllDownloads: () => Promise<void>;
    createQueue: (name: string) => Promise<any>;
    getAllQueues: () => Promise<any[]>;
    addToQueue: (queueId: string, downloadId: string) => Promise<void>;
    startQueue: (queueId: string) => Promise<void>;
    getAllCategories: () => Promise<any[]>;
    addCategory: (category: any) => Promise<void>;
    addScheduleTask: (task: any) => Promise<any>;
    getAllScheduleTasks: () => Promise<any[]>;
    removeScheduleTask: (taskId: string) => Promise<void>;
    getSettings: (key?: string) => Promise<any>;
    setSetting: (key: string, value: any) => Promise<void>;
    selectFolder: () => Promise<string | null>;
    onDownloadProgress: (callback: (download: any) => void) => void;
    onDownloadCompleted: (callback: (download: any) => void) => void;
    onDownloadError: (callback: (data: any) => void) => void;
  };
}
