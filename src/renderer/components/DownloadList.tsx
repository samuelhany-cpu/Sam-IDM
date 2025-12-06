import React, { useState } from 'react';
import DownloadItem from './DownloadItem';
import '../styles/DownloadList.css';

interface Props {
  downloads: any[];
  selectedDownloads: Set<string>;
  onSelectDownload: (id: string, selected: boolean) => void;
}

type SortField = 'filename' | 'size' | 'progress' | 'speed' | 'status' | 'addedDate';
type SortDirection = 'asc' | 'desc';

const DownloadList: React.FC<Props> = ({ downloads, selectedDownloads, onSelectDownload }) => {
  const [sortField, setSortField] = useState<SortField>('addedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedDownloads = () => {
    return [...downloads].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'filename':
          aValue = a.filename.toLowerCase();
          bValue = b.filename.toLowerCase();
          break;
        case 'size':
          aValue = a.fileSize || 0;
          bValue = b.fileSize || 0;
          break;
        case 'progress':
          aValue = a.progress || 0;
          bValue = b.progress || 0;
          break;
        case 'speed':
          aValue = a.speed || 0;
          bValue = b.speed || 0;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'addedDate':
          aValue = a.addedDate || 0;
          bValue = b.addedDate || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (downloads.length === 0) {
    return (
      <div className="download-list-empty">
        <h2>No Downloads</h2>
        <p>Click "Add Download" to start downloading files</p>
      </div>
    );
  }

  const sortedDownloads = getSortedDownloads();

  return (
    <div className="download-list">
      <div className="download-list-header">
        <div className="col-select">Select</div>
        <div className="col-filename sortable" onClick={() => handleSort('filename')}>
          File Name {getSortIcon('filename')}
        </div>
        <div className="col-size sortable" onClick={() => handleSort('size')}>
          Size {getSortIcon('size')}
        </div>
        <div className="col-progress sortable" onClick={() => handleSort('progress')}>
          Progress {getSortIcon('progress')}
        </div>
        <div className="col-speed sortable" onClick={() => handleSort('speed')}>
          Speed {getSortIcon('speed')}
        </div>
        <div className="col-time">Time Left</div>
        <div className="col-status sortable" onClick={() => handleSort('status')}>
          Status {getSortIcon('status')}
        </div>
        <div className="col-actions">Actions</div>
      </div>
      <div className="download-list-items">
        {sortedDownloads.map((download) => (
          <DownloadItem
            key={download.id}
            download={download}
            isSelected={selectedDownloads.has(download.id)}
            onSelect={(selected) => onSelectDownload(download.id, selected)}
          />
        ))}
      </div>
    </div>
  );
};

export default DownloadList;
