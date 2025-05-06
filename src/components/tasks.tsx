import { useState } from 'react';
import '../styles/taskTracker.css';

type Task = {
  id: number;
  text: string;
  completed: boolean;
  details?: string;
};

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  //const [softDate, setSoftDate] = useState('');
  const [taskDetails, setTaskDetails] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      //softDate: softDate.trim() || undefined,
      details: taskDetails.trim() || undefined
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setTaskDetails('');
    //setSoftDate('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="task-tracker">
      <h1>Task Tracker</h1>
      
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <input
          type="text"
          value={taskDetails}
          onChange={(e) => setTaskDetails(e.target.value)}
          placeholder="Enter details (op)"
        />
        <button onClick={addTask}>+</button>
      </div>
      
      <ul className="task-list">
        {tasks.map(task => {
          return (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleTask(task.id)}>
              {task.text}
            </span>
            {task.details && (
              <span className="task-details">
                {task.details}
              </span>
            )}
            <button onClick={() => deleteTask(task.id)}>×</button>
            </li>
              );
            })}
          </ul>
    </div>
  );
}