import { createContext, Dispatch, useContext } from 'react';
import { useImmerReducer } from 'use-immer';

export type QueryInfo = {
  where: string;
  table: string;
};
type FilterState = Record<string, QueryInfo>;
type FilterKeys = 'purpose' | 'date' | 'speciesLength';
type Action =
  | {
      type: 'UPDATE_TABLE';
      filterKey: FilterKeys;
      value: QueryInfo;
    }
  | {
      type: 'CLEAR_TABLE';
      filterKey: FilterKeys;
    }
  | {
      type: 'CLEAR_FILTER';
    };

const FilterContext = createContext<{ filter: FilterState; filterDispatch: Dispatch<Action> } | null>(null);

const initialState: FilterState = {};

function reducer(draft: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'UPDATE_TABLE':
      draft[action.filterKey] = action.value;

      console.log('updated filter:', JSON.stringify(draft, null, 2));

      return draft;

    case 'CLEAR_TABLE':
      delete draft[action.filterKey];

      console.log('updated filter:', JSON.stringify(draft, null, 2));

      return draft;

    case 'CLEAR_FILTER':
      return initialState;
  }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, filterDispatch] = useImmerReducer(reducer, initialState);

  return <FilterContext.Provider value={{ filter, filterDispatch }}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }

  return context;
}
