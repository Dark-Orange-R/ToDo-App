import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, parseISO, formatISO } from 'date-fns';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import ThemeToggle from './components/ThemeToggle';

// Функція для дедуплікації завдань за ID
const deduplicateTasks = (tasks) => {
  const seenIds = new Set();
  return tasks.filter(task => {
    if (seenIds.has(task.id)) {
      return false;
    }
    seenIds.add(task.id);
    return true;
  });
};

function App() {
  // Ініціалізація стану з LocalStorage
  const initialTasks = (() => {
    try {
      const savedTasksRaw = localStorage.getItem('tasks');
      const parsedTasks = savedTasksRaw ? JSON.parse(savedTasksRaw) : [];
      if (Array.isArray(parsedTasks)) {
        const deduplicatedTasks = deduplicateTasks(parsedTasks);
        return deduplicatedTasks;
      }
      return [];
    } catch (error) {
      return [];
    }
  })();

  const initialTheme = (() => {
    try {
      const savedTheme = localStorage.getItem('theme') || 'light';
      return savedTheme;
    } catch (error) {
      return 'light';
    }
  })();

  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState(initialTheme);

  // Застосування теми при завантаженні та при зміні
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Збереження завдань у LocalStorage
  useEffect(() => {
    try {
      const deduplicatedTasks = deduplicateTasks(tasks);
      localStorage.setItem('tasks', JSON.stringify(deduplicatedTasks));
    } catch (error) {
    }
  }, [tasks]);

  // Збереження теми у LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
    }
  }, [theme]);

  // Перемикання теми
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Додавання завдання
  const addTask = (text, deadline, priority) => {
    const today = formatISO(new Date(), { representation: 'date' });
    if (deadline && isBefore(parseISO(deadline), parseISO(today))) {
      alert('Дедлайн не може бути в минулому!');
      return;
    }
    const newTask = { id: uuidv4(), text, completed: false, deadline: deadline || null, priority: priority || 'середній' };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Позначення як виконане
  const toggleTask = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Видалення завдання
  const deleteTask = (id) => {
    if (window.confirm('Чи впевнені, що хочете видалити це завдання?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  };

  // Редагування завдання
  const editTask = (id, text, deadline, priority) => {
    const today = formatISO(new Date(), { representation: 'date' });
    if (deadline && isBefore(parseISO(deadline), parseISO(today))) {
      alert('Дедлайн не може бути в минулому!');
      return;
    }
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, text, deadline: deadline || null, priority: priority || 'середній' } : task
      )
    );
  };

  // Фільтрація завдань
  const filteredTasks = tasks.filter(task => {
    const today = formatISO(new Date(), { representation: 'date' });
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (filter === 'overdue') {
      return task.deadline && isBefore(parseISO(task.deadline), parseISO(today)) && !task.completed;
    }
    return true;
  });

  // Групування завдань за датами
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = task.deadline || 'Без дати';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  // Сортування груп за датами та завдань у групах за пріоритетом
  const sortedGroupedTasks = Object.keys(groupedTasks)
    .sort((a, b) => {
      if (a === 'Без дати') return 1;
      if (b === 'Без дати') return -1;
      return isBefore(parseISO(a), parseISO(b)) ? -1 : 1;
    })
    .reduce((sortedGroups, date) => {
      const priorityOrder = { 'високий': 1, 'середній': 2, 'низький': 3 };
      sortedGroups[date] = groupedTasks[date].sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });
      return sortedGroups;
    }, {});

  // Статистика завдань
  const today = formatISO(new Date(), { representation: 'date' });
  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed && (!task.deadline || !isBefore(parseISO(task.deadline), parseISO(today)))).length;
  const overdueCount = tasks.filter(task => task.deadline && isBefore(parseISO(task.deadline), parseISO(today)) && !task.completed).length;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <TaskForm addTask={addTask} />
      <TaskFilter filter={filter} setFilter={setFilter} />
      <div className="mb-4">
        <p>Виконано: {completedCount}</p>
        <p>Активних: {activeCount}</p>
        <p>Прострочено: {overdueCount}</p>
      </div>
      <TaskList
        groupedTasks={sortedGroupedTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
}

export default App;