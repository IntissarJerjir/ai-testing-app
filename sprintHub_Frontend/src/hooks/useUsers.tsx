import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const users = await userService.getAllUsers();
      return Promise.all(
        users.map(async user => {
          const userId = parseInt(user.id);
          const [projects, tasks] = await Promise.all([
            userService.getUserProjects(userId),
            userService.getUserTasks(userId)
          ]);
          
          return {
            ...user,
            projects,
            tasks,
            projectsCount: projects.length,
            tasksCount: tasks.length,
            completedTasksCount: tasks.filter(
              t => t.status === 'done' || t.status === 'completed'
            ).length
          };
        })
      );
    }
  });


 
  const getUserById = (id: string) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: () => userService.getUserById(parseInt(id)),
    });
  };

  const getUserProjects = (userId: string) => {
    return useQuery({
      queryKey: ['userProjects', userId],
      queryFn: () => userService.getUserProjects(parseInt(userId)),
    });
  };

  const getUserTasks = (userId: string) => {
    return useQuery({
      queryKey: ['userTasks', userId],
      queryFn: () => userService.getUserTasks(parseInt(userId)),
    });
  };

  const updateUser = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) => 
      userService.updateUser(parseInt(id), userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'User updated',
        description: 'User information has been updated successfully',
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'User deleted',
        description: 'User has been removed from the system',
      });
    },
  });

  return {
    users,
    
    getUser: getUserById,
    getUserProjects,
    getUserTasks,
    updateUser,
    deleteUser,
  };
}