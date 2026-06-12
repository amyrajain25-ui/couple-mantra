import { createContext, useContext, useState, ReactNode } from 'react';

export interface CoupleData {
  partner1: string;
  partner2: string;
  since: string; // ISO date string e.g. "2024-07-05"
}

interface CoupleContextType {
  couple: CoupleData | null;
  setCouple: (data: CoupleData) => void;
  clearCouple: () => void;
}

const CoupleContext = createContext<CoupleContextType | null>(null);

const STORAGE_KEY = 'tm_couple_profile';

export function CoupleProvider({ children }: { children: ReactNode }) {
  const [couple, setCoupleState] = useState<CoupleData | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function setCouple(data: CoupleData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCoupleState(data);
  }

  function clearCouple() {
    localStorage.removeItem(STORAGE_KEY);
    setCoupleState(null);
  }

  return (
    <CoupleContext.Provider value={{ couple, setCouple, clearCouple }}>
      {children}
    </CoupleContext.Provider>
  );
}

export function useCouple() {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider');
  return ctx;
}
