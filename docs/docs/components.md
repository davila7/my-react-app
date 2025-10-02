# Components Reference

This document provides detailed information about all React components used in the Todo App, their props, usage, and examples.

## Core Application Components

### App Component

The main application component that orchestrates the entire todo application.

**File**: `src/App.tsx`

**Props**: None (root component)

**Features**:
- Theme management with localStorage persistence
- Todo state management via `useTodos` hook  
- Form handling for todo creation
- Social sharing functionality
- Responsive layout container

**Key State**:
```typescript
const [theme, setTheme] = useState<'light' | 'dark'>()
const [inputValue, setInputValue] = useState('')
const [priority, setPriority] = useState<TodoPriority>('medium')
```

**Usage**:
```tsx
import App from './App'

// Root component - no props needed
<App />
```

## Navigation Components

### Navbar Component

Responsive navigation bar with branding and theme toggle.

**File**: `src/components/Navbar.tsx`

**Props**:
```typescript
interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**Features**:
- Brand display ("TodoApp")
- Navigation links (Home, About, Contact, Profile)
- Integrated theme toggle
- Responsive design for mobile/desktop

**Usage**:
```tsx
import Navbar from './components/Navbar'

<Navbar 
  theme={theme} 
  toggleTheme={toggleTheme} 
/>
```

**Structure**:
```tsx
<nav className="navbar">
  <div className="navbar-container">
    <div className="navbar-brand">
      <h2>TodoApp</h2>
    </div>
    <div className="navbar-menu">
      <a href="#" className="navbar-item">Home</a>
      <a href="#" className="navbar-item">About</a>
      <a href="#" className="navbar-item">Contact</a>
      <a href="#" className="navbar-item navbar-profile">Profile</a>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
    </div>
  </div>
</nav>
```

**Navigation Links**:
- **Home**: Main application view
- **About**: Information about the application
- **Contact**: Contact information or support
- **Profile**: User profile navigation (styled with `navbar-profile` class)
- All navigation links use placeholder `href="#"` attributes

### Footer Component

Simple footer with copyright and technology information.

**File**: `src/components/Footer.tsx`

**Props**: None

**Features**:
- Copyright notice
- Technology credits (React & TypeScript)
- Consistent styling with app theme

**Usage**:
```tsx
import Footer from './components/Footer'

<Footer />
```

**Structure**:
```tsx
<footer className="footer">
  <div className="footer-container">
    <p>&copy; 2024 TodoApp. Built with React & TypeScript.</p>
  </div>
</footer>
```

## UI Components

### ThemeToggle Component

Interactive switch for toggling between light and dark themes.

**File**: `src/components/ThemeToggle.tsx`

**Props**:
```typescript
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**Features**:
- Visual toggle switch (checkbox-based)
- Theme-aware labels with emojis
- Accessible keyboard navigation
- Tooltip support

**Usage**:
```tsx
import ThemeToggle from './components/ThemeToggle'

<ThemeToggle 
  theme={theme} 
  toggleTheme={toggleTheme} 
/>
```

**Visual States**:
- Light mode: "☀️ Light" 
- Dark mode: "🌙 Dark"

**Accessibility**:
- `title` attribute for tooltip
- Semantic checkbox input
- Keyboard accessible

**Structure**:
```tsx
<label className="theme-toggle-switch" title="Toggle light/dark mode">
  <input
    type="checkbox"
    checked={theme === 'dark'}
    onChange={toggleTheme}
  />
  <span className="slider" />
  <span className="theme-toggle-label">
    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
  </span>
</label>
```

## Component Patterns

### Props Interface Pattern

All components use TypeScript interfaces for props:

```typescript
interface ComponentNameProps {
  // Required props (no question mark)
  requiredProp: string;
  
  // Optional props (with question mark)
  optionalProp?: number;
  
  // Function props
  onAction: () => void;
  onActionWithData: (data: string) => void;
}
```

### Component Declaration Pattern

All components follow the functional component pattern:

