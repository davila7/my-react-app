# Hooks Reference

This document provides detailed information about custom hooks used in the React Todo App, including their implementation, usage patterns, and best practices.

## Custom Hooks

### useTodos Hook

The primary hook for managing todo state and operations throughout the application.

**File**: `src/hooks/useTodos.ts`

**Purpose**: Centralizes todo state management, filtering, and statistics computation.

#### Return Interface

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

#### State Management

The hook manages two primary pieces of state:

```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<TodoFilter>('all');
```

#### Hook Implementation

**Complete Implementation**:
```typescript
import { useState, useCallback } from 'react';
import type { Todo, TodoFilter, TodoPriority } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');

  const addTodo = useCallback((text: string, priority: TodoPriority = 'medium') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
    };
    setTodos(prev => [...prev, newTodo]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  };
};
```

## Hook Methods

### addTodo(text: string, priority?: TodoPriority)

Creates a new todo with the specified text and priority.

**Parameters**:
- `text` (string): Todo content, will be trimmed automatically
- `priority` (TodoPriority, optional): Priority level, defaults to 'medium'

**Behavior**:
- Generates unique ID using `crypto.randomUUID()`
- Trims whitespace from input text
- Sets creation timestamp automatically
- Defaults to incomplete status
- Appends to end of todo list

**Usage Example**:
```typescript
const { addTodo } = useTodos();

// Add with default priority
addTodo("Complete documentation");

// Add with specific priority
addTodo("Fix critical bug", "high");
```

**Performance**: Uses `useCallback` to prevent unnecessary re-renders.

### toggleTodo(id: string)

Toggles the completion status of a specific todo.

**Parameters**:
- `id` (string): Unique identifier of the todo to toggle

**Behavior**:
- Finds todo by ID using array map
- Inverts the `completed` boolean property
- Preserves all other todo properties
- Updates state immutably

**Usage Example**:
```typescript
const { toggleTodo } = useTodos();

// Toggle completion status
toggleTodo("123e4567-e89b-12d3-a456-426614174000");
```

**Performance**: Uses `useCallback` and immutable updates for optimal rendering.

### deleteTodo(id: string)

Permanently removes a todo from the list.

**Parameters**:
- `id` (string): Unique identifier of the todo to delete

**Behavior**:
- Filters out the todo with matching ID
- Updates state with new array
- No confirmation dialog (immediate action)

**Usage Example**:
```typescript
const { deleteTodo } = useTodos();

// Delete specific todo
deleteTodo("123e4567-e89b-12d3-a456-426614174000");
```

**Safety**: Immutable filter operation prevents accidental data loss.

### clearCompleted()

Removes all completed todos from the list in a single operation.

**Parameters**: None

**Behavior**:
- Filters out all todos where `completed === true`
- Preserves all active (incomplete) todos
- Efficient bulk operation

**Usage Example**:
```typescript
const { clearCompleted, stats } = useTodos();

// Only show button if there are completed todos
{stats.completed > 0 && (
  <button onClick={clearCompleted}>
    Clear Completed
  </button>
)}
```

**Performance**: Single state update for multiple todo removals.

### setFilter(filter: TodoFilter)

Changes the current filter view for displaying todos.

**Parameters**:
- `filter` (TodoFilter): Filter type - 'all', 'active', or 'completed'

**Behavior**:
- Updates filter state immediately
- Automatically triggers re-computation of `filteredTodos`
- Does not affect underlying todo data

**Usage Example**:
```typescript
const { setFilter, filter } = useTodos();

// Filter button implementation
<button 
  onClick={() => setFilter('active')}
  className={filter === 'active' ? 'active' : ''}
>
  Active
</button>
```

## Computed Properties

### filteredTodos

Dynamically filtered list of todos based on current filter state.

**Implementation**:
```typescript
const filteredTodos = todos.filter(todo => {
  switch (filter) {
    case 'active':
      return !todo.completed;
    case 'completed':
      return todo.completed;
    default:
      return true; // 'all' filter
  }
});
```

**Usage**: Returned as `todos` in hook interface for easy consumption.

**Performance**: Computed on every render but lightweight filtering operation.

### stats

Real-time statistics computed from the current todo list.

**Implementation**:
```typescript
const stats = {
  total: todos.length,
  active: todos.filter(todo => !todo.completed).length,
  completed: todos.filter(todo => todo.completed).length,
};
```

**Properties**:
- `total`: Complete count of all todos
- `active`: Count of incomplete todos
- `completed`: Count of completed todos

**Usage Example**:
```typescript
const { stats } = useTodos();

return (
  <div className="stats">
    Total: {stats.total} | 
    Active: {stats.active} | 
    Completed: {stats.completed}
  </div>
);
```

## Hook Usage Patterns

