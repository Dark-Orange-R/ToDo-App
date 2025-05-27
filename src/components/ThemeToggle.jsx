function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      {theme === 'light' ? 'Переключити на темну тему' : 'Переключити на світлу тему'}
    </button>
  );
}

export default ThemeToggle;