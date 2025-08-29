import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token =
          localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'); 
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthStatus();
  }, []);


  const login = async (email: string, password: string, remember: boolean) => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      
      console.log('Token received:', userData.token);
      if (remember) {
        localStorage.setItem('auth_token', userData.token);
        console.log('Token stored in localStorage');
      } else {
        sessionStorage.setItem('auth_token', userData.token);
        console.log('Token stored in sessionStorage');
        localStorage.removeItem('auth_token');
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome to SprintHub!',
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Incorrect email or password.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    try {
      setLoading(true);
      // Redirect to the GitHub authentication URL
      const userData = await authService.loginWithGithub();
      setUser(userData);
      toast({
        title: 'Login successful',
        description: 'Welcome to SprintHub!',
      });
    } catch (error) {
      console.error('GitHub login failed:', error);
      toast({
        variant: 'destructive',
        title: 'GitHub login failed',
        description: 'Unable to log in with GitHub.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setLoading(true);
      const userData = await authService.register(name, email, password, role);
      setUser(userData);
      toast({
        title: 'Account successfully created',
        description: 'Welcome to SprintHub!',
      });
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'Unable to create the account. Please try again.',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast({
        title: 'Logout successful',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: 'There was an issue logging out. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
