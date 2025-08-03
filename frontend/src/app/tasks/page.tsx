'use client';
import { useState, useEffect } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'completed' | 'not completed';
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'completed' | 'not completed'>('not completed');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');

  const getAuthHeader = (): Record<string, string> => {
    const userData = localStorage.getItem('user');
    if (!userData) return {};
    try {
      const parsed = JSON.parse(userData);
      return parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
    } catch (e) {
      console.error("Failed to parse user data from localStorage:", e);
      return {};
    }
  };

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:3000/tasks/getall", {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    setTasks(data);
    console.log(data);
  };

  const addTasks = async () => {
    const response = await fetch("http://localhost:3000/tasks/create", {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
      },
      body: JSON.stringify({ title, description, category, status }),
    });
    const data = await response.json();
    if (response.ok) {
      setTasks([...tasks, data]);
      setSuccessMessage('Task added successfully!');
      resetForm();
    } else {
      setValidationErrors(data.errors);
    }
  };

  const deleteTasks = async (id: string) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    }
  };

  const editTasks = (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    setEditingTaskId(id);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setStatus(task.status);
  };

  const updateTasks = async (id: string) => {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ title, description, category, status }),
    });
    const data = await response.json();
    if (response.ok) {
      const updatedTasks = tasks.map(task => task._id === id ? data : task);
      setTasks(updatedTasks);
      setSuccessMessage('Task updated successfully!');
      resetForm();
    } else {
      setValidationErrors(data.errors);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setStatus('not completed');
    setEditingTaskId(null);
    setValidationErrors({});
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //For success message
  useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(''), 3000); // clears after 3 seconds
        return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to our Task Tracker</h1>
      <div className="space-y-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 rounded-md p-2 w-full"
          type="text"
          placeholder="Enter task title"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 rounded-md p-2 w-full"
          type="text"
          placeholder="Enter the description"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-2 rounded-md p-2 w-full"
          type="text"
          placeholder="Enter the category"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'completed' | 'not completed')}
          className="border-2 rounded-md p-2 w-full"
        >
          <option value="incomplete" className="text-black">Not Completed</option>
          <option value="complete" className="text-black">Completed</option>
        </select>

        {editingTaskId ? (
          <button className="bg-blue-500 text-white rounded-md p-2 cursor-pointer" onClick={() => updateTasks(editingTaskId)}>
            Update Task
          </button>
        ) : (
          <button className="bg-green-500 text-white rounded-md p-2 cursor-pointer" onClick={addTasks}>
            Add Task
          </button>
        )}
      </div>
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-2 rounded mb-4">
            {successMessage}
        </div>
      )}

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md text-black">
            <span>
              <strong>{task.title}</strong> - {task.category} - {task.status}
            </span>
            <div className="space-x-2">
              <button onClick={() => editTasks(task._id)} className="bg-yellow-500 text-white rounded-md p-2 cursor-pointer">Edit</button>
              <button onClick={() => deleteTasks(task._id)} className="bg-red-500 text-white rounded-md p-2 cursor-pointer">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
