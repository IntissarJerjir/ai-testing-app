
export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'ready-to-test' | 'testing'| 'done' ;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'manager' | 'developer';
  token?: string; 
  projects?: Project[];
  tasks?: Task[];
  projectsCount?: number;
  tasksCount?: number;
  completedTasksCount?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status | string; 
  priority: Priority;
  createdAt: string;
  dueDate?: string;
  assignees: User[];
  projectId: string;
  labels: string[];
 
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: User[];
  status: 'active' | 'completed' | 'on-hold' | string;
  progress: number;
  startDate: string;
  endDate: string; 
  tasks: Task[];
  
}

export interface KanbanColumn {
  id: string; 
  title: string;
  tasks: Task[];
  projectId?: string;
}


export interface DotNetProject {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string; 
  endDate?: string; 
  tasks: any[]; 
  team: any[]; 
  
}
export interface ProjectUpdateDto {
  name?: string;
  description?: string;
  status?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  userIdToAdd?: string;
}



