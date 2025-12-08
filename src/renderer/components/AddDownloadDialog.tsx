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
  const [isMediaUrl, setIsMediaUrl] = useState(false);
  const [videoQuality, setVideoQuality] = useState('best');
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [extractAudio, setExtractAudio] = useState(false);

  const handleSelectFolder = async () => {
    const selectedFolder = await window.electronAPI.selectFolder();
    if (selectedFolder) {
      setFolder(selectedFolder);
    }
  };

  const detectMediaUrl = (urlString: string) => {
    const mediaPattern = /youtube\.com|youtu\.be|tiktok\.com|instagram\.com|spotify\.com|anghami\.com/i;
    return mediaPattern.test(urlString);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setIsMediaUrl(detectMediaUrl(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'single') {
      if (url.trim()) {
        const options: any = { 
          fileName: fileName || undefined, 
          folder: folder || undefined 
        };
        
        // Add media-specific options if it's a media URL
        if (isMediaUrl) {
          if (extractAudio) {
            options.audio = true;
            options.audioFormat = audioFormat;
          } else {
            options.format = videoQuality === 'best' ? 'bestvideo+bestaudio/best' : videoQuality;
          }
        }
        
        onAdd(url, options);
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
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com/file.zip or YouTube/TikTok/Instagram/Spotify link"
                  required
                  autoFocus
                />
              </div>
              
              {isMediaUrl && (
                <>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={extractAudio}
                        onChange={(e) => setExtractAudio(e.target.checked)}
                      />
                      {' '}Extract Audio Only
                    </label>
                  </div>
                  
                  {extractAudio ? (
                    <div className="form-group">
                      <label>Audio Format</label>
                      <select value={audioFormat} onChange={(e) => setAudioFormat(e.target.value)}>
                        <option value="mp3">MP3</option>
                        <option value="m4a">M4A</option>
                        <option value="wav">WAV</option>
                        <option value="flac">FLAC</option>
                        <option value="opus">OPUS</option>
                      </select>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Video Quality</label>
                      <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)}>
                        <option value="best">Best Quality (Video+Audio)</option>
                        <option value="bestvideo">Best Video Only</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                      </select>
                    </div>
                  )}
                </>
              )}
              
              {!isMediaUrl && (
                <div className="form-group">
                  <label>File Name (Optional)</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Auto-detect from URL"
                  />
                </div>
              )}
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
