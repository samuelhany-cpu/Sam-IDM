import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { SettingsManager } from './settings';

export interface Download {
  id: string;
  url: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  downloadedSize: number;
  status: 'waiting' | 'downloading' | 'paused' | 'completed' | 'error' | 'cancelled';
  progress: number;
  speed: number;
  timeRemaining: number;
  segments: Segment[];
  category: string;
  queueId?: string;
  createdAt: number;
  completedAt?: number;
  error?: string;
  resumable: boolean;
}

export interface Segment {
  id: number;
  start: number;
  end: number;
  downloaded: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
}

export interface Queue {
  id: string;
  name: string;
  downloads: string[];
  status: 'idle' | 'running' | 'paused';
  concurrent: number;
}

export interface Category {
  id: string;
  name: string;
  extensions: string[];
  folder: string;
}

export class DownloadManager extends EventEmitter {
  private downloads: Map<string, Download> = new Map();
  private queues: Map<string, Queue> = new Map();
  private categories: Category[] = [];
  private activeDownloads: Set<string> = new Set();
  private settings: SettingsManager;

  constructor(settings: SettingsManager) {
    super();
    this.settings = settings;
    this.loadDownloads();
    this.initializeCategories();
  }

  private initializeCategories() {
    this.categories = [
      // Compressed Files
      {
        id: 'compressed',
        name: 'Compressed',
        extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.iso', '.cab', '.arj'],
        folder: 'Compressed',
      },
      // Documents
      {
        id: 'documents',
        name: 'Documents',
        extensions: [
          '.pdf',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
          '.ppt',
          '.pptx',
          '.txt',
          '.rtf',
          '.odt',
          '.ods',
          '.odp',
          '.pages',
          '.numbers',
          '.key',
        ],
        folder: 'Documents',
      },
      // Music/Audio
      {
        id: 'music',
        name: 'Music',
        extensions: [
          '.mp3',
          '.wav',
          '.flac',
          '.aac',
          '.ogg',
          '.wma',
          '.m4a',
          '.opus',
          '.ape',
          '.alac',
        ],
        folder: 'Music',
      },
      // Programs/Executables
      {
        id: 'programs',
        name: 'Programs',
        extensions: ['.exe', '.msi', '.dmg', '.deb', '.rpm', '.apk', '.app', '.bat', '.sh', '.run'],
        folder: 'Programs',
      },
      // Video
      {
        id: 'video',
        name: 'Video',
        extensions: [
          '.mp4',
          '.avi',
          '.mkv',
          '.mov',
          '.wmv',
          '.flv',
          '.webm',
          '.m4v',
          '.mpeg',
          '.mpg',
          '.3gp',
          '.f4v',
          '.vob',
        ],
        folder: 'Video',
      },
      // Images
      {
        id: 'images',
        name: 'Images',
        extensions: [
          '.jpg',
          '.jpeg',
          '.png',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.ico',
          '.tiff',
          '.tif',
          '.raw',
          '.psd',
          '.ai',
          '.heic',
          '.heif',
        ],
        folder: 'Images',
      },
      // Code/Development
      {
        id: 'code',
        name: 'Code',
        extensions: [
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.py',
          '.java',
          '.cpp',
          '.c',
          '.h',
          '.cs',
          '.php',
          '.rb',
          '.go',
          '.rs',
          '.swift',
          '.kt',
          '.json',
          '.xml',
          '.yaml',
          '.yml',
          '.html',
          '.css',
          '.scss',
          '.sass',
        ],
        folder: 'Code',
      },
      // Data Files
      {
        id: 'data',
        name: 'Data',
        extensions: ['.csv', '.sql', '.db', '.sqlite', '.mdb', '.accdb', '.dbf', '.dat'],
        folder: 'Data',
      },
      // Fonts
      {
        id: 'fonts',
        name: 'Fonts',
        extensions: ['.ttf', '.otf', '.woff', '.woff2', '.eot', '.fon'],
        folder: 'Fonts',
      },
      // Ebooks
      {
        id: 'ebooks',
        name: 'Ebooks',
        extensions: ['.epub', '.mobi', '.azw', '.azw3', '.fb2', '.cbr', '.cbz'],
        folder: 'Ebooks',
      },
      // 3D Models
      {
        id: '3d',
        name: '3D Models',
        extensions: ['.obj', '.fbx', '.3ds', '.blend', '.dae', '.stl', '.gltf', '.glb'],
        folder: '3D Models',
      },
      // Disk Images
      {
        id: 'disk',
        name: 'Disk Images',
        extensions: ['.iso', '.img', '.vhd', '.vhdx', '.vmdk', '.qcow2'],
        folder: 'Disk Images',
      },
      // Other/General - fallback for unknown types
      {
        id: 'general',
        name: 'Other',
        extensions: [],
        folder: 'Other',
      },
    ];
  }

