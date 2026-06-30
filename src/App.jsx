import { useState, useEffect } from 'react';
import Taskform from './Components/Taskform';
import Tasklist from './Components/Tasklist';
import Progresstracker from './Components/Progresstracker';
import './Style.css';

const STORAGE_KEY = 'taskman_tasks';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((task) => ({
        id: task.id ?? `${Date.now()}-${Math.random()}`,
        text: task.text ?? '',
        priority: task.priority ?? 'Medium',
        category: task.category ?? 'General',
        dueDate: task.dueDate ?? '',
        completed: task.completed ?? false,
        createdAt: task.createdAt ?? new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask, id) => {
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearTasks = () => {
    setTasks([]);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      search.trim() === '' ||
      task.text.toLowerCase().includes(search.toLowerCase()) ||
      task.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'pending' && !task.completed);

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const displayedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="App">
      <header>
        <h1>TaskMan</h1>
        <p>
          <i>Your friendly Task Manager</i>
        </p>
      </header>

      <div className="filters">
        <input
          type="search"
          placeholder="Search tasks or categories"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <Taskform addTask={addTask} />
      <Tasklist tasks={displayedTasks} updateTask={updateTask} deleteTask={deleteTask} />
      <Progresstracker tasks={tasks} />

      <div className="actions">
        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearTasks}>
            Clear all tasks
          </button>
        )}
        {tasks.some((task) => task.completed) && (
          <button className="secondary-btn" onClick={clearCompleted}>
            Clear completed tasks
          </button>
        )}
      </div>
    </div>
  );
}
