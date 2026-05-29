'use client';

import { createContext, useCallback, useContext, useState } from 'react';

// Maps locale → path (without locale prefix), e.g. { en: '/news/en-slug', sv: '/news/sv-slug' }
type LocalizedPaths = Record<string, string>;

interface LocalizedPathContextValue {
  paths: LocalizedPaths;
  setPaths: (p: LocalizedPaths) => void;
  clearPaths: () => void;
}

const LocalizedPathContext = createContext<LocalizedPathContextValue>({
  paths: {},
  setPaths: () => {},
  clearPaths: () => {},
});

export function LocalizedPathProvider({ children }: { children: React.ReactNode }) {
  const [paths, setPaths] = useState<LocalizedPaths>({});
  const clearPaths = useCallback(() => setPaths({}), []);
  return (
    <LocalizedPathContext.Provider value={{ paths, setPaths, clearPaths }}>
      {children}
    </LocalizedPathContext.Provider>
  );
}

export function useLocalizedPaths() {
  return useContext(LocalizedPathContext);
}
