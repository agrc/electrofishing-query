import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterProvider } from '../contexts/FilterProvider';
import Location from './Location';

export default {
  title: 'Location',
  component: Location,
};

export const Default = () => (
  <div className="w-[304px] rounded border p-3">
    <QueryClientProvider client={new QueryClient()}>
      <FilterProvider>
        <Location />
      </FilterProvider>
    </QueryClientProvider>
  </div>
);
