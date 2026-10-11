import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_USER_KEY = 'fmcg_portal_auth_user';

export const THULIR_DEFAULT_USER = {
  id: 'usr-thulir-01',
  name: 'Thulir Operations Manager',
  email: 'admin@thulir.com',
  agencyId: 'thulir',
  role: 'Agency Managing Director',
  avatar: '🏢',
  badge: 'Owner / Admin'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically migrate legacy demo user to Thulir Agencies
        if (parsed.email === 'admin@muruganfmcg.com') {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(THULIR_DEFAULT_USER));
          return THULIR_DEFAULT_USER;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    // Default logged in as Thulir Agencies administrator
    return THULIR_DEFAULT_USER;
  });

  const login = (email, password) => {
    const isThulir = !email || email.includes('thulir') || email === 'admin@thulir.com';
    const newUser = {
      id: isThulir ? 'usr-thulir-01' : 'usr-01',
      name: isThulir ? 'Thulir Operations Manager' : (email.includes('annapoorna') ? 'A. Somasundaram' : 'M. S. Murugesan'),
      email: email || 'admin@thulir.com',
      agencyId: isThulir ? 'thulir' : 'custom',
      role: 'Agency Managing Director',
      avatar: isThulir ? '🏢' : '👨‍💼',
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
