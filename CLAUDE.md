# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript + Vite todo list application with theme support and social sharing features.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Lint codebase
npm run lint

# Preview production build
npm run preview

# Run security audit (custom agent)
npm run agent:security-auditor
```

## Architecture

### State Management Pattern

The application uses a custom hooks pattern for state management:

- **`useTodos`** (src/hooks/useTodos.ts) - Domain-specific hook for todo operations with filtering
- **`useListCrud`** (src/hooks/useListCrud.ts) - Generic CRUD hook pattern for list-based data

Both hooks use `useCallback` for memoization and follow the same pattern of returning operations and filtered/derived state.

### Theme System

Theme is managed at the App level (src/App.tsx:10-31):
- Reads from localStorage and system preferences
- Sets both `data-theme` attribute and `colorScheme` on `<html>` element
- Global CSS variables respond to `[data-theme]` attribute

### Component Structure

- **App.tsx** - Main component, combines theme, todo state, and layout components
- **Navbar/Footer** - Layout components; Navbar includes ThemeToggle
- **Sidebar** - Currently unused
- **ListCrud** - Generic list component (not currently used by main app)

### Type System

TypeScript types are organized by domain:
- `types/todo.ts` - Todo-related types (Todo, TodoFilter, TodoPriority)
- `types/list-item.ts` - Generic list item interface
- `types/voice.ts` - Voice-related types (currently unused)

## Key Patterns

### Generic Hook Pattern

The `useListCrud` hook demonstrates a reusable pattern for list CRUD operations with TypeScript generics:
```typescript
const { items, addItem, updateItem, deleteItem } = useListCrud<CustomType>()
```

### Filter State Pattern

The todo filtering shows a common pattern of maintaining separate filtered and full state:
- `todos` (filtered) and `allTodos` (full list) returned from `useTodos`
- Filtering happens inside the hook, not in components

## GitHub Actions

The repo includes a Docusaurus documentation automation workflow (`.github/workflows/docusaurus-auto-docs.yml`) that:
- Triggers on PRs to main for code file changes
- Uses the `docusaurus-expert` agent to auto-generate documentation
- Creates a separate PR with documentation updates

When modifying code that may need documentation updates, be aware this workflow will trigger automatically.

## Build Configuration

- **Vite** for bundling and dev server
- **TypeScript** with separate configs for app (`tsconfig.app.json`) and Node (`tsconfig.node.json`)
- **ESLint** with React hooks and React refresh plugins

## Notes

- OpenAI dependency in package.json suggests potential AI features (not currently visible in code)
- Social sharing to X (Twitter) is integrated throughout the todo UI
- App does not persist todos to localStorage (in-memory only)