import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from '../store/authSlice';
import { RootState } from '../store/store';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on app start
    const checkAuthSession = async () => {
      try {
        // In a real app, this would check secure storage or make an API call
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          dispatch(setUser(parsedUser));
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthSession();
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      // Mock authentication - replace with actual API call
      if (email === 'user@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email: 'user@example.com',
          phone: '+1234567890',
        };
        
        dispatch(setUser(mockUser));
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      // Mock registration - replace with actual API call
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      };
      
      dispatch(setUser(newUser));
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    dispatch(clearUser());
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      const updatedUser = { ...user, ...updates };
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
};
