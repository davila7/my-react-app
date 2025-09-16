export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: TodoPriority;
}

export type TodoFilter = 'all' | 'active' | 'completed';