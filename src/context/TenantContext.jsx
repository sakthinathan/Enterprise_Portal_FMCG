import React, { createContext, useContext, useState, useEffect } from 'react';
import { fmcgDb } from '../lib/fmcgDb';

const TenantContext = createContext();

export function TenantProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [activeAgency, setActiveAgencyState] = useState(() => fmcgDb.getActiveAgency());
  const [allAgencies, setAllAgencies] = useState(() => fmcgDb.getAllAgencies());

  const refreshData = () => {
    setDataVersion(v => v + 1);
    setActiveAgencyState(fmcgDb.getActiveAgency());
    setAllAgencies(fmcgDb.getAllAgencies());
  };

  const switchAgency = (agencyId) => {
    const updated = fmcgDb.setActiveAgency(agencyId);
    setActiveAgencyState(updated);
    setDataVersion(v => v + 1);
  };

  const registerAgency = (agencyData) => {
    const created = fmcgDb.registerAgency(agencyData);
    refreshData();
    return created;
  };

  const updateActiveAgency = (updates) => {
    const updated = fmcgDb.updateAgency(activeAgency.id, updates);
    refreshData();
    return updated;
  };

  return (
    <TenantContext.Provider value={{
      activeAgency,
      allAgencies,
      switchAgency,
      registerAgency,
      updateActiveAgency,
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
