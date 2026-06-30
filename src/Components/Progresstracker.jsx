export default function Progresstracker({ tasks }) {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="progress-tracker">
      <p>
        {completedTasks} of {totalTasks} tasks completed
      </p>
      {overdueTasks > 0 && <p className="overdue-notice">{overdueTasks} overdue task{overdueTasks > 1 ? 's' : ''}</p>}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
