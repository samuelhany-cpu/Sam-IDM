import React from 'react';
import '../styles/Toolbar.css';

interface Props {
  onAddDownload: () => void;
  onAddMedia: () => void;
  onStartAll: () => void;
  onPauseAll: () => void;
  onSettings: () => void;
  onQueues: () => void;
  onScheduler: () => void;
  onFilterChange: (filter: string) => void;
  currentFilter: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onSelectAll: () => void;
  hasDownloads: boolean;
}

const Toolbar: React.FC<Props> = ({
  onAddDownload,
  onAddMedia,
  onStartAll,
  onPauseAll,
  onSettings,
  onQueues,
  onScheduler,
  onFilterChange,
  currentFilter,
  darkMode,
  onToggleDarkMode,
  selectedCount,
  onDeleteSelected,
  onSelectAll,
  hasDownloads,
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button onClick={onAddDownload} className="btn-primary">
          + Add Download
        </button>
        <button onClick={onAddMedia} className="btn-primary" title="Download from YouTube, TikTok, Instagram, Spotify, etc.">
          🎬 Download Media
        </button>
        <button onClick={onStartAll} className="btn-secondary">
          Start All
        </button>
        <button onClick={onPauseAll} className="btn-secondary">
          Pause All
        </button>
        {hasDownloads && (
          <>
            <button onClick={onSelectAll} className="btn-secondary">
              Select All
            </button>
            {selectedCount > 0 && (
              <button onClick={onDeleteSelected} className="btn-danger">
                Delete ({selectedCount})
              </button>
            )}
          </>
        )}
        <button onClick={onQueues} className="btn-secondary">
          Queues
        </button>
        <button onClick={onScheduler} className="btn-secondary">
          Scheduler
        </button>
      </div>
      <div className="toolbar-right">
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Downloads</option>
          <option value="downloading">Downloading</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
        <button
          onClick={onToggleDarkMode}
          className="btn-icon-large"
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={onSettings} className="btn-icon-large">
          ⚙
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
