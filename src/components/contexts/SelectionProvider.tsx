import { createContext, useContext, useState } from 'react';

type SelectionContextType = {
  selectedStationIds: Set<string>;
  setSelectedStationIds: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const SelectionContext = createContext<SelectionContextType>({
  selectedStationIds: new Set(),
  setSelectedStationIds: () => {},
});

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedStationIds, setSelectedStationIds] = useState<Set<string>>(new Set());

  return (
    <SelectionContext.Provider value={{ selectedStationIds, setSelectedStationIds }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  console.log('useSelection');
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }

  return context;
}
