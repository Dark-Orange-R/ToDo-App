function TaskFilter({ filter, setFilter }) {
  return (
    <div className="mb-4 flex space-x-2">
      <button
        onClick={() => setFilter('all')}
        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Всі
      </button>
      <button
        onClick={() => setFilter('active')}
        className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Не виконані
      </button>
      <button
        onClick={() => setFilter('completed')}
        className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Виконані
      </button>
      <button
        onClick={() => setFilter('overdue')}
        className={`px-4 py-2 rounded ${filter === 'overdue' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Прострочені
      </button>
    </div>
  );
}

export default TaskFilter;