  async addDownload(
    url: string,
    options?: { fileName?: string; folder?: string; category?: string; queueId?: string }
  ): Promise<Download> {
    const id = this.generateId();
    const fileName = options?.fileName || this.extractFileName(url);
    const category = options?.category || this.detectCategory(fileName);
    const folder = options?.folder || this.getCategoryFolder(category);
    const filePath = path.join(folder, fileName);

    const download: Download = {
      id,
      url,
      fileName,
      filePath,
      fileSize: 0,
      downloadedSize: 0,
      status: 'waiting',
      progress: 0,
      speed: 0,
      timeRemaining: 0,
      segments: [],
      category,
      queueId: options?.queueId,
      createdAt: Date.now(),
      resumable: false,
    };

    this.downloads.set(id, download);
    this.saveDownloads();

    // Start download immediately if not in queue
    if (!options?.queueId && this.canStartDownload()) {
      this.startDownload(id);
    }

    return download;
  }

  async addBatchDownloads(urls: string[], options?: any): Promise<Download[]> {
    const downloads: Download[] = [];
    for (const url of urls) {
      const download = await this.addDownload(url, options);
      downloads.push(download);
    }
    return downloads;
  }

  private async startDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);
    if (!download || download.status === 'completed') return;

    console.log(`[Download Manager] Starting download: ${download.fileName}`);
    console.log(`[Download Manager] URL: ${download.url}`);

    download.status = 'downloading';
    this.activeDownloads.add(id);
    this.emit('progress', download);

    try {
      // Get file info
      console.log(`[Download Manager] Fetching file info...`);
      const info = await this.getFileInfo(download.url);
      console.log(
        `[Download Manager] File size: ${info.fileSize} bytes, Resumable: ${info.acceptsRanges}`
      );

      // If file size is 0, try streaming download (unknown size)
      if (info.fileSize === 0) {
        console.log(`[Download Manager] Unknown file size, using streaming download...`);
        await this.streamingDownload(download);

        download.status = 'completed';
        download.completedAt = Date.now();
        download.progress = 100;
        this.activeDownloads.delete(id);
        console.log(`[Download Manager] ✓ Download completed: ${download.fileName}`);
        this.emit('completed', download);
        this.saveDownloads();

        // Start next waiting download
        this.processQueue();
        return;
      }

      download.fileSize = info.fileSize;
      download.resumable = info.acceptsRanges;

      // Emit progress with file size
      this.emit('progress', download);

      // Create segments for parallel downloading
      const segmentCount = this.settings.get('segmentCount') || 8;
      if (download.resumable && info.fileSize > 1024 * 1024) {
        download.segments = this.createSegments(info.fileSize, segmentCount);
        console.log(`[Download Manager] Created ${segmentCount} segments for parallel download`);
      } else {
        download.segments = [
          { id: 0, start: 0, end: info.fileSize - 1, downloaded: 0, status: 'pending' },
        ];
        console.log(`[Download Manager] Using single segment download`);
      }

      // Ensure directory exists
      const dir = path.dirname(download.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[Download Manager] Created directory: ${dir}`);
      }

      console.log(`[Download Manager] Saving to: ${download.filePath}`);

      // Create file
      const fd = fs.openSync(download.filePath, 'w');
      fs.closeSync(fd);

      // Download segments in parallel
      console.log(`[Download Manager] Starting segment downloads...`);
      await this.downloadSegments(download);

      download.status = 'completed';
      download.completedAt = Date.now();
      download.progress = 100;
      this.activeDownloads.delete(id);
      console.log(`[Download Manager] ✓ Download completed: ${download.fileName}`);
      this.emit('completed', download);
      this.saveDownloads();

      // Start next waiting download
      this.processQueue();
    } catch (error: any) {
      console.error(`[Download Manager] ✗ Download failed:`, error);
      download.status = 'error';
      download.error = error.message;
      this.activeDownloads.delete(id);
      this.emit('error', download, error);
      this.saveDownloads();

      // Start next waiting download even after error
      this.processQueue();
    }
  }

  private async downloadSegments(download: Download): Promise<void> {
    const maxConcurrent = this.settings.get('maxConcurrentSegments') || 4;
    const activeSegments: Set<number> = new Set();
    const speedLimit = this.settings.get('speedLimit') || 0; // KB/s, 0 = unlimited

    return new Promise((resolve, reject) => {
      let completedSegments = 0;
      let lastUpdate = Date.now();
      let lastDownloaded = 0;

      const downloadNextSegment = () => {
        if (download.status !== 'downloading') {
          reject(new Error('Download paused or cancelled'));
          return;
        }

        const pendingSegment = download.segments.find((s) => s.status === 'pending');
        if (!pendingSegment && activeSegments.size === 0) {
          resolve();
          return;
        }

        if (pendingSegment && activeSegments.size < maxConcurrent) {
          activeSegments.add(pendingSegment.id);
          pendingSegment.status = 'downloading';

          this.downloadSegment(download, pendingSegment, speedLimit)
            .then(() => {
              pendingSegment.status = 'completed';
              activeSegments.delete(pendingSegment.id);
              completedSegments++;

              // Update progress
              const now = Date.now();
              download.downloadedSize = download.segments.reduce((sum, s) => sum + s.downloaded, 0);
              download.progress = (download.downloadedSize / download.fileSize) * 100;

              if (now - lastUpdate >= 500) {
                const timeDiff = (now - lastUpdate) / 1000;
                const sizeDiff = download.downloadedSize - lastDownloaded;
                download.speed = sizeDiff / timeDiff;
                download.timeRemaining =
                  (download.fileSize - download.downloadedSize) / download.speed;

                lastUpdate = now;
                lastDownloaded = download.downloadedSize;

                this.emit('progress', download);
                this.saveDownloads();
              }

              downloadNextSegment();
            })
            .catch((error) => {
              pendingSegment.status = 'error';
              activeSegments.delete(pendingSegment.id);
              reject(error);
            });

          // Continue with next segment
          if (activeSegments.size < maxConcurrent) {
            downloadNextSegment();
          }
        }
      };

      // Start initial segments
      for (let i = 0; i < maxConcurrent; i++) {
        downloadNextSegment();
      }
    });
  }

  private downloadSegment(
    download: Download,
    segment: Segment,
    speedLimit: number,
    redirectCount = 0
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      const url = new URL(download.url);
      const protocol = url.protocol === 'https:' ? https : http;

      const options: any = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          Range: `bytes=${segment.start + segment.downloaded}-${segment.end}`,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
        rejectUnauthorized: false, // Allow expired/self-signed certificates
      };

      const request = protocol.request(options, (response) => {
        // Handle redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 303 ||
          response.statusCode === 307 ||
          response.statusCode === 308
        ) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            // Update download URL to redirect URL
            download.url = redirectUrl;
            this.downloadSegment(download, segment, speedLimit, redirectCount + 1)
              .then(resolve)
              .catch(reject);
            return;
          }
        }

        if (response.statusCode !== 206 && response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const writeStream = fs.createWriteStream(download.filePath, {
          flags: 'r+',
          start: segment.start + segment.downloaded,
        });

        let lastThrottle = Date.now();
        let bytesInInterval = 0;

        response.on('data', (chunk: Buffer) => {
          if (download.status !== 'downloading') {
            request.destroy();
            writeStream.end();
            reject(new Error('Download paused or cancelled'));
            return;
          }

          // Speed limiting
          if (speedLimit > 0) {
            bytesInInterval += chunk.length;
            const now = Date.now();
            const elapsed = now - lastThrottle;

            if (elapsed >= 100) {
              const maxBytes = (speedLimit * 1024 * elapsed) / 1000;
              if (bytesInInterval > maxBytes) {
                const delay = (bytesInInterval / (speedLimit * 1024)) * 1000 - elapsed;
                setTimeout(() => {
                  writeStream.write(chunk);
                }, delay);
                bytesInInterval = 0;
                lastThrottle = now + delay;
              } else {
                writeStream.write(chunk);
              }
            } else {
              writeStream.write(chunk);
            }
          } else {
            writeStream.write(chunk);
          }

          segment.downloaded += chunk.length;
        });

        response.on('end', () => {
          writeStream.end();
          resolve();
        });

        response.on('error', (error) => {
          writeStream.end();
          reject(error);
        });
      });

      request.on('error', reject);
      request.end();
    });
  }

  private getFileInfo(
    url: string,
    redirectCount = 0
  ): Promise<{ fileSize: number; acceptsRanges: boolean }> {
    return new Promise((resolve, reject) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const options: any = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'HEAD',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
        rejectUnauthorized: false, // Allow expired/self-signed certificates
      };

      console.log(`[Download Manager] Getting file info from: ${url}`);

      const request = protocol.request(options, (response) => {
        // Handle redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 303 ||
          response.statusCode === 307 ||
          response.statusCode === 308
        ) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`[Download Manager] Following redirect to: ${redirectUrl}`);
            this.getFileInfo(redirectUrl, redirectCount + 1)
              .then(resolve)
              .catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const fileSize = parseInt(response.headers['content-length'] || '0', 10);
        const acceptsRanges = response.headers['accept-ranges'] === 'bytes';

        console.log(
          `[Download Manager] Status: ${response.statusCode}, Size: ${fileSize}, Ranges: ${acceptsRanges}`
        );

        // If fileSize is 0, try GET request with Range header
        if (fileSize === 0) {
          console.log(`[Download Manager] HEAD returned 0 size, trying GET with Range...`);
          this.getFileInfoWithGet(url, redirectCount).then(resolve).catch(reject);
          return;
        }

        resolve({ fileSize, acceptsRanges });
      });

      request.on('error', (error) => {
        console.error(`[Download Manager] Request error:`, error);
        reject(error);
      });

      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });

      request.end();
    });
  }

  private getFileInfoWithGet(
    url: string,
    redirectCount = 0
  ): Promise<{ fileSize: number; acceptsRanges: boolean }> {
    return new Promise((resolve, reject) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const options: any = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
          Range: 'bytes=0-0', // Request just 1 byte to get Content-Range
        },
        rejectUnauthorized: false,
      };

      console.log(`[Download Manager] Trying GET request with Range header...`);

      const request = protocol.request(options, (response) => {
        // Handle redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 303 ||
          response.statusCode === 307 ||
          response.statusCode === 308
        ) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`[Download Manager] Following redirect to: ${redirectUrl}`);
            this.getFileInfoWithGet(redirectUrl, redirectCount + 1)
              .then(resolve)
              .catch(reject);
            response.resume(); // Consume response data
            return;
          }
        }

        // 206 means partial content (Range supported)
        // 200 means full content (no Range support, but we can get size)
        if (response.statusCode !== 206 && response.statusCode !== 200) {
          response.resume(); // Consume response data
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        let fileSize = 0;
        let acceptsRanges = false;

        if (response.statusCode === 206) {
          // Parse Content-Range: bytes 0-0/12345
          const contentRange = response.headers['content-range'];
          if (contentRange) {
            const match = contentRange.match(/bytes \d+-\d+\/(\d+)/);
            if (match) {
              fileSize = parseInt(match[1], 10);
              acceptsRanges = true;
            }
          }
        } else if (response.statusCode === 200) {
          // Use Content-Length for full response
          fileSize = parseInt(response.headers['content-length'] || '0', 10);
          acceptsRanges = response.headers['accept-ranges'] === 'bytes';
        }

        console.log(
          `[Download Manager] GET Result - Status: ${response.statusCode}, Size: ${fileSize}, Ranges: ${acceptsRanges}`
        );

        // Consume the response data
        response.resume();

        // Always resolve, even with fileSize=0 - let startDownload() handle it
        resolve({ fileSize, acceptsRanges });
      });

      request.on('error', (error) => {
        console.error(`[Download Manager] GET request error:`, error);
        reject(error);
      });

      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('GET request timeout'));
      });

      request.end();
    });
  }

  private streamingDownload(download: Download): Promise<void> {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(download.url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      // Ensure directory exists
      const dir = path.dirname(download.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(download.filePath);
      let downloadedBytes = 0;
      let lastUpdate = Date.now();

      const options: any = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        rejectUnauthorized: false,
      };

      console.log(`[Download Manager] Starting streaming download to: ${download.filePath}`);

      const request = protocol.request(options, (response) => {
        // Handle redirects
        if (
          response.statusCode === 301 ||
          response.statusCode === 302 ||
          response.statusCode === 303 ||
          response.statusCode === 307 ||
          response.statusCode === 308
        ) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            writeStream.close();
            fs.unlinkSync(download.filePath);
            download.url = redirectUrl;
            this.streamingDownload(download).then(resolve).catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          writeStream.close();
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        // Try to get content length (might still be 0)
        const contentLength = parseInt(response.headers['content-length'] || '0', 10);
        if (contentLength > 0) {
          download.fileSize = contentLength;
        }

        response.on('data', (chunk: Buffer) => {
          writeStream.write(chunk);
          downloadedBytes += chunk.length;
          download.downloadedSize = downloadedBytes;

          // Update progress periodically
          const now = Date.now();
          if (now - lastUpdate > 500) {
            if (download.fileSize > 0) {
              download.progress = (downloadedBytes / download.fileSize) * 100;
            }
            download.speed = downloadedBytes / ((now - download.createdAt) / 1000);
            this.emit('progress', download);
            lastUpdate = now;
          }
        });

        response.on('end', () => {
          writeStream.end(() => {
            // Set final file size
            download.fileSize = downloadedBytes;
            download.downloadedSize = downloadedBytes;
            download.progress = 100;
            resolve();
          });
        });

        response.on('error', (error) => {
          writeStream.close();
          reject(error);
        });
      });

      request.on('error', (error) => {
        writeStream.close();
        reject(error);
      });

      request.setTimeout(30000, () => {
        request.destroy();
        writeStream.close();
        reject(new Error('Streaming download timeout'));
      });

      request.end();
    });
  }

  private createSegments(fileSize: number, count: number): Segment[] {
    const segmentSize = Math.floor(fileSize / count);
    const segments: Segment[] = [];

    for (let i = 0; i < count; i++) {
      const start = i * segmentSize;
      const end = i === count - 1 ? fileSize - 1 : (i + 1) * segmentSize - 1;

      segments.push({
        id: i,
        start,
        end,
        downloaded: 0,
        status: 'pending',
      });
    }

    return segments;
  }

  async pauseDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);
    if (download && download.status === 'downloading') {
      download.status = 'paused';
      this.activeDownloads.delete(id);
      this.saveDownloads();
      this.emit('progress', download);
    }
  }

  async resumeDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);
    if (download && download.status === 'paused' && this.canStartDownload()) {
      this.startDownload(id);
    }
  }

  async cancelDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      download.status = 'cancelled';
      this.activeDownloads.delete(id);

      // Delete partial file
      if (fs.existsSync(download.filePath)) {
        fs.unlinkSync(download.filePath);
      }

      this.saveDownloads();
      this.emit('progress', download);
    }
  }

  async removeDownload(id: string): Promise<void> {
    const download = this.downloads.get(id);
    if (download) {
      if (download.status === 'downloading') {
        await this.cancelDownload(id);
      }
      this.downloads.delete(id);
      this.saveDownloads();
    }
  }

  getDownload(id: string): Download | undefined {
    return this.downloads.get(id);
  }

  getAllDownloads(): Download[] {
    return Array.from(this.downloads.values());
  }

  startAll(): void {
    this.downloads.forEach((download) => {
      if (download.status === 'paused' || download.status === 'waiting') {
        if (this.canStartDownload()) {
          this.startDownload(download.id);
        }
      }
    });
  }

  pauseAll(): void {
    this.downloads.forEach((download) => {
      if (download.status === 'downloading') {
        this.pauseDownload(download.id);
      }
    });
  }

  // Queue management
  createQueue(name: string): Queue {
    const id = this.generateId();
    const queue: Queue = {
      id,
      name,
      downloads: [],
      status: 'idle',
      concurrent: 3,
    };
    this.queues.set(id, queue);
    return queue;
  }

  getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  addToQueue(queueId: string, downloadId: string): void {
    const queue = this.queues.get(queueId);
    if (queue) {
      queue.downloads.push(downloadId);
    }
  }

  startQueue(queueId: string): void {
    const queue = this.queues.get(queueId);
    if (queue) {
      queue.status = 'running';
      // Start downloads from queue
      const toStart = queue.downloads.slice(0, queue.concurrent);
      toStart.forEach((id) => this.startDownload(id));
    }
  }

  // Category management
  getAllCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Category): void {
    this.categories.push(category);
  }

  private detectCategory(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const category = this.categories.find((cat) => cat.extensions.includes(ext));
    return category ? category.id : 'general';
  }

  private getCategoryFolder(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    const baseFolder = this.settings.get('downloadFolder') || '';
    const targetFolder = category ? path.join(baseFolder, category.folder) : baseFolder;

    // Create the folder if it doesn't exist
    this.ensureFolderExists(targetFolder);

    return targetFolder;
  }

  private ensureFolderExists(folderPath: string): void {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`[Download Manager] Created folder: ${folderPath}`);
      }
    } catch (error) {
      console.error(`[Download Manager] Failed to create folder ${folderPath}:`, error);
    }
  }

  private canStartDownload(): boolean {
    const maxConcurrent = this.settings.get('maxConcurrentDownloads') || 5;
    return this.activeDownloads.size < maxConcurrent;
  }

  private processQueue(): void {
    // Find waiting downloads and start them if we have capacity
    const waitingDownloads = Array.from(this.downloads.values())
      .filter((d) => d.status === 'waiting')
      .sort((a, b) => a.createdAt - b.createdAt);

    for (const download of waitingDownloads) {
      if (this.canStartDownload()) {
        console.log(`[Download Manager] Starting next waiting download: ${download.fileName}`);
        this.startDownload(download.id);
      } else {
        break;
      }
    }
  }

  private extractFileName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      let fileName = path.basename(pathname);

      if (!fileName || fileName === '/') {
        fileName = 'download_' + Date.now();
      }

      return decodeURIComponent(fileName);
    } catch {
      return 'download_' + Date.now();
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private saveDownloads(): void {
    // Save to persistent storage
    const data = JSON.stringify(Array.from(this.downloads.values()));
    const dataPath = path.join(process.cwd(), 'downloads.json');
    fs.writeFileSync(dataPath, data);
  }

  private loadDownloads(): void {
    try {
      const dataPath = path.join(process.cwd(), 'downloads.json');
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const downloads: Download[] = JSON.parse(data);
        downloads.forEach((d) => this.downloads.set(d.id, d));
      }
    } catch (error) {
      console.error('Failed to load downloads:', error);
    }
  }
}