```typescript
const ComponentName: React.FC<ComponentNameProps> = ({ 
  prop1, 
  prop2, 
  onAction 
}) => {
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## Styling Approach

### CSS Modules Pattern

Each component has its own CSS file:
- `Navbar.tsx` → `Navbar.css`
- `Footer.tsx` → `Footer.css`
- `ThemeToggle.tsx` → `ThemeToggle.css`

### BEM-like Class Naming

Components use descriptive CSS classes:

```css
/* Block */
.navbar { }

/* Element */
.navbar-container { }
.navbar-brand { }
.navbar-menu { }

/* Modifier */
.navbar-item.active { }
```

### Theme-Aware Styling

Components respond to theme changes via CSS custom properties:

```css
.navbar {
  background-color: var(--navbar-background);
  color: var(--navbar-text);
  border-bottom: 1px solid var(--border-color);
}
```

## Component Architecture

### Container vs Presentational

The app follows a clear separation of concerns:

#### Container Components
- **App**: Manages state and business logic
- **Navbar**: Handles theme state and navigation

#### Presentational Components  
- **Footer**: Pure presentation, no state
- **ThemeToggle**: Controlled component, receives state via props

### Data Flow

Props and data flow downward from parent to child:

```
App (state management)
├── Navbar (receives theme state)
│   └── ThemeToggle (receives theme toggle function)
└── Footer (no props needed)
```

## Component Integration

### Theme System Integration

All visual components participate in the theme system:

1. **Theme state**: Managed in `App` component
2. **Theme propagation**: Passed down via props
3. **CSS variables**: Applied at document level
4. **Component styling**: Responds to CSS custom properties

### Responsive Design Integration

Components adapt to different screen sizes:

```css
/* Mobile-first approach */
.navbar-menu {
  display: flex;
  flex-direction: column;
}

/* Desktop adaptation */
@media (min-width: 768px) {
  .navbar-menu {
    flex-direction: row;
  }
}
```

## Testing Considerations

### Component Testing Strategy

Each component can be tested independently:

```typescript
// Example test structure
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

describe('Navbar', () => {
  const mockToggleTheme = jest.fn()
  
  test('renders brand name', () => {
    render(
      <Navbar theme="light" toggleTheme={mockToggleTheme} />
    )
    expect(screen.getByText('TodoApp')).toBeInTheDocument()
  })
})
```

### Props Testing

Test component behavior with different prop combinations:

```typescript
// Theme toggle testing
test('calls toggleTheme when clicked', () => {
  const mockToggle = jest.fn()
  render(<ThemeToggle theme="light" toggleTheme={mockToggle} />)
  
  fireEvent.click(screen.getByRole('checkbox'))
  expect(mockToggle).toHaveBeenCalledTimes(1)
})
```

## Performance Considerations

### Re-render Optimization

Components are optimized to prevent unnecessary re-renders:

- **Pure functional components**: No internal state when possible
- **Prop drilling**: Minimal to reduce complexity  
- **Callback stability**: Functions passed as props should be memoized

### Bundle Size

Components contribute to bundle size optimization:

- **Tree shaking**: Unused components are excluded
- **Code splitting**: Components can be lazy-loaded if needed
- **CSS optimization**: Unused styles are removed in production

## Accessibility Features

### Keyboard Navigation

All interactive components support keyboard access:

- **Tab order**: Logical focus progression
- **Enter/Space**: Activates buttons and toggles
- **ARIA attributes**: Screen reader support

### Screen Reader Support

Components include proper semantic markup:

```tsx
// Semantic HTML elements
<nav role="navigation">
<button aria-pressed={isActive}>
<label htmlFor="theme-toggle">
```

### Color Contrast

All components meet WCAG 2.1 AA standards:

- **Sufficient contrast**: Text meets 4.5:1 ratio
- **Focus indicators**: Clear visual focus states
- **Theme consistency**: Both light and dark themes are accessible

## Future Component Extensions

### Planned Components

Additional components that could extend the app:

- **TodoItem**: Dedicated component for individual todos
- **TodoList**: Container component for todo collection
- **FilterButtons**: Dedicated filtering interface
- **Statistics**: Dedicated stats display component

### Component Enhancement Opportunities

- **Loading states**: Add loading indicators
- **Error boundaries**: Wrap components in error handlers
- **Animation**: Add smooth transitions between states
- **Tooltips**: Enhanced help text for complex features