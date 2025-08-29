import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400",
};

const getLabelColor = (label: string) => {
  switch (label.toLowerCase()) {
    case "meeting":
      return "bg-blue-100 text-blue-800";
    case "user story":
      return "bg-green-100 text-green-800";
    case "bug":
      return "bg-red-100 text-red-800";
    case "ticket":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: () => void;
  onGenerateTestCase?: (taskId: string) => void;
}

export function TaskCard({ task, className, onClick, onGenerateTestCase }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const colorPalette = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
    "#98D8C8", "#F06292", "#7986CB", "#9575CD",
    "#64B5F6", "#4DB6AC", "#81C784", "#FFD54F",
    "#FF8A65", "#A1887F", "#90A4AE"
  ];

  const getColorForUser = (userId: any) => {
    const idString = userId?.toString() || Math.random().toString();
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPalette[Math.abs(hash) % colorPalette.length];
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.split(" ").filter((part) => part.length > 0);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <Card
      className={cn(
        "hover-card transition-all border hover:shadow-md relative cursor-pointer",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate flex-1">{task.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-normal py-1",
                priorityColors[task.priority],
                "flex-shrink-0"
              )}
            >
              {task.priority}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 ml-8">{task.description}</p>
        )}

        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-8">
            {task.labels.map((label, index) => (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  getLabelColor(label),
                  "hover:bg-opacity-80 transition-colors"
                )}
              >
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t mt-2">
          <div className="flex -space-x-3">
            {task.assignees?.slice(0, 3).map((user) => (
              <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback
                      className="text-white text-xs font-medium"
                      style={{ backgroundColor: getColorForUser(user.id) }}
                    >
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {task.assignees?.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="bg-gray-300 text-gray-700 text-xs font-medium">
                      +{task.assignees.length - 3}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Plus d'assignés</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.assignees.slice(3).map((user) => (
                      <span key={user.id} className="text-xs">
                        {user.name}
                      </span>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            {task.dueDate && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onGenerateTestCase?.(task.id);
          }}
          className="text-sm text-primary hover:underline mt-2"
        >
          Generate Test Case
        </button>
      </CardContent>
    </Card>
  );
}
