import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task, Priority, Status } from "@/types";
import { useTasks } from "@/hooks/useTasks";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar-group";

interface EditTaskFormProps {
  task: Task;
  onCancel: () => void;
  onSuccess: () => void;
  projectId?: string;
}

const taskSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 characters"),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  labels: z.string().optional(),
  dueDate: z.date().optional(),
  comment: z.string().optional(),
});

export function EditTaskForm({ task, onCancel, onSuccess, projectId }: EditTaskFormProps) {
  const { updateTask, deleteTask } = useTasks(projectId);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [comments, setComments] = useState<{id: string, text: string, author: string, date: string}[]>([]);
  
  const defaultValues = {
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    labels: task.labels.join(", "),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    comment: "",
  };
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const isDueSoon = task.dueDate && new Date(task.dueDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  const onSubmit = (data: z.infer<typeof taskSchema>) => {
    // Split labels by comma and trim
    const labels = data.labels ? data.labels.split(",").map(label => label.trim()) : [];
    
    const updatedTask: Partial<Task> = {
      title: data.title,
      description: data.description,
      status: data.status as Status,
      priority: data.priority as Priority,
      labels: labels,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
    };
    
    console.log("Updating task with data:", updatedTask);
    
    updateTask.mutate({ id: task.id, task: updatedTask }, {
      onSuccess: () => {
        console.log("Task updated successfully");
        onSuccess();
      },
      onError: (error) => {
        console.error("Failed to update task:", error);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id, {
        onSuccess: () => onSuccess()
      });
    }
  };

  const handleAddComment = () => {
    const comment = form.getValues("comment");
    if (!comment || !comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: "Current user",
      date: new Date().toISOString()
    };
    
    setComments([...comments, newComment]);
    form.setValue("comment", "");
  };

  const renderDetailsTab = () => (
    <div className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Ticket title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Ticket description" 
                className="resize-none min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
              
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="ready-to-test">Ready to test</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Due date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Select a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="labels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Labels</FormLabel>
            <FormControl>
              <Input 
                placeholder="Labels separated by commas" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <h4 className="text-sm font-medium mb-1">Created on</h4>
        <div className="text-sm text-muted-foreground">
          {format(new Date(task.createdAt), "PPP", { locale: fr })}
        </div>
      </div>

      {task.assignees.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-1">Assigned to</h4>
          <div className="flex items-center gap-2">
            <AvatarGroup users={task.assignees} />
            <div className="text-sm text-muted-foreground">
              {task.assignees.map(user => user.name).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCommentsTab = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments for this task.
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="p-3 border rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.date), "PPp", { locale: fr })}
                </span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={handleAddComment} className="w-full">
          Add comment
        </Button>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Edit task</DialogTitle>
            <Badge className={cn("text-xs",
              task.priority === 'low' ? "bg-blue-100 text-blue-800" : 
              task.priority === 'medium' ? "bg-yellow-100 text-yellow-800" : 
              task.priority === 'high' ? "bg-orange-100 text-orange-800" : 
              "bg-red-100 text-red-800"
            )}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            {renderDetailsTab()}
          </TabsContent>
          <TabsContent value="comments">
            {renderCommentsTab()}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between items-center pt-4">
          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}