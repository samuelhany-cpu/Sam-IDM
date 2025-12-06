import * as cron from 'node-cron';
import { DownloadManager } from './downloadManager';
import { SettingsManager } from './settings';

export interface ScheduleTask {
  id: string;
  name: string;
  type: 'download' | 'queue' | 'shutdown' | 'dial';
  schedule: string; // Cron expression
  enabled: boolean;
  action: any;
  createdAt: number;
}

export class SchedulerManager {
  private tasks: Map<string, ScheduleTask> = new Map();
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private downloadManager: DownloadManager;
  private settings: SettingsManager;

  constructor(downloadManager: DownloadManager, settings: SettingsManager) {
    this.downloadManager = downloadManager;
    this.settings = settings;
    this.loadTasks();
  }

  addTask(task: Omit<ScheduleTask, 'id' | 'createdAt'>): ScheduleTask {
    const id = this.generateId();
    const newTask: ScheduleTask = {
      ...task,
      id,
      createdAt: Date.now(),
    };

    this.tasks.set(id, newTask);

    if (newTask.enabled) {
      this.scheduleTask(newTask);
    }

    this.saveTasks();
    return newTask;
  }

  removeTask(taskId: string): boolean {
    const job = this.cronJobs.get(taskId);
    if (job) {
      job.stop();
      this.cronJobs.delete(taskId);
    }

    const result = this.tasks.delete(taskId);
    this.saveTasks();
    return result;
  }

  getAllTasks(): ScheduleTask[] {
    return Array.from(this.tasks.values());
  }

  private scheduleTask(task: ScheduleTask): void {
    const job = cron.schedule(task.schedule, () => {
      this.executeTask(task);
    });

    this.cronJobs.set(task.id, job);
  }

  private executeTask(task: ScheduleTask): void {
    switch (task.type) {
      case 'download':
        if (task.action.urls) {
          task.action.urls.forEach((url: string) => {
            this.downloadManager.addDownload(url, task.action.options);
          });
        }
        break;

      case 'queue':
        if (task.action.queueId) {
          this.downloadManager.startQueue(task.action.queueId);
        }
        break;

      case 'shutdown':
        // Implement system shutdown
        break;

      case 'dial':
        // Implement dial-up connection
        break;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private saveTasks(): void {
    const fs = require('fs');
    const path = require('path');
    const data = JSON.stringify(Array.from(this.tasks.values()));
    const dataPath = path.join(process.cwd(), 'scheduler.json');
    fs.writeFileSync(dataPath, data);
  }

  private loadTasks(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      const dataPath = path.join(process.cwd(), 'scheduler.json');
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const tasks: ScheduleTask[] = JSON.parse(data);
        tasks.forEach((task) => {
          this.tasks.set(task.id, task);
          if (task.enabled) {
            this.scheduleTask(task);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }
}
