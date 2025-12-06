import React, { useState, useEffect } from 'react';
import '../styles/Dialog.css';

interface Props {
  onClose: () => void;
}

const SettingsDialog: React.FC<Props> = ({ onClose }) => {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const allSettings = await window.electronAPI.getSettings();
    setSettings(allSettings);
  };

  const handleChange = async (key: string, value: any) => {
    await window.electronAPI.setSetting(key, value);
    setSettings({ ...settings, [key]: value });
  };

  const handleSelectFolder = async () => {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
      handleChange('downloadFolder', folder);
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog dialog-large" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <div className="dialog-body">
          <div className="settings-section">
            <h3>General</h3>
            <div className="form-group">
              <label>Default Download Folder</label>
              <div className="input-with-button">
                <input type="text" value={settings.downloadFolder || ''} readOnly />
                <button onClick={handleSelectFolder} className="btn-secondary">
                  Browse
                </button>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Performance</h3>
            <div className="form-group">
              <label>Max Concurrent Downloads</label>
              <input
                type="number"
                value={settings.maxConcurrentDownloads || 5}
                onChange={(e) => handleChange('maxConcurrentDownloads', parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </div>
            <div className="form-group">
              <label>Segments per Download</label>
              <input
                type="number"
                value={settings.segmentCount || 8}
                onChange={(e) => handleChange('segmentCount', parseInt(e.target.value))}
                min="1"
                max="16"
              />
            </div>
            <div className="form-group">
              <label>Max Concurrent Segments</label>
              <input
                type="number"
                value={settings.maxConcurrentSegments || 4}
                onChange={(e) => handleChange('maxConcurrentSegments', parseInt(e.target.value))}
                min="1"
                max="8"
              />
            </div>
            <div className="form-group">
              <label>Speed Limit (KB/s, 0 = unlimited)</label>
              <input
                type="number"
                value={settings.speedLimit || 0}
                onChange={(e) => handleChange('speedLimit', parseInt(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Behavior</h3>
            <div className="form-check">
              <input
                type="checkbox"
                id="autoStart"
                checked={settings.autoStart || false}
                onChange={(e) => handleChange('autoStart', e.target.checked)}
              />
              <label htmlFor="autoStart">Start downloads automatically</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="minimizeToTray"
                checked={settings.minimizeToTray || false}
                onChange={(e) => handleChange('minimizeToTray', e.target.checked)}
              />
              <label htmlFor="minimizeToTray">Minimize to system tray</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="soundOnComplete"
                checked={settings.soundOnComplete || false}
                onChange={(e) => handleChange('soundOnComplete', e.target.checked)}
              />
              <label htmlFor="soundOnComplete">Play sound on completion</label>
            </div>
          </div>

          <div className="dialog-footer">
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
