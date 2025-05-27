import { useState } from 'react';
import { formatISO, isBefore, parseISO } from 'date-fns';

function TaskList({ groupedTasks, toggleTask, deleteTask, editTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editPriority, setEditPriority] = useState('середній');

  const today = formatISO(new Date(), { representation: 'date' });

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDeadline(task.deadline || '');
    setEditPriority(task.priority || 'середній');
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      editTask(id, editText, editDeadline, editPriority);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditDeadline('');
    setEditPriority('середній');
  };

  return (
    <div>
      {Object.keys(groupedTasks).map(date => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <div className="grid gap-4">
            {groupedTasks[date].map(task => {
              const isOverdue = task.deadline && !task.completed && isBefore(parseISO(task.deadline), parseISO(today));
              const taskClass = task.completed
                ? 'task-completed'
                : isOverdue
                ? 'task-overdue'
                : 'task-active';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded grid-item ${taskClass}`}
                >
                  {editingId === task.id ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="border rounded px-2 py-1 text-gray-800"
                        />
                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          min={today}
                          className="border rounded px-2 py-1 text-gray-800"
                        />
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                          className="border rounded px-2 py-1 text-gray-800"
                        >
                          <option value="високий">Високий</option>
                          <option value="середній">Середній</option>
                          <option value="низький">Низький</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Зберегти
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Скасувати
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="mr-2 mt-1"
                        />
                        <div className="flex-1">
                          <span className={task.completed ? 'line-through text-gray-500' : ''}>
                            {task.text}
                          </span>
                          <div className="text-sm text-gray-500">
                            Пріоритет: {task.priority}
                          </div>
                          {task.deadline && date !== 'Без дати' && (
                            <div className="text-sm text-gray-500">
                              Дедлайн: {task.deadline}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Видалити
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;