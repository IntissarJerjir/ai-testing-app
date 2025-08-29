import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Mail, Phone, AtSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/api";
import { User } from "@/types";

interface UserWithStats extends User {
  tasksCount?: number;

}

export default function Team() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersWithStats, setUsersWithStats] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const users = await userService.getAllUsers();
        
        const statsPromises = users.map(async user => {
          try {
            return {
              ...user
              
            };
          } catch (error) {
            console.error(`Error processing user ${user.id}:`, error);
            return {
              ...user
              
            };
          }
        });
    
        const usersWithStats = await Promise.all(statsPromises);
        setUsersWithStats(usersWithStats);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = usersWithStats.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    toast({
      title: "Coming soon",
      description: "Member addition feature will be available soon",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Navbar title="Team" />
        <main className="flex-1 py-6">
          <div className="container">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar title="Team" />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search team members..." 
                    className="w-full md:w-60 pl-9" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="shrink-0" onClick={handleAddMember}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-col items-center text-center pb-2">
                        <Avatar className="h-20 w-20 mb-2">
                          <AvatarFallback className="text-lg font-medium bg-primary text-primary-foreground">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant="outline" className="mt-2 capitalize">
                          {user.role}
                        </Badge>
                      </CardHeader>

                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium text-sm bg-muted/50">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2 text-center">Role</div>

                  </div>
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/10 transition-colors">
                      <div className="col-span-4 flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}