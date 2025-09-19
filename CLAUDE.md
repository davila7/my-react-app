# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite and hot reload
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all TypeScript/TSX files

### Custom Agent
- `npm run agent:security-auditor` - Run security audit covering codebase, dependencies, and deployment configuration

## Project Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 4.5
- **Styling**: CSS with CSS custom properties for theming
- **Linting**: ESLint with TypeScript support and React hooks rules
- **Package Manager**: npm

### Application Structure
This is a Todo application with the following key architectural patterns:

#### Component Architecture
- **App.tsx**: Main application component handling theme management and todo UI
- **Components**: Modular components in `src/components/` including Navbar, Footer, ThemeToggle, Sidebar, and a reusable ListCrud component
- **Layout**: App wrapper with Navbar at top and Footer at bottom

#### State Management
- **useTodos Hook** (`src/hooks/useTodos.ts`): Core todo state management with CRUD operations and filtering
- **useListCrud Hook** (`src/hooks/useListCrud.ts`): Generic reusable hook for list-based CRUD operations
- Local state for theme management with localStorage persistence and system preference detection

#### Type System
- **todo.ts**: Todo-specific types (Todo, TodoFilter, TodoPriority)
- **list-item.ts**: Generic types for reusable list components (ListItem, ListCrudConfig)
- **voice.ts**: Voice-related types for potential voice features

#### Theme System
- CSS custom properties-based theming with light/dark mode support
- Theme state persisted in localStorage with system preference fallback
- Applied via `data-theme` attribute on `<html>` element

#### Key Features
- **CRUD Operations**: Add, edit, delete, and filter todos with priority levels
- **Social Sharing**: Integration with X (Twitter) for sharing individual todos or full lists
- **Responsive Design**: Mobile-friendly interface with proper accessibility
- **Character Limits**: 200 character limit for todos with real-time counter
- **Priority System**: Three-level priority system (low/medium/high) with visual indicators

### File Organization
```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks for state logic
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.css           # Global styles and CSS variables
```

### Development Notes
- Uses modern React patterns (hooks, functional components)
- TypeScript strict mode enabled
- ESLint configured with React-specific rules
- No test framework currently configured
- Vite provides fast development server and optimized production builds