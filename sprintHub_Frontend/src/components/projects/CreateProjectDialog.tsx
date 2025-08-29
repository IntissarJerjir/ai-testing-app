import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectForm } from "./ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

interface CreateProjectDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps = {}) {
  // Use the passed isOpen prop or internal state
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  
  const { createProject } = useProjects();
  const { toast } = useToast();
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onClose && !newOpen) {
      onClose();
    } else {
      setInternalOpen(newOpen);
    }
  };
  
  const handleSubmit = async (values: any) => {
    try {
      console.log("Form values:", values);
      
      // Prepare the project data with proper casing for the .NET backend
      const projectData = {
        name: values.name,
        description: values.description,
        status: values.status,
        progress: values.progress,
        startDate: values.startDate,
        endDate: values.endDate,
        team: [],              // Empty team initially
        tasks: [],             // No tasks initially
      };
      
      await createProject.mutateAsync(projectData);
      
      // Close the dialog on success
      handleOpenChange(false);
      
      // Show success toast
      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Show error toast
      toast({
        variant: "destructive",
        title: "Project creation failed",
        description: "An error occurred while creating your project. Please try again.",
      });
    }
  };

  // If we're using the trigger-based pattern
  if (isOpen === undefined) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sprint
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create new Sprint</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            onSubmit={handleSubmit} 
            isLoading={createProject.isPending} 
          />
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create new Sprint</DialogTitle>
        </DialogHeader>
        <ProjectForm 
          onSubmit={handleSubmit} 
          isLoading={createProject.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
}