import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ComplaintRecord } from '../types/complaint';
import { checkBackendHealth, fetchComplaintHistory } from '../services/api';
import { INITIAL_DEMO_HISTORY } from '../services/demoData';

interface AppContextType {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  backendStatus: 'checking' | 'online' | 'offline';
  backendVersion?: string;
  loadedModels?: string[];
  refreshBackendStatus: () => Promise<void>;
  complaintHistory: ComplaintRecord[];
  addComplaintRecord: (record: ComplaintRecord) => void;
  clearComplaintHistory: () => void;
  adminKey: string | null;
  setAdminKey: (key: string | null) => void;
  liveDbRecords: ComplaintRecord[];
  isLiveLoading: boolean;
  liveDbError: string | null;
  fetchLiveHistory: (overrideKey?: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_DEMO_HISTORY_KEY = 'smart_complaint_router_demo_history';
const LOCAL_STORAGE_DEMO_MODE_KEY = 'smart_complaint_router_demo_mode';
const SESSION_STORAGE_ADMIN_KEY = 'smart_complaint_router_admin_key';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DEMO_MODE_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendVersion, setBackendVersion] = useState<string | undefined>(undefined);
  const [loadedModels, setLoadedModels] = useState<string[] | undefined>(undefined);

  // Demo mode history stored locally
  const [demoHistory, setDemoHistory] = useState<ComplaintRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DEMO_HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore parse errors
    }
    return INITIAL_DEMO_HISTORY;
  });

  // Admin key stored strictly in sessionStorage (never hardcoded in bundle)
  const [adminKey, setAdminKeyState] = useState<string | null>(() => {
    return sessionStorage.getItem(SESSION_STORAGE_ADMIN_KEY);
  });

  // Live database records
  const [liveDbRecords, setLiveDbRecords] = useState<ComplaintRecord[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [liveDbError, setLiveDbError] = useState<string | null>(null);

  const setAdminKey = (key: string | null) => {
    setAdminKeyState(key);
    if (key) {
      sessionStorage.setItem(SESSION_STORAGE_ADMIN_KEY, key);
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_ADMIN_KEY);
    }
  };

  const refreshBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const res = await checkBackendHealth();
      if (res.status === 'online') {
        setBackendStatus('online');
        setBackendVersion(res.version);
        setLoadedModels(res.models_loaded);
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  const fetchLiveHistory = async (overrideKey?: string): Promise<boolean> => {
    const activeKey = overrideKey !== undefined ? overrideKey : adminKey;
    if (!activeKey) {
      setLiveDbError('Administrator authentication required. Enter your admin key to view persistent database records.');
      return false;
    }

    setIsLiveLoading(true);
    setLiveDbError(null);

    try {
      const records = await fetchComplaintHistory(activeKey);
      setLiveDbRecords(records);
      return true;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to retrieve complaint history from database.';
      setLiveDbError(errorMsg);
      return false;
    } finally {
      setIsLiveLoading(false);
    }
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // When switching to Live mode, if admin key is present, attempt to fetch live history
  useEffect(() => {
    if (!isDemoMode && adminKey) {
      fetchLiveHistory(adminKey);
    }
  }, [isDemoMode, adminKey]);

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    localStorage.setItem(LOCAL_STORAGE_DEMO_MODE_KEY, String(val));
  };

  const addComplaintRecord = (record: ComplaintRecord) => {
    if (isDemoMode) {
      setDemoHistory((prev) => {
        const updated = [record, ...prev];
        try {
          localStorage.setItem(LOCAL_STORAGE_DEMO_HISTORY_KEY, JSON.stringify(updated));
        } catch {
          // ignore storage quota error
        }
        return updated;
      });
    } else {
      // In live mode, add to live records in view
      setLiveDbRecords((prev) => [record, ...prev]);
    }
  };

  const clearComplaintHistory = () => {
    if (isDemoMode) {
      setDemoHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_DEMO_HISTORY_KEY);
    } else {
      // In live mode, clear client view cache
      setLiveDbRecords([]);
    }
  };

  // Complaint history presented to the UI
  const complaintHistory = isDemoMode ? demoHistory : liveDbRecords;

  return (
    <AppContext.Provider
      value={{
        isDemoMode,
        setIsDemoMode,
        backendStatus,
        backendVersion,
        loadedModels,
        refreshBackendStatus,
        complaintHistory,
        addComplaintRecord,
        clearComplaintHistory,
        adminKey,
        setAdminKey,
        liveDbRecords,
        isLiveLoading,
        liveDbError,
        fetchLiveHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
