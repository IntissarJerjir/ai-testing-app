
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { userService, projectService } from "@/services/api";
import { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  projectId?: string;
}

export function AddMemberDialog({ open, onOpenChange, onSuccess, projectId }: AddMemberDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to load users.",
        });
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open, toast]);

  const handleAddMember = async () => {
    if (!selectedUserId || !projectId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await projectService.addMemberToProject(projectId, selectedUserId);
      toast({
        title: "Member added",
        description: "The member has been successfully added to the project.",
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to add member to project.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add member to project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        <span className="text-muted-foreground text-xs">({user.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
          <Separator />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember} 
            disabled={isLoading || !selectedUserId}
          >
            {isLoading ? "Adding ..." : "Added"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}