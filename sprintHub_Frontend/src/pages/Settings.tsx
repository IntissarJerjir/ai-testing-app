import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { LockKeyhole, BellRing, User, Shield, Moon, Sun, Globe } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { darkMode, language, toggleDarkMode, setLanguage } = useTheme();
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationPush, setNotificationPush] = useState(true);


  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setFormLoading(false);
      toast({
        title: 'Profile updated',
        description: 'Your personal information has been successfully updated.',
      });
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setFormLoading(false);
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
    }, 1000);
  };

  const handleNotificationUpdate = () => {
    toast({
      title: 'Notification preferences updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleAppearanceUpdate = () => {
    toast({
      title: 'Appearance preferences updated',
      description: 'Your appearance preferences have been saved.',
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[600px] mb-8">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Sun className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information here. This information will be visible to your teammates.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" placeholder="https://..." defaultValue={user?.avatar || ''} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Change your password and manage account security settings.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Options</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Change Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Project Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when a project is modified.
                      </p>
                    </div>
                    <Switch
                      checked={notificationEmail}
                      onCheckedChange={setNotificationEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Assigned Tasks</p>
                      <p className="text-sm text-muted-foreground">
                        Receive emails when a task is assigned to you.
                      </p>
                    </div>
                    <Switch
                      checked={notificationEmail}
                      onCheckedChange={setNotificationEmail}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Task Comments</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone comments on a task.
                      </p>
                    </div>
                    <Switch
                      checked={notificationPush}
                      onCheckedChange={setNotificationPush}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Upcoming Deadlines</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for tasks with approaching deadlines.
                      </p>
                    </div>
                    <Switch
                      checked={notificationPush}
                      onCheckedChange={setNotificationPush}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
  <Card>
    <CardHeader>
      <CardTitle>Appearance</CardTitle>
      <CardDescription>
        Customize the appearance of the application to your preferences.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">
              Enable dark mode for the application.
            </p>
          </div>
          <div className="flex items-center">
            <Sun className="h-5 w-5 mr-2 text-muted-foreground" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode} // Use toggleDarkMode from context
            />
            <Moon className="h-5 w-5 ml-2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Language</h3>
        <div className="flex items-center space-x-4">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <select 
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={language}
            onChange={(e) => setLanguage(e.target.value)} // Use setLanguage from context
          >
            <option value="fr">French</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={handleAppearanceUpdate}>Save Preferences</Button>
    </CardFooter>
  </Card>
</TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;