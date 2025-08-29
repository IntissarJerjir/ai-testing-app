
import { Project, Task, User, Status, KanbanColumn } from '@/types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=FF5733&color=fff',
    role: 'member',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=28B463&color=fff',
    role: 'member',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=8E44AD&color=fff',
    role: 'member',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=F1C40F&color=fff',
    role: 'member',
  },
];

// Mock tasks
export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Design system implementation',
    description: 'Create a design system with reusable components for the application',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2023-11-01T10:00:00Z',
    dueDate: '2023-11-15T18:00:00Z',
    assignees: [users[0], users[1]],
    projectId: 'p1',
    labels: ['design', 'frontend'],
  },
  {
    id: 't2',
    title: 'API integration',
    description: 'Integrate the frontend with the backend APIs',
    status: 'todo',
    priority: 'medium',
    createdAt: '2023-11-02T09:00:00Z',
    dueDate: '2023-11-20T18:00:00Z',
    assignees: [users[2]],
    projectId: 'p1',
    labels: ['backend', 'api'],
  },
  {
    id: 't3',
    title: 'User authentication',
    description: 'Implement user authentication with JWT',
    status: 'done',
    priority: 'high',
    createdAt: '2023-10-28T11:00:00Z',
    dueDate: '2023-11-10T18:00:00Z',
    assignees: [users[0], users[4]],
    projectId: 'p1',
    labels: ['security', 'backend'],
  },
  {
    id: 't4',
    title: 'Kanban board functionality',
    description: 'Implement drag and drop functionality for the Kanban board',
    status: 'review',
    priority: 'high',
    createdAt: '2023-11-03T14:00:00Z',
    dueDate: '2023-11-18T18:00:00Z',
    assignees: [users[1], users[3]],
    projectId: 'p1',
    labels: ['frontend', 'ux'],
  },
  {
    id: 't5',
    title: 'Database schema design',
    description: 'Design the PostgreSQL database schema for the application',
    status: 'done',
    priority: 'medium',
    createdAt: '2023-10-25T13:00:00Z',
    dueDate: '2023-11-05T18:00:00Z',
    assignees: [users[4]],
    projectId: 'p1',
    labels: ['database', 'backend'],
  },
  {
    id: 't6',
    title: 'Performance optimization',
    description: 'Optimize application performance and loading times',
    status: 'backlog',
    priority: 'low',
    createdAt: '2023-11-05T16:00:00Z',
    dueDate: '2023-11-25T18:00:00Z',
    assignees: [users[2], users[3]],
    projectId: 'p1',
    labels: ['performance', 'optimization'],
  },
  {
    id: 't7',
    title: 'Mobile responsiveness',
    description: 'Ensure the application is fully responsive on mobile devices',
    status: 'todo',
    priority: 'medium',
    createdAt: '2023-11-04T10:00:00Z',
    dueDate: '2023-11-22T18:00:00Z',
    assignees: [users[1]],
    projectId: 'p1',
    labels: ['frontend', 'responsive'],
  },
  {
    id: 't8',
    title: 'Documentation',
    description: 'Create comprehensive documentation for the codebase',
    status: 'backlog',
    priority: 'low',
    createdAt: '2023-11-06T09:00:00Z',
    dueDate: '2023-11-30T18:00:00Z',
    assignees: [users[0]],
    projectId: 'p1',
    labels: ['documentation'],
  },
  // Project 2 tasks
  {
    id: 't9',
    title: 'Landing page redesign',
    description: 'Redesign the marketing landing page with new branding',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2023-11-01T10:00:00Z',
    dueDate: '2023-11-15T18:00:00Z',
    assignees: [users[1], users[3]],
    projectId: 'p2',
    labels: ['design', 'marketing'],
  },
  {
    id: 't10',
    title: 'SEO optimization',
    description: 'Optimize website content for better search engine rankings',
    status: 'todo',
    priority: 'medium',
    createdAt: '2023-11-02T09:00:00Z',
    dueDate: '2023-11-20T18:00:00Z',
    assignees: [users[4]],
    projectId: 'p2',
    labels: ['marketing', 'seo'],
  },
];

// Mock projects
export const projects: Project[] = [
  {
    id: 'p1',
    name: 'SprintHub Development',
    description: 'Primary application development project for the SprintHub platform',
    team: users,
    status: 'active',
    progress: 65,
    startDate: '2023-10-15T00:00:00Z',
    endDate: '2023-12-15T00:00:00Z',
    tasks: tasks.filter(task => task.projectId === 'p1'),
  },
  {
    id: 'p2',
    name: 'Marketing Website',
    description: 'SprintHub marketing website and landing pages',
    team: [users[1], users[3], users[4]],
    status: 'active',
    progress: 30,
    startDate: '2023-10-20T00:00:00Z',
    endDate: '2023-11-30T00:00:00Z',
    tasks: tasks.filter(task => task.projectId === 'p2'),
  },
];

// Kanban board columns
export const getKanbanColumns = (projectId: string): KanbanColumn[] => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  
  return [
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: projectTasks.filter(task => task.status === 'backlog'),
    },
    {
      id: 'todo',
      title: 'To Do',
      tasks: projectTasks.filter(task => task.status === 'todo'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: projectTasks.filter(task => task.status === 'in-progress'),
    },
    {
      id: 'review',
      title: 'Review',
      tasks: projectTasks.filter(task => task.status === 'review'),
    },
    {
      id: 'done',
      title: 'Done',
      tasks: projectTasks.filter(task => task.status === 'done'),
    },
  ];
};

// Stats for dashboard
export const getProjectStats = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;
  
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = projectTasks.filter(task => task.status === 'todo').length;
  const backlogTasks = projectTasks.filter(task => task.status === 'backlog').length;
  const reviewTasks = projectTasks.filter(task => task.status === 'review').length;
  
  const urgentTasks = projectTasks.filter(task => task.priority === 'urgent').length;
  const highPriorityTasks = projectTasks.filter(task => task.priority === 'high').length;
  
  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    backlogTasks,
    reviewTasks,
    urgentTasks,
    highPriorityTasks,
    completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
};
