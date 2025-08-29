import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { KanbanColumn, Task } from "@/types";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { ProjectSelector } from "@/components/dashboard/ProjectSelector";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ProjectKanban } from "@/components/dashboard/ProjectKanban";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get('project');
  
  
  const { projects, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { tasks: allTasks, isLoading: tasksLoading } = useTasks();
  const { tasks: projectTasks, isLoading: projectTasksLoading } = useTasks(selectedProject || undefined);
  
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  
  useEffect(() => {
    if (projects && projects.length > 0) {
      if (projectIdFromUrl) {
        setSelectedProject(projectIdFromUrl);
      } else if (!selectedProject) {
        setSelectedProject(projects[0].id);
      }
    }
  }, [projects, projectIdFromUrl, selectedProject]);
  
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    setSearchParams({ project: projectId });
  };
  
  const project = selectedProject 
    ? projects.find(p => p.id === selectedProject) 
    : null;
  
  const projectStats = React.useMemo(() => {
    if (!project || (!allTasks && !projectTasks)) return null;
    
    const tasksToUse = selectedProject 
      ? projectTasks || [] 
      : allTasks.filter(t => t.projectId === selectedProject);
    
    const totalTasks = tasksToUse.length;
    const inProgressTasks = tasksToUse.filter(t => 
      t.status === 'in-progress' || t.status === 'review'
    ).length;
    const completedTasks = tasksToUse.filter(t => 
      t.status === 'done' || t.status === 'completed'
    ).length;
    const urgentTasks = tasksToUse.filter(t => t.priority === 'urgent').length;
    const highPriorityTasks = tasksToUse.filter(t => t.priority === 'high').length;
    
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return {
      totalTasks,
      inProgressTasks,
      completedTasks,
      urgentTasks,
      highPriorityTasks,
      completionRate
    };
  }, [project, allTasks, projectTasks, selectedProject]);
  
  const kanbanColumns = React.useMemo(() => {
    if (!selectedProject) return [] as KanbanColumn[];
    
    console.log("Creating kanban columns for project:", selectedProject);
    
    const tasksToUse = projectTasks || allTasks.filter(task => task.projectId === selectedProject);
    
    console.log("Tasks for Kanban:", tasksToUse);
    
    return [
      {
        id: 'todo',
        title: 'To Do',
        tasks: tasksToUse.filter(task => task.status === 'todo'),
        projectId: selectedProject
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: tasksToUse.filter(task => task.status === 'in-progress'),
        projectId: selectedProject
      },

      {
        id: 'testing',
        title: 'Testing',
        tasks: tasksToUse.filter(task => task.status === 'testing'),
        projectId: selectedProject
      },
      {
        id: 'done',
        title: 'Done',
        tasks: tasksToUse.filter(task => 
          task.status === 'done' || task.status === 'completed'
        ),
        projectId: selectedProject
      },
    ];
  }, [selectedProject, projectTasks, allTasks]);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar title="Dashboard" />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <ProjectSelector 
                projects={projects || []}
                selectedProject={selectedProject}
                onProjectChange={handleProjectChange}
                onAddTask={() => setIsAddTaskOpen(true)}
                isLoading={isLoading}
              />
            </div>
            
            <DashboardStats project={project} projectStats={projectStats} />
            
            <DashboardCharts projectId={selectedProject || undefined} />
            
            <ProjectKanban 
              selectedProject={selectedProject}
              kanbanColumns={kanbanColumns}
              onAddTask={() => setIsAddTaskOpen(true)}
            />
          </div>
        </div>
      </main>

      {selectedProject && (
        <AddTaskDialog 
          isOpen={isAddTaskOpen} 
          onClose={() => setIsAddTaskOpen(false)} 
          projectId={selectedProject} 
        />
      )}
    </div>
  );
}