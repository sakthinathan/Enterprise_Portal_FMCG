import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_USER_KEY = 'fmcg_portal_auth_user';

export const ROLES = {
  ADMIN: 'Agency Managing Director',
  GODOWN_AUDITOR: 'Godown Stock Auditor'
};

export const THULIR_ADMIN_USER = {
  id: 'usr-thulir-01',
  name: 'Thulir Operations Manager',
  email: 'admin@thulir.com',
  agencyId: 'thulir',
  role: ROLES.ADMIN,
  avatar: '🏢',
  badge: 'Owner / Admin'
};

export const THULIR_AUDITOR_USER = {
  id: 'usr-thulir-checker',
  name: 'Thulir Godown Stock Auditor',
  email: 'checker@thulir.com',
  agencyId: 'thulir',
  role: ROLES.GODOWN_AUDITOR,
  avatar: '📦',
  badge: 'Godown Staff / Blind Auditor'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email === 'admin@muruganfmcg.com') {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(THULIR_ADMIN_USER));
          return THULIR_ADMIN_USER;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    // Return null when unauthenticated so refreshing the page does not force auto-login
    return null;
  });

  const login = (email, password, roleHint = null) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isAuditor = roleHint === ROLES.GODOWN_AUDITOR ||
      cleanEmail === 'checker@thulir.com' ||
      cleanEmail.includes('checker') ||
      cleanEmail.includes('godown');

    let newUser;
    if (isAuditor) {
      newUser = {
        id: 'usr-thulir-checker',
        name: cleanEmail.includes('annapoorna') ? 'Annapoorna Godown Auditor' : 'Thulir Godown Stock Auditor',
        email: cleanEmail || 'checker@thulir.com',
        agencyId: 'thulir',
        role: ROLES.GODOWN_AUDITOR,
        avatar: '📦',
        badge: 'Godown Staff / Blind Auditor'
      };
    } else {
      const isThulir = !cleanEmail || cleanEmail.includes('thulir') || cleanEmail === 'admin@thulir.com';
      newUser = {
        id: isThulir ? 'usr-thulir-01' : 'usr-01',
        name: isThulir ? 'Thulir Operations Manager' : (cleanEmail.includes('annapoorna') ? 'A. Somasundaram' : 'M. S. Murugesan'),
        email: cleanEmail || 'admin@thulir.com',
        agencyId: isThulir ? 'thulir' : 'custom',
        role: ROLES.ADMIN,
        avatar: isThulir ? '🏢' : '👨‍💼',
        badge: 'Owner / Admin'
      };
    }

    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const isAuditor = user?.role === ROLES.GODOWN_AUDITOR;
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAuditor,
      isAdmin,
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
