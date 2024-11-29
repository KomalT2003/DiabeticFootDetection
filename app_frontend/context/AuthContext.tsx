import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode 
  } from 'react';
  
  interface User {
    username: string;
    role: 'user' | 'admin';
  }
  
  interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {}
  });
  
  export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
  
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
          // Your existing login logic
          if (username === 'admin' && password === '123') {
            setUser({ username, role: 'admin' });
            return true;
          }
          else  {
            setUser({ username, role: 'user' });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      };
  
    const logout = () => {
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout 
      }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);
  