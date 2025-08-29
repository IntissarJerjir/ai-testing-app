import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/hooks/useAuth";

export function useNotifyAction() {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const notifyTaskAssigned = (taskTitle: string, assigneeId?: string) => {
    if (assigneeId === user?.id) {
      addNotification({
        type: 'task',
        title: 'New task assigned',
        message: `Task "${taskTitle}" has been assigned to you.`
      });
    }
  };
  
  const notifyTaskCompleted = (taskTitle: string) => {
    addNotification({
      type: 'task',
      title: 'Task completed',
      message: `Task "${taskTitle}" has been marked as completed.`
    });
  };
  
  const notifyProjectCreated = (projectName: string) => {
    addNotification({
      type: 'project',
      title: 'New project created',
      message: `Project "${projectName}" was successfully created.`
    });
  };
  
  const notifyProjectUpdated = (projectName: string) => {
    addNotification({
      type: 'project',
      title: 'Project updated',
      message: `Project "${projectName}" has been updated.`
    });
  };
  
  const notifyTeamMemberAdded = (memberName: string, projectName: string) => {
    addNotification({
      type: 'team',
      title: 'New team member',
      message: `${memberName} has joined the ${projectName} project team.`
    });
  };
  
  const notifySystemUpdate = (title: string, message: string) => {
    addNotification({
      type: 'system',
      title,
      message
    });
  };
  
  return {
    notifyTaskAssigned,
    notifyTaskCompleted,
    notifyProjectCreated,
    notifyProjectUpdated,
    notifyTeamMemberAdded,
    notifySystemUpdate
  };
}