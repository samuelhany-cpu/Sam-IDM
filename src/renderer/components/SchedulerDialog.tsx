import React, { useState, useEffect } from 'react';
import '../styles/Dialog.css';

interface Props {
  onClose: () => void;
}

const SchedulerDialog: React.FC<Props> = ({ onClose }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('download');
  const [schedule, setSchedule] = useState('0 0 * * *');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await window.electronAPI.getAllScheduleTasks();
    setTasks(allTasks);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      name: taskName,
      type: taskType,
      schedule,
      enabled: true,
      action: {},
    };
    await window.electronAPI.addScheduleTask(task);
    setTaskName('');
    setShowAddTask(false);
    loadTasks();
  };

  const handleRemoveTask = async (taskId: string) => {
    await window.electronAPI.removeScheduleTask(taskId);
    loadTasks();
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Scheduler</h2>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <div className="dialog-body">
          {!showAddTask ? (
            <>
              <button onClick={() => setShowAddTask(true)} className="btn-primary">
                + Add Schedule Task
              </button>

              <div className="task-list">
                {tasks.length === 0 ? (
                  <p className="empty-message">No scheduled tasks</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-info">
                        <strong>{task.name}</strong>
                        <span>{task.type}</span>
                        <span>{task.schedule}</span>
                      </div>
                      <button onClick={() => handleRemoveTask(task.id)} className="btn-icon">
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                  <option value="download">Download</option>
                  <option value="queue">Start Queue</option>
                  <option value="shutdown">Shutdown</option>
                </select>
              </div>
              <div className="form-group">
                <label>Schedule (Cron)</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="0 0 * * * (Daily at midnight)"
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          )}

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

export default SchedulerDialog;
