# Getting Started

Welcome to the React Todo App documentation! This comprehensive guide will help you get up and running with our feature-rich Todo application.

## Overview

This is a modern, full-featured Todo application built with:
- **React 19** - Modern React with latest features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Custom Hooks** - Clean state management patterns

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/my-react-app.git
cd my-react-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

## Core Features

### Todo Management
- ✅ **Create todos** - Add new tasks with custom text (up to 200 characters)
- 📝 **Real-time character counter** - Visual feedback for input length
- ✏️ **Mark complete/incomplete** - Toggle task status with checkboxes
- 🗑️ **Delete todos** - Remove individual tasks
- 🧹 **Clear completed** - Bulk remove all completed tasks

### Priority System
- 🔴 **High Priority** - Urgent tasks with red indicator
- 🟡 **Medium Priority** - Standard tasks with yellow indicator (default)  
- 🟢 **Low Priority** - Non-urgent tasks with green indicator
- 🎯 **Visual indicators** - Color-coded priority display

### Filtering & Organization
- 📋 **Filter views** - All, Active, or Completed todos
- 📊 **Real-time statistics** - Total, active, and completed task counts
- 📅 **Creation dates** - Automatic timestamp display in user's locale
- 📈 **Character statistics** - Total character count across all todos

### Social Sharing
- 𝕏 **Individual sharing** - Share single tasks to X/Twitter with status
- 🌐 **Bulk sharing** - Share entire todo list with progress summary
- 📱 **Optimized sharing** - Formatted text with emojis and progress indicators

### User Experience
- 🎨 **Dark/light theme toggle** - Automatic system preference detection
- 💾 **Theme persistence** - Remembers user preference in localStorage
- 📱 **Responsive design** - Optimized for mobile, tablet, and desktop
- 🔢 **Todo count badge** - Real-time counter in app title
- ⚡ **Fast performance** - Optimized with React hooks and Vite
- 🔴 **Distinctive footer** - Red-themed footer with technology credits

### Technical Features
- 🔧 **TypeScript support** - Full type safety throughout
- 🎣 **Custom hooks** - Clean separation of concerns with `useTodos`
- 🆔 **Unique IDs** - Secure UUID generation for todos
- 📝 **Form validation** - Input trimming and length validation
- 🔄 **State management** - Efficient React state patterns

## Input Specifications

### Todo Text Input
- **Maximum length**: 200 characters
- **Validation**: Automatic trimming of whitespace
- **Placeholder**: "What needs to be done?"
- **Real-time feedback**: Character counter (current/200)

### Priority Selection
```typescript
type TodoPriority = 'low' | 'medium' | 'high';
```
- **Default**: Medium priority
- **Display**: Emoji indicators with descriptive labels
- **Colors**: High (🔴), Medium (🟡), Low (🟢)

## Data Structure

### Todo Interface
```typescript
interface Todo {
  id: string;           // Unique identifier (UUID)
  text: string;         // Todo content (max 200 chars)
  completed: boolean;   // Completion status
  createdAt: Date;      // Creation timestamp
  priority: TodoPriority; // Priority level
}
```

### Filter Options
```typescript
type TodoFilter = 'all' | 'active' | 'completed';
```

## Quick Start Example

1. **Add a high-priority task**: Select "🔴 High Priority", type "Complete project documentation", click "Add"
2. **Mark complete**: Click the checkbox next to the task
3. **Share progress**: Click "𝕏 Share All" to post your progress to X/Twitter
4. **Toggle theme**: Click the theme toggle in the navbar
5. **View statistics**: Check the stats bar for total/active/completed counts

## Next Steps

- Explore the comprehensive [Features Guide](/docs/features) to understand all available functionality
- Learn about [Components](/docs/components) and their organization  
- Understand [Hooks](/docs/hooks) for state management patterns
- Check the [API Reference](/docs/api) for detailed function signatures