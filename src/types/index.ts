export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority?: string;
  progress: number;
  startDate?: string;
  dueDate?: string;
  // Backend field names (normalized by interceptor)
  owner?: User | string;
  ownerId?: string;
  members?: (User | string)[];
  memberIds?: string[];
  workspace?: string;
  workspaceId?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  // Backend fields (normalized by interceptor)
  project?: any;
  projectId?: string;
  workspace?: string;
  workspaceId?: string;
  assignee?: User | string;
  assigneeId?: string;
  reporter?: User | string;
  reporterId?: string;
  labels?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  checklist?: {
    id?: string;
    text?: string;
    isCompleted?: boolean;
    total?: number;
    completed?: number;
  }[] | { total: number; completed: number };
  attachments?: string[];
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  task?: string;
  taskId?: string;
  author?: User | string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  recipient?: string;
  recipientId?: string;
  actor?: User | string;
  actorId?: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  read?: boolean;
  entityType?: string;
  entityId?: string;
  createdAt: string;
  link?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  ownerId?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}
