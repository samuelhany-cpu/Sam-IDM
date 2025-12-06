import React, { useState, useEffect } from 'react';
import DownloadList from './components/DownloadList';
import Toolbar from './components/Toolbar';
import AddDownloadDialog from './components/AddDownloadDialog';
import SettingsDialog from './components/SettingsDialog';
import QueueDialog from './components/QueueDialog';
import SchedulerDialog from './components/SchedulerDialog';
import './styles/App.css';

function App() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQueues, setShowQueues] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedDownloads, setSelectedDownloads] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDownloads();

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Refresh downloads every 2 seconds to catch any changes
    const refreshInterval = setInterval(() => {
      loadDownloads();
    }, 2000);

    // Listen for download updates
    window.electronAPI.onDownloadProgress((download: any) => {
      setDownloads((prev) => {
        const index = prev.findIndex((d) => d.id === download.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = download;
          return updated;
        }
        return [...prev, download];
      });
    });

    window.electronAPI.onDownloadCompleted((download: any) => {
      setDownloads((prev) => {
        const index = prev.findIndex((d) => d.id === download.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = download;
          return updated;
        }
        return prev;
      });
    });

    window.electronAPI.onDownloadError((data: any) => {
      setDownloads((prev) => {
        const index = prev.findIndex((d) => d.id === data.download.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data.download;
          return updated;
        }
        return prev;
      });
    });

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const loadDownloads = async () => {
    const allDownloads = await window.electronAPI.getAllDownloads();
    setDownloads(allDownloads);
  };

  const handleAddDownload = async (url: string, options?: any) => {
    await window.electronAPI.addDownload(url, options);
    setShowAddDialog(false);
  };

  const handleAddBatch = async (urls: string[], options?: any) => {
    await window.electronAPI.addBatchDownloads(urls, options);
    setShowAddDialog(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  const handleSelectDownload = (id: string, selected: boolean) => {
    setSelectedDownloads((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedDownloads.size === filteredDownloads.length) {
      setSelectedDownloads(new Set());
    } else {
      setSelectedDownloads(new Set(filteredDownloads.map((d) => d.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDownloads.size === 0) return;

    if (confirm(`Are you sure you want to remove ${selectedDownloads.size} download(s)?`)) {
      for (const id of selectedDownloads) {
        await window.electronAPI.removeDownload(id);
      }
      setSelectedDownloads(new Set());
      await loadDownloads();
    }
  };

  const filteredDownloads = downloads.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'downloading') return d.status === 'downloading';
    if (filter === 'completed') return d.status === 'completed';
    if (filter === 'paused') return d.status === 'paused';
    return true;
  });

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Toolbar
        onAddDownload={() => setShowAddDialog(true)}
        onStartAll={() => window.electronAPI.startAllDownloads()}
        onPauseAll={() => window.electronAPI.pauseAllDownloads()}
        onSettings={() => setShowSettings(true)}
        onQueues={() => setShowQueues(true)}
        onScheduler={() => setShowScheduler(true)}
        onFilterChange={setFilter}
        currentFilter={filter}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        selectedCount={selectedDownloads.size}
        onDeleteSelected={handleDeleteSelected}
        onSelectAll={handleSelectAll}
        hasDownloads={filteredDownloads.length > 0}
      />

      <DownloadList
        downloads={filteredDownloads}
        selectedDownloads={selectedDownloads}
        onSelectDownload={handleSelectDownload}
      />

      {showAddDialog && (
        <AddDownloadDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={handleAddDownload}
          onAddBatch={handleAddBatch}
        />
      )}

      {showSettings && <SettingsDialog onClose={() => setShowSettings(false)} />}

      {showQueues && <QueueDialog onClose={() => setShowQueues(false)} />}

      {showScheduler && <SchedulerDialog onClose={() => setShowScheduler(false)} />}
    </div>
  );
}

export default App;
