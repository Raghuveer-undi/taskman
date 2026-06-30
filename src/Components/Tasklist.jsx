import React, { useState } from 'react';

export default function TaskList({ tasks, updateTask, deleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [editedPriority, setEditedPriority] = useState('Medium');
  const [editedCategory, setEditedCategory] = useState('General');
  const [editedDueDate, setEditedDueDate] = useState('');

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditedTask(task.text || '');
    setEditedPriority(task.priority || 'Medium');
    setEditedCategory(task.category || 'General');
    setEditedDueDate(task.dueDate || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask || editedTask.trim() === '') return;

    const updatedTask = {
      ...currentTask,
      text: editedTask.trim(),
      priority: editedPriority,
      category: editedCategory,
      dueDate: editedDueDate,
    };

    updateTask(updatedTask, id);
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;
    updateTask({ ...currentTask, completed: !currentTask.completed }, id);
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'completed' : isOverdue(task) ? 'overdue' : ''}>
          {editingId === task.id ? (
            <div className="task-edit">
              <input value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
              <div className="edit-controls">
                <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)}>
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                <input type="date" value={editedDueDate} onChange={(e) => setEditedDueDate(e.target.value)} />
              </div>
              <div className="edit-actions">
                <button type="button" onClick={() => saveEdit(task.id)}>
                  Save
                </button>
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="task-details">
                <div className="task-main">
                  <span>{task.text}</span>
                  <small>
                    {task.priority} · {task.category}
                    {task.dueDate ? ` · due ${formatDate(task.dueDate)}` : ''}
                  </small>
                </div>
                {isOverdue(task) && <small className="overdue-label">Overdue</small>}
              </div>
              <div className="task-actions">
                <button type="button" onClick={() => toggleComplete(task.id)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button type="button" onClick={() => startEdit(task)}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
