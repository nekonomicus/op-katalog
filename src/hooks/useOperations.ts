import { useState, useEffect, useCallback } from 'react';
import type { Operation, OperationFormData } from '../types/Operation';

const STORAGE_KEY = 'op-logger-operations';
const API_URL = import.meta.env.VITE_API_URL || '';
const USER_ID = 'default'; // Could be extended for multi-user support

interface SyncStatus {
  mode: 'local' | 'cloud' | 'syncing' | 'error';
  lastSync: string | null;
  error: string | null;
}

export function useOperations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    mode: API_URL ? 'syncing' : 'local',
    lastSync: null,
    error: null,
  });

  // Fetch from API
  const fetchFromAPI = useCallback(async () => {
    if (!API_URL) return null;
    
    try {
      const response = await fetch(`${API_URL}/api/operations?user_id=${USER_ID}`);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      return data as Operation[];
    } catch (e) {
      console.error('API fetch failed:', e);
      return null;
    }
  }, []);

  // Load operations on mount
  useEffect(() => {
    const loadOperations = async () => {
      // Try API first if available
      if (API_URL) {
        setSyncStatus(prev => ({ ...prev, mode: 'syncing' }));
        const apiData = await fetchFromAPI();
        
        if (apiData !== null) {
          setOperations(apiData);
          // Also update localStorage as backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
          setSyncStatus({
            mode: 'cloud',
            lastSync: new Date().toISOString(),
            error: null,
          });
          setIsLoaded(true);
          return;
        } else {
          setSyncStatus(prev => ({ 
            ...prev, 
            mode: 'error', 
            error: 'Could not connect to cloud. Using local data.' 
          }));
        }
      }
      
      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOperations(parsed);
        } catch (e) {
          console.error('Failed to parse stored operations:', e);
        }
      }
      
      if (!API_URL) {
        setSyncStatus({ mode: 'local', lastSync: null, error: null });
      }
      setIsLoaded(true);
    };

    loadOperations();
  }, [fetchFromAPI]);

  // Save to localStorage whenever operations change (always as backup)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    }
  }, [operations, isLoaded]);

  // API helper for creating operation
  const createOnAPI = async (formData: OperationFormData): Promise<number | null> => {
    if (!API_URL) return null;
    
    try {
      const response = await fetch(`${API_URL}/api/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: USER_ID }),
      });
      if (!response.ok) throw new Error('Create failed');
      const result = await response.json();
      return result.id;
    } catch (e) {
      console.error('API create failed:', e);
      return null;
    }
  };

  // API helper for updating operation
  const updateOnAPI = async (id: number, formData: Partial<OperationFormData>): Promise<boolean> => {
    if (!API_URL) return false;
    
    try {
      const response = await fetch(`${API_URL}/api/operations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: USER_ID }),
      });
      return response.ok;
    } catch (e) {
      console.error('API update failed:', e);
      return false;
    }
  };

  // API helper for deleting operation
  const deleteOnAPI = async (id: number): Promise<boolean> => {
    if (!API_URL) return false;
    
    try {
      const response = await fetch(`${API_URL}/api/operations/${id}?user_id=${USER_ID}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (e) {
      console.error('API delete failed:', e);
      return false;
    }
  };

  const getNextId = useCallback(() => {
    if (operations.length === 0) return 1;
    return Math.max(...operations.map(op => op.id)) + 1;
  }, [operations]);

  const addOperation = useCallback(async (formData: OperationFormData): Promise<Operation> => {
    const now = new Date().toISOString();
    
    // Try API first
    const apiId = await createOnAPI(formData);
    
    const newOp: Operation = {
      id: apiId ?? getNextId(),
      createdAt: now,
      updatedAt: now,
      ...formData,
    };
    
    setOperations(prev => [...prev, newOp]);
    
    if (apiId) {
      setSyncStatus(prev => ({ ...prev, lastSync: now }));
    }
    
    return newOp;
  }, [getNextId]);

  const updateOperation = useCallback(async (id: number, formData: Partial<OperationFormData>) => {
    // Try API
    await updateOnAPI(id, formData);
    
    setOperations(prev => prev.map(op => {
      if (op.id === id) {
        return {
          ...op,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
      }
      return op;
    }));
  }, []);

  const deleteOperation = useCallback(async (id: number) => {
    // Try API
    await deleteOnAPI(id);
    
    setOperations(prev => prev.filter(op => op.id !== id));
  }, []);

  const getOperation = useCallback((id: number): Operation | undefined => {
    return operations.find(op => op.id === id);
  }, [operations]);

  const importOperations = useCallback(async (imported: Operation[]) => {
    // If API available, bulk import
    if (API_URL) {
      try {
        const response = await fetch(`${API_URL}/api/operations/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: USER_ID, operations: imported }),
        });
        if (response.ok) {
          // Refresh from API
          const apiData = await fetchFromAPI();
          if (apiData) {
            setOperations(apiData);
            return;
          }
        }
      } catch (e) {
        console.error('Bulk import failed:', e);
      }
    }
    
    // Fallback: merge locally
    setOperations(prev => {
      const existingIds = new Set(prev.map(op => op.id));
      const newOps = imported.filter(op => !existingIds.has(op.id));
      return [...prev, ...newOps];
    });
  }, [fetchFromAPI]);

  const exportOperations = useCallback(() => {
    return JSON.stringify(operations, null, 2);
  }, [operations]);

  const clearAllOperations = useCallback(async () => {
    // Try API
    if (API_URL) {
      try {
        await fetch(`${API_URL}/api/operations/clear?user_id=${USER_ID}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.error('API clear failed:', e);
      }
    }
    
    setOperations([]);
  }, []);

  // Migrate localStorage to cloud
  const migrateToCloud = useCallback(async () => {
    if (!API_URL || operations.length === 0) return false;
    
    try {
      const response = await fetch(`${API_URL}/api/operations/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, operations }),
      });
      
      if (response.ok) {
        const apiData = await fetchFromAPI();
        if (apiData) {
          setOperations(apiData);
          setSyncStatus({
            mode: 'cloud',
            lastSync: new Date().toISOString(),
            error: null,
          });
          return true;
        }
      }
    } catch (e) {
      console.error('Migration failed:', e);
    }
    return false;
  }, [operations, fetchFromAPI]);

  return {
    operations,
    isLoaded,
    syncStatus,
    addOperation,
    updateOperation,
    deleteOperation,
    getOperation,
    importOperations,
    exportOperations,
    clearAllOperations,
    migrateToCloud,
  };
}
