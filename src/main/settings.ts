import Store from 'electron-store';

export interface Settings {
  downloadFolder: string;
  maxConcurrentDownloads: number;
  segmentCount: number;
  maxConcurrentSegments: number;
  speedLimit: number;
  autoStart: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
  soundOnComplete: boolean;
  autoShutdown: boolean;
  antivirusScan: boolean;
  browserIntegration: boolean;
  theme: 'light' | 'dark';
}

export class SettingsManager {
  private store: Store<Settings>;

  constructor() {
    const os = require('os');
    const path = require('path');
    const defaultDownloadFolder = path.join(os.homedir(), 'Downloads');

    this.store = new Store<Settings>({
      defaults: {
        downloadFolder: defaultDownloadFolder,
        maxConcurrentDownloads: 5,
        segmentCount: 8,
        maxConcurrentSegments: 4,
        speedLimit: 0,
        autoStart: true,
        minimizeToTray: true,
        closeToTray: true,
        soundOnComplete: true,
        autoShutdown: false,
        antivirusScan: false,
        browserIntegration: true,
        theme: 'light',
      },
    });
  }

  get<K extends keyof Settings>(key: K): Settings[K] {
    return this.store.get(key);
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.store.set(key, value);
  }

  getAll(): Settings {
    return this.store.store;
  }

  reset(): void {
    this.store.clear();
  }
}
