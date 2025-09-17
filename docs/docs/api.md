# API Reference

This document provides detailed API information for the React Todo App's components, hooks, and utilities.

## Types

### Core Types

```typescript
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;           // Unique identifier generated with crypto.randomUUID()
  text: string;         // Todo content (max 200 characters)
  completed: boolean;   // Completion status
  createdAt: Date;      // Creation timestamp
  priority: TodoPriority; // Priority level
}

export type TodoFilter = 'all' | 'active' | 'completed';
```

### Theme Types

```typescript
type Theme = 'light' | 'dark';
```

## Hooks

### useTodos()

The main hook for managing todo state and operations.

**Returns:**
```typescript
{
  todos: Todo[];              // Filtered todos based on current filter
  allTodos: Todo[];          // All todos (unfiltered)
  filter: TodoFilter;        // Current filter state
  stats: {                   // Computed statistics
    total: number;           // Total number of todos
    active: number;          // Number of active (incomplete) todos
    completed: number;       // Number of completed todos
  };
  addTodo: (text: string, priority?: TodoPriority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TodoFilter) => void;
}
```

**Methods:**

#### addTodo(text: string, priority?: TodoPriority)
Creates a new todo with the specified text and priority.

- **text**: Todo content (will be trimmed, max 200 chars)
- **priority**: Optional priority level (defaults to 'medium')
- **Returns**: void

**Example:**
```typescript
const { addTodo } = useTodos();
addTodo("Complete documentation", "high");
```

#### toggleTodo(id: string)
Toggles the completion status of a todo.

- **id**: Unique identifier of the todo
- **Returns**: void

#### deleteTodo(id: string)
Removes a todo from the list.

- **id**: Unique identifier of the todo
- **Returns**: void

#### clearCompleted()
Removes all completed todos from the list.

- **Returns**: void

#### setFilter(filter: TodoFilter)
Sets the current filter for displaying todos.

- **filter**: Filter type ('all', 'active', 'completed')
- **Returns**: void

## Components

### App Component

The main application component that manages theme state and renders the todo interface.

**Props:** None

**Features:**
- Theme management with localStorage persistence
- System preference detection for initial theme
- Form handling for todo creation
- Social sharing functionality

### Theme Management

#### Theme State
```typescript
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  // Auto-detects system preference or loads from localStorage
});
```

#### toggleTheme()
Switches between light and dark themes and persists the choice.

```typescript
const toggleTheme = () => {
  setTheme(prev => {
    const next = prev === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    return next;
  });
}
```

## Social Sharing Functions

### shareToX(todoText: string, completed: boolean)

Shares a single todo to X/Twitter with status indication.

**Parameters:**
- **todoText**: The text content of the todo
- **completed**: Whether the todo is completed

**Behavior:**
- Completed todos: "✅ Completed: \{todoText\}"
- Active todos: "📝 Working on: \{todoText\}"
- Opens X/Twitter in a new window with optimized dimensions

### shareAllToX()

Shares the entire todo list to X/Twitter with progress summary.

**Format:**
```
📝 My Todo List Update:

🔄 Working on:
• Task 1
• Task 2

✅ Completed:
• Completed task 1

📊 Progress: 1/3 tasks completed
```

## Form Handling

### Todo Input Form

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (inputValue.trim()) {
    addTodo(inputValue, priority);
    setInputValue('');
    setPriority('medium');
  }
}
```

**Validation:**
- Trims whitespace from input
- Requires non-empty content
- Respects 200-character limit
- Resets form after successful submission

## Statistics Calculation

The app provides real-time statistics computed from the todo list:

```typescript
const stats = {
  total: todos.length,
  active: todos.filter(todo => !todo.completed).length,
  completed: todos.filter(todo => todo.completed).length,
};
```

**Additional Stats:**
- **Character count**: Total characters across all todos
- **Progress percentage**: Calculated as `completed / total * 100`

## LocalStorage Integration

### Theme Persistence
- **Key**: `'theme'`
- **Values**: `'light'` | `'dark'`
- **Fallback**: System preference via `prefers-color-scheme`

### Data Structure
The app currently uses in-memory state only. LocalStorage integration for todo persistence would follow this pattern:

```typescript
// Potential localStorage structure
interface StoredData {
  todos: Todo[];
  theme: Theme;
  lastUpdated: string;
}
```

## Priority System

### Visual Indicators
- **High Priority**: 🔴 Red indicator
- **Medium Priority**: 🟡 Yellow indicator (default)
- **Low Priority**: 🟢 Green indicator

### CSS Classes
- `priority-high`: Red styling
- `priority-medium`: Yellow styling  
- `priority-low`: Green styling

## Filter Implementation

```typescript
const filteredTodos = todos.filter(todo => {
  switch (filter) {
    case 'active':
      return !todo.completed;
    case 'completed':
      return todo.completed;
    default:
      return true; // 'all'
  }
});
```

## Error Handling

### Input Validation
- **Maximum length**: 200 characters (enforced by HTML `maxLength` attribute)
- **Empty input**: Prevented by checking `inputValue.trim()`
- **Whitespace**: Automatically trimmed before adding todos

### UUID Generation
Uses `crypto.randomUUID()` for secure, unique identifiers. Fallback handling should be implemented for environments where this API is unavailable.

## Performance Optimizations

### Callback Optimization
All todo operations use `useCallback` to prevent unnecessary re-renders:

```typescript
const addTodo = useCallback((text: string, priority: TodoPriority = 'medium') => {
  // Implementation
}, []);
```

### Computed Values
Statistics are computed on-demand rather than stored in state, ensuring consistency and reducing memory usage.

## Browser Compatibility

### Required APIs
- `crypto.randomUUID()`: For unique ID generation
- `localStorage`: For theme persistence
- `window.matchMedia()`: For system theme detection
- `window.open()`: For social sharing functionality

### Fallback Considerations
Consider implementing fallbacks for:
- UUID generation in older browsers
- localStorage availability checks
- Media query support detection