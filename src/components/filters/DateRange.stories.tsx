import { FilterProvider } from '../contexts/FilterProvider';
import DateRange from './DateRange';

export default {
  title: 'DateRange',
  component: DateRange,
};

export const Default = () => (
  <div className="w-[304px] rounded border p-3">
    <FilterProvider>
      <DateRange />
    </FilterProvider>
  </div>
);
