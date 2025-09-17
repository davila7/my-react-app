import { useState, useEffect } from 'react'
import { useTodos } from './hooks/useTodos'
import type { TodoFilter, TodoPriority } from './types/todo'
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
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('medium')
  const { todos, filter, stats, addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter } = useTodos()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      addTodo(inputValue, priority)
      setInputValue('')
      setPriority('medium')
    }
  }

  const shareToX = (todoText: string, completed: boolean) => {
    const status = completed ? '✅ Completed' : '📝 Working on'
    const text = `${status}: ${todoText}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const shareAllToX = () => {
    if (todos.length === 0) return
    
    let text = `📝 My Todo List Update:\n\n`
    
    const activeTodos = todos.filter(todo => !todo.completed)
    const completedTodos = todos.filter(todo => todo.completed)
    
    if (activeTodos.length > 0) {
      text += `🔄 Working on:\n`
      activeTodos.forEach(todo => {
        text += `• ${todo.text}\n`
      })
    }
    
    if (completedTodos.length > 0) {
      text += `\n✅ Completed:\n`
      completedTodos.forEach(todo => {
        text += `• ${todo.text}\n`
      })
    }
    
    text += `\n📊 Progress: ${completedTodos.length}/${todos.length} tasks completed`
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=550,height=420')
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
        <h1>
          My Todo List 
          {stats.total > 0 && (
            <span className="todo-count-badge">{stats.total}</span>
          )}
        </h1>
        
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
              maxLength={200}
            />
            <div className="character-counter">
              {inputValue.length}/200
            </div>
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TodoPriority)}
            className="priority-select"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
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
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <div className="todo-text-container">
                  <div className="todo-header">
                    <span className={`priority-indicator priority-${todo.priority}`}>
                      {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
                      {todo.text}
                    </span>
                  </div>
                  <span className="todo-date">
                    {/* Display creation date in user's locale */}
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="todo-actions">
                <button
                  onClick={() => shareToX(todo.text, todo.completed)}
                  className="share-button"
                  title="Share to X"
                >
                  𝕏
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="stats">
          <div className="stats-info">
            <span>Total: {stats.total} | Active: {stats.active} | Completed: {stats.completed}</span>
            <span className="character-count">
              📝 {todos.reduce((total, todo) => total + todo.text.length, 0)} characters
            </span>
          </div>
          <div className="stats-actions">
            {todos.length > 0 && (
              <button onClick={shareAllToX} className="share-all-button" title="Share all tasks to X">
                𝕏 Share All
              </button>
            )}
            {stats.completed > 0 && (
              <button onClick={clearCompleted} className="clear-button">
                Clear Completed
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
