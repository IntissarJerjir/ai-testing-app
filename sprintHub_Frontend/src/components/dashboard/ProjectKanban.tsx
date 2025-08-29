import React, { useState } from "react";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { KanbanColumn } from "@/types";

interface ProjectKanbanProps {
  selectedProject: string | null;
  kanbanColumns: KanbanColumn[];
  onAddTask: () => void;
}

export function ProjectKanban({ 
  selectedProject, 
  kanbanColumns, 
  onAddTask 
}: ProjectKanbanProps) {
 
  
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Kanban Board</h3>
        <div className="flex gap-2">          
        </div>
      </div>
      {selectedProject ? (
        <KanbanBoard 
          columns={kanbanColumns} 
          projectId={selectedProject}
          className="mt-4"
        />
      ) : (
        <div className="text-center py-8">
          <p>Please select a sprint to view its Kanban board.</p>
        </div>
      )}
      
     
      
    </div>
  );
}