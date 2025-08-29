import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/api';
import { Project, KanbanColumn } from '@/types';
import { useToast } from '@/hooks/use-toast';

const mapProjectFromBackend = (project: any): Project => {
  console.log("Mapping project:", project);

  return {
    id: String(project.id || project.Id),
    name: project.name || project.Name,
    description: project.description || project.Description,
    status: (project.status || project.Status || "active").toLowerCase() as any,
    progress: project.progress || project.Progress || 0,
    startDate: project.startDate || project.StartDate,
    endDate: project.endDate || project.EndDate,
    team: (project.team || project.Team || []).map((user: any) => ({
      id: String(user.id || user.Id),
      name: user.name || user.Name || 'Unknown User',
      email: user.email || user.Email || '',
      avatar: user.avatar || user.Avatar || undefined,
      role: (user.role || user.Role || 'member') as 'admin' | 'member' | 'manager' | 'developer'
    })),
    tasks: project.tasks || project.Tasks || [],
  };
};

export function useProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    data: backendProjects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAllProjects,
    retry: 2,
    staleTime: 30000,
  });
  const projects: Project[] = Array.isArray(backendProjects) 
    ? backendProjects.map((project: any) => {
        console.log("Raw project data:", project); 
        return mapProjectFromBackend(project);
      })
    : [];

  console.log("Mapped projects:", projects); 
  const getProject = (id: string) => {
    return useQuery({
      queryKey: ['project', id],
      queryFn: () => projectService.getProjectById(id)
        .then((data: any) => mapProjectFromBackend(data)),
    });
  };
  const getKanbanColumns = (projectId: string) => {
    return useQuery({
      queryKey: ['kanbanColumns', projectId],
      queryFn: () => projectService.getKanbanColumns(projectId),
    });
  };
  const createProject = useMutation({
    mutationFn: (newProject: Omit<Project, 'id'>) => 
      projectService.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created',
        description: 'The project has been successfully created.',
      });
    },
    onError: (error) => {
      console.error('Failed to create project:', error);
      toast({
        variant: 'destructive',
        title: 'Creation failed',
        description: 'Unable to create the project. Please try again.',
      });
    },
  });
  const createKanbanColumn = useMutation({
    mutationFn: ({ projectId, column }: { projectId: string; column: Omit<KanbanColumn, 'id'> }) => 
      projectService.createKanbanColumn(projectId, column),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kanbanColumns', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Column created',
        description: 'The column has been successfully created.',
      });
    },
    onError: (error) => {
      console.error('Failed to create Kanban column:', error);
      toast({
        variant: 'destructive',
        title: 'Creation failed',
        description: 'Unable to create the column. Please try again.',
      });
    },
  });
  const updateProject = useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<Project> }) =>
      projectService.updateProject(id, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
      toast({
        title: 'Project updated',
        description: 'The project has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update project:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Unable to update the project. Please try again.',
      });
    },
  });
  const deleteProject = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete project:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion failed',
        description: 'Unable to delete the project. Please try again.',
      });
    },
  });
   const addMemberToProject = useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectService.addMemberToProject(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      toast({
        title: 'Membre ajouté',
        description: 'Le membre a été ajouté au projet avec succès.',
      });
    },
    onError: (error) => {
      console.error('Failed to add member to project:', error);
      toast({
        variant: 'destructive',
        title: 'Échec de l\'ajout',
        description: 'Impossible d\'ajouter le membre au projet. Veuillez réessayer.',
      });
    },
  });


  return {
    projects,
    isLoading,
    error,
    getProject,
    getKanbanColumns,
    createProject,
    createKanbanColumn,
    updateProject,
    deleteProject,
    addMemberToProject
  };
}
