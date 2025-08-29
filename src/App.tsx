import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import type { TodoFilter } from './types/todo'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css';

function App() {
  // Theme state and logic
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }

  // Apply theme to <html> element
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const [inputValue, setInputValue] = useState('')
  const { todos, filter, stats, addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter } = useTodos()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addTodo(inputValue)
      setInputValue('')
    }
  }

  const filterButtons: { key: TodoFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <div className="app-wrapper">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="app">
        <h1>Todo List</h1>
        
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <div className="filters">
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={filter === key ? 'filter-button active' : 'filter-button'}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="stats">
          <span>Total: {stats.total} | Active: {stats.active} | Completed: {stats.completed}</span>
          {stats.completed > 0 && (
            <button onClick={clearCompleted} className="clear-button">
              Clear Completed
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
