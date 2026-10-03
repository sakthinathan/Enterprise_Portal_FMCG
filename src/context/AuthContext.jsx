import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_USER_KEY = 'fmcg_portal_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default logged in as demo administrator for instant testability
    return {
      id: 'usr-01',
      name: 'M. S. Murugesan',
      email: 'admin@muruganfmcg.com',
      role: 'Agency Managing Director',
      avatar: '👨‍💼',
      badge: 'Owner / Admin'
    };
  });

  const login = (email, password) => {
    const newUser = {
      id: 'usr-01',
      name: email.includes('annapoorna') ? 'A. Somasundaram' : 'M. S. Murugesan',
      email: email || 'admin@muruganfmcg.com',
      role: 'Agency Managing Director',
      avatar: '👨‍💼',
      badge: 'Owner / Admin'
    };
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
