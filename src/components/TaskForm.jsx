import { useState } from 'react';
import { formatISO } from 'date-fns';

function TaskForm({ addTask }) {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('середній');

  const today = formatISO(new Date(), { representation: 'date' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask(text, deadline, priority);
      setText('');
      setDeadline('');
      setPriority('середній');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col space-y-2">
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Додати нове завдання"
          className="border rounded-l px-4 py-2 text-gray-800 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Додати
        </button>
      </div>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        min={today}
        className="border rounded px-4 py-2 text-gray-800"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border rounded px-4 py-2 text-gray-800"
      >
        <option value="високий">Високий</option>
        <option value="середній">Середній</option>
        <option value="низький">Низький</option>
      </select>
    </form>
  );
}

export default TaskForm;