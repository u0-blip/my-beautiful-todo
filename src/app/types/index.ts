export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  size: string;
  urgency: string;
  completed: boolean;
  completedAt?: string;
  isWeekly?: boolean;
  timesPerWeek?: number;
  originalTaskId?: number;
  weeklyCompletionCount?: number;
  createdAt: string;
  tags: { tag: { name: string } }[];
}

export interface Comment {
  id: number;
  text: string;
  timestamp: string;
  taskId: number;
}

export interface TaskForm {
  title: string;
  description: string;
  dueDate: string;
  size: string;
  urgency: string;
  tags: string;
  isWeekly: boolean;
  timesPerWeek: number;
}

export interface AuthForm {
  email: string;
  password: string;
}

export interface Filters {
  tag: string;
  size: string;
  urgency: string;
  completed: string;
  due: string;
  sort: string;
} 