import { useState } from 'react';

// Define an interface for user signup details
interface SignUpDetails {
  email: string;
  password: string;
  name?: string;
  // Add other relevant user details
}

// Define the return type of the useAuth hook
interface AuthHook {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (details: SignUpDetails) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthHook {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user is already authenticated (e.g., from local storage)
    const storedAuthState = localStorage.getItem('isAuthenticated');
    return storedAuthState === 'true';
  });

  const login = async (email: string, password: string) => {
    try {
      // Replace with actual authentication logic (e.g., API call)
      // Example: const response = await authService.login(email, password);
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Persist authentication state
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      // Handle login errors
      console.error('Login failed', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const signUp = async (details: SignUpDetails) => {
    try {
      // Replace with actual signup logic (e.g., API call)
      // Example: const response = await authService.signUp(details);
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Persist authentication state
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      // Handle signup errors
      console.error('Signup failed', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    // Replace with actual logout logic (e.g., clearing tokens)
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return { 
    isAuthenticated, 
    login, 
    signUp, 
    logout 
  };
}