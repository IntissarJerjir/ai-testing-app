import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  CheckCircle,
  PlusCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTasks } from "@/hooks/useTasks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditTaskForm } from "@/components/tasks/EditTaskForm";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { Task } from "@/types";

const getLabelColor = (labels: string) => {
  switch (labels.toLowerCase()) {
    case 'meeting':
      return 'bg-blue-100 text-blue-800';
    case 'user story':
      return 'bg-green-100 text-green-800';
    case 'bug':
      return 'bg-red-100 text-red-800';
    case 'ticket':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Tasks() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { tasks, isLoading } = useTasks();
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      const searchMatch = task.title.toLowerCase().includes(search.toLowerCase());
      let statusMatch = true;
      
      if (activeTab !== "all") {
        if (activeTab === "pending") {
          statusMatch = task.status === "pending" || task.status === "todo" || task.status === "backlog";
        } else if (activeTab === "in progress") {
          statusMatch = task.status === "in-progress";
        } else if (activeTab === "completed") {
          statusMatch = task.status === "done" || task.status === "completed";
        }
      }
      
      return searchMatch && statusMatch;
    });
  }, [tasks, search, activeTab]);

  const sortedTasks = React.useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
  }, [filteredTasks, sort]);

  const taskCounts = React.useMemo(() => {
    if (!tasks) return { total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 };
    
    const now = new Date();
    
    const pending = tasks.filter(t => 
      t.status === "pending" || t.status === "todo" || t.status === "backlog"
    ).length;
    
    const inProgress = tasks.filter(t => t.status === "in-progress" || t.status === "ready-to-test" || t.status === "testing" || t.status === "review").length;
    
    const completed = tasks.filter(t => 
      t.status === "done" || t.status === "completed"
    ).length;
    
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && 
      (t.status !== "done" && t.status !== "completed")
    ).length;

  
    
    return {
      total: tasks.length,
      pending,
      inProgress,
      completed,
      overdue
    };
  }, [tasks]);

  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F06292', '#7986CB', '#9575CD',
    '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F',
    '#FF8A65', '#A1887F', '#90A4AE'
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
  if (!name) return '??';
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar title="Backlog">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-semibold">Tickets</h1>
        </div>
      </Navbar>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Backlog</h2>
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search Ticket..."
                  className="max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => setIsAddTaskOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Ticket
                </Button>
              </div>
            </div>

            <Card className="animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle>Backlog Overview</CardTitle>
                <CardDescription>
                  Efficiently track and manage your project Backlog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <Card className="bg-green-100">
                    <CardHeader>
                      <CardTitle className="text-green-600">
                        Total Tickets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700">
                        {taskCounts.total}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-100">
                    <CardHeader>
                      <CardTitle className="text-blue-600">
                        Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-700">
                        {taskCounts.completed}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-100">
                    <CardHeader>
                      <CardTitle className="text-orange-600">
                        Pending
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-700">
                        {taskCounts.pending}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-100">
                    <CardHeader>
                      <CardTitle className="text-red-600">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-700">
                        {taskCounts.overdue}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading Backlog...</div>
            ) : sortedTasks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sortedTasks.map((task) => (
                  <Card 
                    key={task.id} 
                    className="animate-fade-in cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{task.title}</CardTitle>
                        {task.priority === "high" || task.priority === "urgent" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                      <CardDescription>{task.description}</CardDescription>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {task.labels.map((labels, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded-full ${getLabelColor(labels)}`}
                            >
                              {labels}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Created: {new Date(task.createdAt).toLocaleDateString('en-US')}
                        </span>
                      </div>
                  
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div className="flex -space-x-2">
                      {task.assignees?.slice(0, 3).map((user) => {
                          if (!user || !user.id) return null;
                          
                          const userColor = getColorForUser(user.id);
                          return (
                            <Tooltip key={user.id}>
                              <TooltipTrigger asChild>
                                <Avatar 
                                  className="h-8 w-8 border-2 border-background hover:z-10 hover:scale-110 transition-all"
                                  style={{
                                    backgroundColor: user.avatar ? 'transparent' : userColor,
                                  }}
                                >
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback 
                                    className="text-white font-medium"
                                    style={{ backgroundColor: userColor }}
                                  >
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.name}</p>
                                <p className="text-muted-foreground text-xs">{user.role || 'Member'}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                        {task.assignees.length > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="bg-gray-300 text-gray-700 font-medium">
                                  +{task.assignees.length - 3}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Plus d'assignés</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.assignees.slice(3).map(user => (
                                  <span key={user.id} className="text-xs">
                                    {user.name}
                                  </span>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleTaskClick(task);
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No Tickets match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          {selectedTask && (
            <EditTaskForm 
              task={selectedTask}
              onCancel={() => setIsTaskDialogOpen(false)}
              onSuccess={() => {
                setIsTaskDialogOpen(false);
                
              }}
            />
          )}
        </DialogContent>
      </Dialog>


      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId=""
          
      />
    </div>
  );
}