import axios from 'axios';
import { Project, Task, User, KanbanColumn } from '@/types';

const API_URL = 'http://localhost:5041/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service d'authentification
export const authService = {
  login: async (email: string, password: string) => {
    console.log('Tentative de connexion avec:', { email, password });
  
    const response = await api.post('/auth/signin', { email, password });
  
    console.log('Réponse du backend:', response);
  
    const { token, user } = response.data;
    return { ...user, token };
  },
  
  
  loginWithGithub: async () => {
    const response = await api.get('/auth/github');
    const { redirectUrl } = response.data;
    window.location.href = redirectUrl;
    return null;
  },
  
  handleGithubCallback: async (code: string) => {
    const response = await api.post('/auth/github/callback', { code });
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    
    return user;
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    const { token, user } = response.data;
    
    localStorage.setItem('auth_token', token);
    
    return user;
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Service des projets
export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  getProjectById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  
  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    const formattedProject = {
      ...project,
      startDate: new Date(project.startDate).toISOString(),
      endDate: project.endDate ? new Date(project.endDate).toISOString() : null,
    };
    
    console.log('Sending project to backend:', formattedProject);
    const response = await api.post('/projects', formattedProject);
    return response.data;
  },
  
  updateProject: async (id: string, project: Partial<Project>): Promise<Project> => {
   
    const formattedProject = { ...project };
    if (project.startDate) {
      formattedProject.startDate = new Date(project.startDate).toISOString();
    }
    if (project.endDate) {
      formattedProject.endDate = new Date(project.endDate).toISOString();
    }
    
    const response = await api.put(`/projects/${id}`, formattedProject);
    return response.data;
  },
  
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
  
  addMemberToProject: (projectId: string, userId: string) => {
    return api.post(`/projects/${projectId}/add-member/${userId}`);
  },

    
  getKanbanColumns: async (projectId: string): Promise<KanbanColumn[]> => {
    const response = await api.get(`/kanbanColumns`);
    return response.data;
  },

  createKanbanColumn: async (projectId: string, column: Omit<KanbanColumn, 'id'>): Promise<KanbanColumn> => {
    const response = await api.post(`/kanbanColumns`, column);
    return response.data;
  },

  updateKanbanColumn: async (id: string, column: Partial<KanbanColumn>): Promise<KanbanColumn> => {
    const response = await api.put(`/kanbancolumns/${id}`, column);
    return response.data;
  },

  deleteKanbanColumn: async (id: string): Promise<void> => {
    await api.delete(`/kanbancolumns/${id}`);
  }
  };


// Service des tâches
export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/byProject/${projectId}`);
    return response.data;
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },
  
  updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },
  
  updateTaskStatus: (id: string, status: string) => {
    return api.put(`/tasks/${id}/status`, { Status: status }); // Send as JSON
  },
  
  moveTaskToColumn: async (id: string, columnId: string): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/move`, { status: columnId });
    return response.data;
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  generateGherkinTestCase: async (projectTaskId: string) => {
  const response = await api.post('/testcase/generate', { projectTaskId: parseInt(projectTaskId) });
  return response.data; // { testCaseId, gherkin }
},

};

// Service des utilisateurs
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/auth/users');
    return response.data.map(user => ({
      ...user,
      id: user.id.toString()
    }));
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/auth/users/${id}`);
    return {
      ...response.data,
      id: response.data.id.toString()
    };
  },

  getUserProjects: async (userId: number): Promise<Project[]> => {
    const response = await api.get(`/auth/users/${userId}/projects`);
    return response.data.map(project => ({
      ...project,
      id: project.id.toString()
    }));
  },

  getUserTasks: async (userId: number): Promise<Task[]> => {
    const response = await api.get(`/auth/users/${userId}/tasks`);
    return response.data.map(task => ({
      ...task,
      id: task.id.toString(),
      projectId: task.projectId.toString()
    }));
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/auth/users/${id}`, userData);
    return {
      ...response.data,
      id: response.data.id.toString()
    };
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/auth/users/${id}`);
  }
};




export default api;
