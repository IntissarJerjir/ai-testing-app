import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ProjectDetailDialog } from "@/components/projects/ProjectDetailDialog";
import { Project,User } from "@/types";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { useUsers } from "@/hooks/useUsers";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const { projects, isLoading, deleteProject,  updateProject,addMemberToProject } = useProjects();
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    
  };
  const handleCloseDetail = () => setSelectedProject(null);

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate(id);
    }
  };
  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsEditDialogOpen(true);
  };
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F06292', '#7986CB', '#9575CD',
    '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F',
    '#FF8A65', '#A1887F', '#90A4AE'
  ];
  
  const getColorForUser = (userId: string) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[hash % colorPalette.length];
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
      <Navbar title="Sprints">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-semibold">Sprints</h1>
        </div>
      </Navbar>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Sprints</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search Sprint..."
                    className="pl-8 w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsAddProjectOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Sprint
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                
                <CardDescription>
                  Manage and track all your ongoing sprints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No projects found.</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setIsAddProjectOpen(true)}
                    >
                      Create new Sprint
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            <div
                              className="cursor-pointer hover:underline"
                              onClick={() => handleViewProject(project)}
                            >
                              {project.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === "active"
                                  ? "default"
                                  : project.status === "completed"
                                  ? "default" 
                                  : "secondary"
                              }
                            >
                              {project.status === "active"
                                ? "Active"
                                : project.status === "completed"
                                ? "Completed"
                                : project.status === "on-hold"
                                ? "On Hold"
                                : project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              {project.team?.map((user) => {
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
                                      <p className="text-muted-foreground text-xs">{user.role}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          </TableCell>                             
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={project.progress}
                                className="h-2 w-[100px]"
                              />
                              <span className="text-xs text-muted-foreground">
                                {project.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(project.startDate), "MMM dd, yyyy", {
                              locale: enUS,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleViewProject(project)}
                                >
                                  View details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CreateProjectDialog
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />

      {selectedProject && (
        <ProjectDetailDialog
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseDetail}
        />
      )}

      {projectToEdit && (
        <EditProjectDialog
          project={projectToEdit}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={(updatedProject) => {
            updateProject.mutate({
              id: projectToEdit.id,
              project: updatedProject,
            });
          }}
          onAddMember={(userId) => {
            addMemberToProject.mutate({
              projectId: projectToEdit.id,
              userId,
            });
          }}
        />
      )}
    </div>
  );
}