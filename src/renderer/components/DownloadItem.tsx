import React from 'react';
import '../styles/DownloadItem.css';

interface Props {
  download: any;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

const DownloadItem: React.FC<Props> = ({ download, isSelected, onSelect }) => {
  const handlePause = () => {
    window.electronAPI.pauseDownload(download.id);
  };

  const handleResume = () => {
    window.electronAPI.resumeDownload(download.id);
  };

  const handleCancel = () => {
    window.electronAPI.cancelDownload(download.id);
  };

  const handleRemove = async () => {
    if (confirm(`Are you sure you want to remove "${download.filename}"?`)) {
      await window.electronAPI.removeDownload(download.id);
      // Force a reload by dispatching a custom event
      window.dispatchEvent(new CustomEvent('download-removed'));
    }
  };

  const handleOpenFile = () => {
    window.electronAPI.openFile(download.id);
  };

  const handleOpenFolder = () => {
    window.electronAPI.openFolder(download.id);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatSize(bytesPerSecond) + '/s';
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      compressed: '📦',
      documents: '📄',
      music: '🎵',
      programs: '⚙️',
      video: '🎬',
      images: '🖼️',
      code: '💻',
      data: '📊',
      fonts: '🔤',
      ebooks: '📚',
      '3d': '🎨',
      disk: '💿',
      general: '📁',
    };
    return icons[category] || '📁';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      compressed: 'Compressed',
      documents: 'Documents',
      music: 'Music',
      programs: 'Programs',
      video: 'Video',
      images: 'Images',
      code: 'Code',
      data: 'Data',
      fonts: 'Fonts',
      ebooks: 'Ebooks',
      '3d': '3D Models',
      disk: 'Disk Images',
      general: 'Other',
    };
    return names[category] || 'Other';
  };

  return (
    <div className={`download-item ${isSelected ? 'selected' : ''}`}>
      <div className="col-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="download-checkbox"
        />
      </div>
      <div
        className="col-filename"
        title={`${download.fileName}\nCategory: ${getCategoryName(download.category)}\nFolder: ${download.filePath}`}
      >
        <span className="category-icon" title={getCategoryName(download.category)}>
          {getCategoryIcon(download.category)}
        </span>
        <span className="filename-text">{download.fileName}</span>
      </div>
      <div className="col-size">{formatSize(download.fileSize)}</div>
      <div className="col-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${download.progress}%` }}></div>
          <span className="progress-text">{download.progress.toFixed(1)}%</span>
        </div>
      </div>
      <div className="col-speed">
        {download.status === 'downloading' ? formatSpeed(download.speed) : '--'}
      </div>
      <div className="col-time">
        {download.status === 'downloading' ? formatTime(download.timeRemaining) : '--'}
      </div>
      <div className="col-status">
        <span className={`status-badge status-${download.status}`}>{download.status}</span>
      </div>
      <div className="col-actions">
        {download.status === 'downloading' && (
          <button onClick={handlePause} className="btn-icon" title="Pause">
            ⏸
          </button>
        )}
        {(download.status === 'paused' || download.status === 'waiting') && (
          <button onClick={handleResume} className="btn-icon" title="Resume">
            ▶
          </button>
        )}
        {download.status === 'completed' && (
          <>
            <button onClick={handleOpenFile} className="btn-icon" title="Open File">
              📄
            </button>
            <button onClick={handleOpenFolder} className="btn-icon" title="Open Folder">
              📁
            </button>
          </>
        )}
        {download.status !== 'completed' && download.status !== 'cancelled' && (
          <button onClick={handleCancel} className="btn-icon" title="Cancel">
            ✖
          </button>
        )}
        <button onClick={handleRemove} className="btn-icon" title="Remove">
          🗑
        </button>
      </div>
    </div>
  );
};

export default DownloadItem;
