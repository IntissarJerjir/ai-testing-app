
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  MessageSquare, 
  PlusCircle, 
  UserPlus,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';

const Notifications = () => {
  const { toast } = useToast();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const [loading, setLoading] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'project':
        return <PlusCircle className="h-6 w-6 text-green-500" />;
      case 'team':
        return <UserPlus className="h-6 w-6 text-purple-500" />;
      case 'system':
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Function to generate dummy notifications for testing
  const generateTestNotification = () => {
    const types = ['task', 'project', 'team', 'system'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let title = '', message = '';
    switch(type) {
      case 'task':
        title = 'Nouvelle tâche assignée';
        message = 'La tâche "' + ['Implémenter l\'authentification', 'Créer une API', 'Corriger un bug'][Math.floor(Math.random() * 3)] + '" vous a été assignée';
        break;
      case 'project':
        title = 'Projet mis à jour';
        message = 'Le projet "SprintHub" a été mis à jour';
        break;
      case 'team':
        title = 'Nouveau membre dans l\'équipe';
        message = ['Jean Dupont', 'Marie Martin', 'Pierre Durand'][Math.floor(Math.random() * 3)] + ' a rejoint l\'équipe du projet SprintHub';
        break;
      case 'system':
        title = 'Maintenance système';
        message = 'Une maintenance est prévue pour le ' + (new Date(Date.now() + 86400000 * 3)).toLocaleDateString('fr-FR');
        break;
    }

    return { type, title, message };
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
          
          {/* Bouton pour ajouter une notification de test */}
          <Button
            variant="default"
            onClick={() => {
              const notification = generateTestNotification();
              const { type, title, message } = notification;
              const notificationContext = useNotifications();
              notificationContext.addNotification({
                type: type as any,
                title,
                message
              });
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Test
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all">
            Toutes
            {notifications.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {notifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les notifications</CardTitle>
              <CardDescription>
                Historique de vos notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      {index > 0 && <Separator />}
                      <div className={`flex gap-4 py-2 ${!notification.read ? 'bg-muted/20' : ''}`}>
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="mt-4 text-muted-foreground">Aucune notification</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Notifications non lues</CardTitle>
              <CardDescription>
                Notifications que vous n'avez pas encore vues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : unreadCount > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter(notification => !notification.read)
                    .map((notification, index, filteredArray) => (
                      <React.Fragment key={notification.id}>
                        {index > 0 && <Separator />}
                        <div className="flex gap-4 py-2 bg-muted/20">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(notification.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckCheck className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="mt-4 text-muted-foreground">Aucune notification non lue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
