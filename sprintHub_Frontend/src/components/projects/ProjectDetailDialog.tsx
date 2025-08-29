import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { Progress } from "@/components/ui/progress";
import { CircleOff, Hourglass, CheckCircle, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface ProjectDetailDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "on-hold":
      return <CircleOff className="h-5 w-5 text-amber-500" />;
    case "active":
    default:
      return <Hourglass className="h-5 w-5 text-blue-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "Completed";
    case "on-hold":
      return "On Hold";
    case "active":
    default:
      return "Active";
  }
};

export function ProjectDetailDialog({ project, isOpen, onClose }: ProjectDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Sprint Details</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {getStatusIcon(project.status)}
                  <span className="ml-1.5">{getStatusText(project.status)}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Project completion</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Dates
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Start:</span>
                      <span className="ml-2">
                        {format(new Date(project.startDate), "MMM dd, yyyy", { locale: enUS })}
                      </span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">End:</span>
                        <span className="ml-2">
                          {format(new Date(project.endDate), "MMM dd, yyyy", { locale: enUS })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Team
                  </h3>
                  <div className="flex items-start text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      {project.team && project.team.length > 0 ? (
                        <span>{project.team.length} members</span>
                      ) : (
                        <span className="text-muted-foreground">No members assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}