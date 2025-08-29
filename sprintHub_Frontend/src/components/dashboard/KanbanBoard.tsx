import React, { useState } from "react";
import { KanbanColumn, Task } from "@/types";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditTaskForm } from "@/components/tasks/EditTaskForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { useGenerateGherkin } from "@/hooks/useGenerateGherkin";

import "./KanbanBoard.css";

interface KanbanBoardProps {
  columns: KanbanColumn[];
  projectId: string;
  className?: string;
}

export function KanbanBoard({ columns, projectId, className }: KanbanBoardProps) {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [gherkinModal, setGherkinModal] = useState<{ gherkin: string; title: string } | null>(null);
  const [generatingTaskId, setGeneratingTaskId] = useState<string | null>(null);
  const [generatedTaskIds, setGeneratedTaskIds] = useState<Set<string>>(new Set());

  const { updateTaskStatus } = useTasks(projectId);
  const { toast } = useToast();
  const generateGherkin = useGenerateGherkin();

  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggingOver(columnId);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
    setDraggingOver(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggingTask) {
      updateTaskStatus.mutate(
        { id: draggingTask.id, status: columnId },
        {
          onSuccess: () => {
            toast({
              title: "Status updated",
              description: `The task has been moved to \"${columnId}\"`,
            });
          },
          onError: (error) => {
            console.error("Failed to update task status:", error);
            toast({
              variant: "destructive",
              title: "Update failed",
              description: "Unable to update the status. Please try again.",
            });
          },
        }
      );
    }
    setDraggingTask(null);
    setDraggingOver(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditTaskOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setAddingToColumn(columnId);
    setIsAddTaskOpen(true);
  };

  const handleGenerateTestCase = async (taskId: string, taskTitle: string) => {
    setGeneratingTaskId(taskId);
    try {
      const res = await generateGherkin.mutateAsync(taskId);
      if (res?.gherkin) {
        setGherkinModal({ gherkin: res.gherkin, title: taskTitle });
        setGeneratedTaskIds(prev => new Set(prev).add(taskId));
      }
    } catch (err) {
      console.error("Error generating test case:", err);
    } finally {
      setGeneratingTaskId(null);
    }
  };

  return (
    <>
      <div className={`kanban-board ${className}`}>
        {columns.map((column) => (
          <div
            key={column.id}
            className={`kanban-column ${draggingOver === column.id ? "column-drop-active" : ""}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragLeave={() => setDraggingOver(null)}
          >
            <div className="kanban-column-header">
              <div className="flex items-center gap-2">
                <span>{column.title}</span>
                <Badge variant="secondary" className="font-normal">
                  {column.tasks.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Add a task"
                onClick={() => handleAddTask(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="kanban-column-content">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-pointer ${draggingTask?.id === task.id ? "task-dragging" : ""}`}
                >
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onGenerateTestCase={() => handleGenerateTestCase(task.id, task.title)}
                  />
                  {generatingTaskId === task.id && (
                    <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating test case...
                    </div>
                  )}
                  {generatedTaskIds.has(task.id) && generatingTaskId !== task.id && (
                    <div className="text-green-600 text-xs mt-1">✅ Test Generated</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <Dialog
          open={isEditTaskOpen}
          onOpenChange={(open) => {
            setIsEditTaskOpen(open);
            if (!open) setSelectedTask(null);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <EditTaskForm
              task={selectedTask}
              onCancel={() => setIsEditTaskOpen(false)}
              onSuccess={() => setIsEditTaskOpen(false)}
              projectId={projectId}
            />
          </DialogContent>
        </Dialog>
      )}

      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={projectId}
        initialStatus={addingToColumn || undefined}
      />

      {gherkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Test Case for: {gherkinModal.title}</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
              {gherkinModal.gherkin}
            </pre>
            <button
              onClick={() => setGherkinModal(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
