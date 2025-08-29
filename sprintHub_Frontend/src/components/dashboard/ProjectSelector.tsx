import React from "react";
import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectChange: (projectId: string) => void;
  onAddTask: () => void;
  isLoading: boolean;
}
export function ProjectSelector({
  projects,
  selectedProject,
  onProjectChange,
  isLoading,
}: ProjectSelectorProps) {
  if (isLoading) {
    return <div>Loading sprints...</div>;
  }

  if (!projects || projects.length === 0) {
    return <div>No sprints available</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProject || ""}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}