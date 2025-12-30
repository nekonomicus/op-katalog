import { useState, useEffect, useCallback } from 'react';
import type { Operation, OperationFormData } from '../types/Operation';

const STORAGE_KEY = 'op-logger-operations';

export function useOperations() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOperations(parsed);
      } catch (e) {
        console.error('Failed to parse stored operations:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever operations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    }
  }, [operations, isLoaded]);

  const getNextId = useCallback(() => {
    if (operations.length === 0) return 1;
    return Math.max(...operations.map(op => op.id)) + 1;
  }, [operations]);

  const addOperation = useCallback((formData: OperationFormData): Operation => {
    const now = new Date().toISOString();
    const newOp: Operation = {
      id: getNextId(),
      createdAt: now,
      updatedAt: now,
      ...formData,
    };
    setOperations(prev => [...prev, newOp]);
    return newOp;
  }, [getNextId]);

  const updateOperation = useCallback((id: number, formData: Partial<OperationFormData>) => {
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

  const deleteOperation = useCallback((id: number) => {
    setOperations(prev => prev.filter(op => op.id !== id));
  }, []);

  const getOperation = useCallback((id: number): Operation | undefined => {
    return operations.find(op => op.id === id);
  }, [operations]);

  const importOperations = useCallback((imported: Operation[]) => {
    setOperations(prev => {
      const existingIds = new Set(prev.map(op => op.id));
      const newOps = imported.filter(op => !existingIds.has(op.id));
      return [...prev, ...newOps];
    });
  }, []);

  const exportOperations = useCallback(() => {
    return JSON.stringify(operations, null, 2);
  }, [operations]);

  const clearAllOperations = useCallback(() => {
    if (confirm('Are you sure you want to delete ALL operations? This cannot be undone.')) {
      setOperations([]);
    }
  }, []);

  return {
    operations,
    isLoaded,
    addOperation,
    updateOperation,
    deleteOperation,
    getOperation,
    importOperations,
    exportOperations,
    clearAllOperations,
  };
}

