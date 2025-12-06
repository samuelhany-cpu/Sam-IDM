import React, { useState, useEffect } from 'react';
import '../styles/Dialog.css';

interface Props {
  onClose: () => void;
}

const QueueDialog: React.FC<Props> = ({ onClose }) => {
  const [queues, setQueues] = useState<any[]>([]);
  const [queueName, setQueueName] = useState('');

  useEffect(() => {
    loadQueues();
  }, []);

  const loadQueues = async () => {
    const allQueues = await window.electronAPI.getAllQueues();
    setQueues(allQueues);
  };

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queueName.trim()) {
      await window.electronAPI.createQueue(queueName);
      setQueueName('');
      loadQueues();
    }
  };

  const handleStartQueue = async (queueId: string) => {
    await window.electronAPI.startQueue(queueId);
    loadQueues();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Download Queues</h2>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <div className="dialog-body">
          <form onSubmit={handleCreateQueue} className="form-inline">
            <input
              type="text"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              placeholder="Queue name"
            />
            <button type="submit" className="btn-primary">
              Create Queue
            </button>
          </form>

          <div className="queue-list">
            {queues.length === 0 ? (
              <p className="empty-message">No queues created</p>
            ) : (
              queues.map((queue) => (
                <div key={queue.id} className="queue-item">
                  <div className="queue-info">
                    <strong>{queue.name}</strong>
                    <span>{queue.downloads.length} downloads</span>
                    <span className={`status-badge status-${queue.status}`}>{queue.status}</span>
                  </div>
                  <button
                    onClick={() => handleStartQueue(queue.id)}
                    className="btn-secondary"
                    disabled={queue.status === 'running'}
                  >
                    Start
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="dialog-footer">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDialog;
