import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MatchingSettings {
  emailThreshold: number;
  phoneThreshold: number;
  nameThreshold: number;
  useEmail: boolean;
  usePhone: boolean;
  useName: boolean;
}

interface SettingsContextType {
  matchingSettings: MatchingSettings;
  updateMatchingSettings: (settings: Partial<MatchingSettings>) => void;
}

const defaultSettings: MatchingSettings = {
  emailThreshold: 90,
  phoneThreshold: 85,
  nameThreshold: 80,
  useEmail: true,
  usePhone: true,
  useName: false,
};

const SettingsContext = createContext<SettingsContextType>({
  matchingSettings: defaultSettings,
  updateMatchingSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [matchingSettings, setMatchingSettings] = useState<MatchingSettings>(defaultSettings);
  
  const updateMatchingSettings = (settings: Partial<MatchingSettings>) => {
    setMatchingSettings(prev => ({
      ...prev,
      ...settings,
    }));
  };
  
  return (
    <SettingsContext.Provider value={{
      matchingSettings,
      updateMatchingSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};