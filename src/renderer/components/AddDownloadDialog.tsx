import React, { useState } from 'react';
import '../styles/Dialog.css';

interface Props {
  onClose: () => void;
  onAdd: (url: string, options?: any) => void;
  onAddBatch: (urls: string[], options?: any) => void;
}

const AddDownloadDialog: React.FC<Props> = ({ onClose, onAdd, onAddBatch }) => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState('');
  const [fileName, setFileName] = useState('');
  const [folder, setFolder] = useState('');
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const handleSelectFolder = async () => {
    const selectedFolder = await window.electronAPI.selectFolder();
    if (selectedFolder) {
      setFolder(selectedFolder);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'single') {
      if (url.trim()) {
        onAdd(url, { fileName: fileName || undefined, folder: folder || undefined });
      }
    } else {
      const urlList = urls
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u);
      if (urlList.length > 0) {
        onAddBatch(urlList, { folder: folder || undefined });
      }
    }
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Add Download</h2>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <div className="dialog-tabs">
          <button
            className={mode === 'single' ? 'tab-active' : ''}
            onClick={() => setMode('single')}
          >
            Single URL
          </button>
          <button className={mode === 'batch' ? 'tab-active' : ''} onClick={() => setMode('batch')}>
            Batch URLs
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dialog-body">
          {mode === 'single' ? (
            <>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/file.zip"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>File Name (Optional)</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Auto-detect from URL"
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>URLs (One per line)</label>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://example.com/file1.zip&#10;https://example.com/file2.pdf"
                rows={8}
                required
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label>Save To</label>
            <div className="input-with-button">
              <input
                type="text"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="Default download folder"
              />
              <button type="button" onClick={handleSelectFolder} className="btn-secondary">
                Browse
              </button>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDownloadDialog;