### Basic Hook Usage

```typescript
import { useTodos } from './hooks/useTodos';

function TodoApp() {
  const { 
    todos, 
    stats, 
    addTodo, 
    toggleTodo, 
    deleteTodo 
  } = useTodos();

  return (
    <div>
      {/* Use hook data and methods */}
    </div>
  );
}
```

### Form Integration

```typescript
function TodoForm() {
  const { addTodo } = useTodos();
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue, priority);
      setInputValue('');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
}
```

### List Rendering

```typescript
function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}
```

## Performance Optimizations

### useCallback Usage

All mutation methods use `useCallback` to prevent unnecessary re-renders:

```typescript
const addTodo = useCallback((text: string, priority: TodoPriority = 'medium') => {
  // Implementation
}, []); // Empty dependency array - function never changes
```

**Benefits**:
- Prevents child component re-renders
- Stable function references
- Optimized memoization

### Immutable Updates

All state updates maintain immutability:

```typescript
// Correct: Immutable update
setTodos(prev => [...prev, newTodo]);

// Incorrect: Mutates existing state
setTodos(prev => {
  prev.push(newTodo);
  return prev;
});
```

**Benefits**:
- Reliable change detection
- Predictable state updates
- React optimization compatibility

### Efficient Filtering

Filtering is computed during render rather than stored in state:

```typescript
// Efficient: Computed on demand
const filteredTodos = todos.filter(/* filter logic */);

// Less efficient: Additional state to maintain
const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
```

**Benefits**:
- Always in sync with source data
- No additional state management
- Lightweight computation

## Error Handling

### UUID Generation

The hook uses `crypto.randomUUID()` which might not be available in all environments:

```typescript
// Current implementation
id: crypto.randomUUID(),

// Fallback implementation (if needed)
id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
```

### Input Validation

The hook includes basic input validation:

```typescript
const addTodo = useCallback((text: string, priority: TodoPriority = 'medium') => {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(), // Removes whitespace
    completed: false,
    createdAt: new Date(),
    priority,
  };
  setTodos(prev => [...prev, newTodo]);
}, []);
```

**Validation Features**:
- Automatic whitespace trimming
- Default priority assignment
- Consistent data structure

## Testing Hooks

### Hook Testing Strategy

Custom hooks can be tested using React Testing Library:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  test('should add a new todo', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Test todo', 'high');
    });
    
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Test todo');
    expect(result.current.todos[0].priority).toBe('high');
  });
});
```

### State Testing

Test state changes and computed properties:

```typescript
test('should compute stats correctly', () => {
  const { result } = renderHook(() => useTodos());
  
  act(() => {
    result.current.addTodo('Active todo');
    result.current.addTodo('Completed todo');
    result.current.toggleTodo(result.current.allTodos[1].id);
  });
  
  expect(result.current.stats).toEqual({
    total: 2,
    active: 1,
    completed: 1
  });
});
```

### Filter Testing

Test filtering functionality:

```typescript
test('should filter todos correctly', () => {
  const { result } = renderHook(() => useTodos());
  
  // Add test data
  act(() => {
    result.current.addTodo('Active');
    result.current.addTodo('Completed');
    result.current.toggleTodo(result.current.allTodos[1].id);
  });
  
  // Test active filter
  act(() => {
    result.current.setFilter('active');
  });
  expect(result.current.todos).toHaveLength(1);
  expect(result.current.todos[0].text).toBe('Active');
});
```

## Future Enhancements

### Persistence Hook

A future enhancement could include persistence:

```typescript
// Potential useTodosWithPersistence hook
const useTodosWithPersistence = () => {
  const todoHook = useTodos();
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      // Load saved todos
    }
  }, []);
  
  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todoHook.allTodos));
  }, [todoHook.allTodos]);
  
  return todoHook;
};
```

### Server Synchronization

Future server integration could follow similar patterns:

```typescript
// Potential useServerTodos hook
const useServerTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Server sync logic
  
  return {
    todos,
    loading,
    error,
    // ... operations
  };
};
```

### Optimistic Updates

For better user experience with server integration:

```typescript
const addTodoOptimistic = useCallback(async (text: string, priority: TodoPriority) => {
  const optimisticTodo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date(),
    priority,
    pending: true // Optimistic flag
  };
  
  // Add optimistically
  setTodos(prev => [...prev, optimisticTodo]);
  
  try {
    const serverTodo = await api.createTodo(optimisticTodo);
    // Replace optimistic with server response
    setTodos(prev => prev.map(todo => 
      todo.id === optimisticTodo.id ? serverTodo : todo
    ));
  } catch (error) {
    // Remove optimistic todo on error
    setTodos(prev => prev.filter(todo => todo.id !== optimisticTodo.id));
  }
}, []);
```