import React, { createContext, useContext, useState, useEffect } from 'react';
import { fmcgDb } from '../lib/fmcgDb';

const TenantContext = createContext();

export function TenantProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [activeAgency, setActiveAgencyState] = useState(() => fmcgDb.getActiveAgency());
  const [allAgencies, setAllAgencies] = useState(() => fmcgDb.get().agencies);

  const refreshData = () => {
    setDataVersion(v => v + 1);
    setActiveAgencyState(fmcgDb.getActiveAgency());
    setAllAgencies(fmcgDb.get().agencies);
  };

  const switchAgency = (agencyId) => {
    const updated = fmcgDb.setActiveAgency(agencyId);
    setActiveAgencyState(updated);
    setDataVersion(v => v + 1);
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'fmcg_enterprise_suite_data_v1') {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <TenantContext.Provider value={{
      activeAgency,
      allAgencies,
      switchAgency,
      refreshData,
      dataVersion
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
