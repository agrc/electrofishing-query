import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterProvider } from '../contexts/FilterProvider';
import SpeciesLength from './SpeciesLength';

export default {
  title: 'SpeciesLength',
  component: SpeciesLength,
};

export const Default = () => (
  <div className="w-[304px] rounded border p-3">
    <QueryClientProvider client={new QueryClient()}>
      <FilterProvider>
        <SpeciesLength />
      </FilterProvider>
    </QueryClientProvider>
  </div>
);
