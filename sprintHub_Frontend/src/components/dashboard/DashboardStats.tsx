import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ClipboardList, CircleEllipsis, CheckCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectStatsProps {
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  urgentTasks: number;
  highPriorityTasks: number;
  completionRate: number;
}

interface DashboardStatsProps {
  project: any;
  projectStats: ProjectStatsProps | null;
}

export function DashboardStats({ project, projectStats }: DashboardStatsProps) {
  if (!project) return null;

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Sprint progress ({project.progress}%)
              </div>
              <div className="text-sm font-medium">
                {new Date(project.startDate).toLocaleDateString('en-US')} - {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US') : 'Ongoing'}
              </div>
            </div>
            <Progress value={project.progress} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {projectStats && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total tasks"
            value={projectStats.totalTasks}
            icon={<ClipboardList className="h-full w-full" />}
            description="All sprint tickets"
          />
          <DashboardCard
            title="In progress"
            value={projectStats.inProgressTasks}
            icon={<CircleEllipsis className="h-full w-full" />}
            description="Currently ongoing tickets"
            trend={{
              value: projectStats.inProgressTasks > 0 ? Math.round((projectStats.inProgressTasks / projectStats.totalTasks) * 100) : 0,
              positive: true,
            }}
          />
          <DashboardCard
            title="Completed"
            value={projectStats.completedTasks}
            icon={<CheckCheck className="h-full w-full" />}
            description={`${projectStats.completionRate}% completion rate`}
            trend={{
              value: projectStats.completionRate,
              positive: true,
            }}
          />
          <DashboardCard
            title="Urgent issues"
            value={projectStats.urgentTasks + projectStats.highPriorityTasks}
            icon={<AlertTriangle className="h-full w-full" />}
            description="High priority tickets"
            trend={{
              value: projectStats.urgentTasks + projectStats.highPriorityTasks > 0 ? 
                Math.round(((projectStats.urgentTasks + projectStats.highPriorityTasks) / projectStats.totalTasks) * 100) : 0,
              positive: false,
            }}
          />
        </div>
      )}
    </>
  );
}