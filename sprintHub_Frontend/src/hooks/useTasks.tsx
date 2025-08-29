import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import { Task } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useTasks(projectId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: projectId ? ['tasks', projectId] : ['tasks'],
    queryFn: () => projectId 
      ? taskService.getTasksByProject(projectId)
      : taskService.getAllTasks(),
    enabled: !projectId || Boolean(projectId),
  });

  const getTask = (id: string) => {
    return useQuery({
      queryKey: ['task', id],
      queryFn: () => taskService.getTaskById(id),
    });
  };

  const createTask = useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => {
      console.log("Creating task with data:", newTask);
      return taskService.createTask(newTask);
    },
    onSuccess: (data) => {
      console.log("Task created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
      toast({
        title: 'Task Created',
        description: 'The task has been successfully created.',
      });
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Unable to create the task. Please try again.',
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<Task> }) =>
      taskService.updateTask(id, task),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      }
      toast({
        title: 'Task Updated',
        description: 'The task has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Unable to update the task. Please try again.',
      });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      console.log(`Updating task ${id} status to ${status}`);
      return taskService.updateTaskStatus(id, status);
    },
    onSuccess: (data) => {
      console.log("Task status updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      }
      toast({
        title: 'Task Deleted',
        description: 'The task has been successfully deleted.',
      });
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Unable to delete the task. Please try again.',
      });
    },
  });
  const assignUserToTask = useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) => 
      taskService.assignUserToTask(taskId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.taskId] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      }
      toast({
        title: 'User Assigned',
        description: `User has been successfully assigned to the task.`,
      });
    },
    onError: (error) => {
      console.error('Failed to assign user:', error);
      toast({
        variant: 'destructive',
        title: 'Assignment Failed',
        description: 'Unable to assign user to task. Please try again.',
      });
    },
  });


  return {
    tasks,
    isLoading,
    error,
    getTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    assignUserToTask,
  };
}
