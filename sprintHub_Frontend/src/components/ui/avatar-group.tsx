
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { cn } from "@/lib/utils";

interface AvatarGroupProps {
  users: User[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({
  users,
  max = 4,
  size = "md",
  className,
}: AvatarGroupProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const visibleUsers = (users ?? []).slice(0, max);
  const remainingCount = (users ?? []).length - max;
  

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visibleUsers.map((user) => (
        <Avatar
          key={user.id}
          className={cn(
            sizeClasses[size],
            "ring-2 ring-background transition-transform hover:translate-y-[-2px]"
          )}
        >
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="font-medium">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            sizeClasses[size],
            "ring-2 ring-background flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
