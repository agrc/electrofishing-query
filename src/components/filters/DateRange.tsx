import { Button, TextField } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';

const fieldName = config.fieldNames.EVENT_DATE;
const emptyState = { from: '', to: '' };
const filterKey = 'date';

export default function DateRange() {
  const [dates, setDates] = useState(emptyState);
  const { filterDispatch } = useFilter();

  const onChange = (newDate: string, key: 'from' | 'to') => {
    setDates((prev) => ({ ...prev, [key]: newDate }));
  };

  const from = Date.parse(dates.from);
  const to = Date.parse(dates.to);

  const isInvalid = from > to;

  useEffect(() => {
    if (!dates.from || !dates.to || isInvalid) {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey });
    } else {
      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey,
        value: {
          where: `${fieldName} >= '${dates.from}' AND ${fieldName} <= '${dates.to}'`,
          table: config.tableNames.events,
        },
      });
    }
  }, [dates, isInvalid, filterDispatch]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Date Range</h3>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <TextField
            label="From"
            className="min-w-0 flex-grow"
            type="date"
            value={dates.from}
            onChange={(newDate: string) => onChange(newDate, 'from')}
            isInvalid={isInvalid}
          />
          <TextField
            label="To"
            className="min-w-0 flex-grow"
            type="date"
            value={dates.to}
            onChange={(newDate: string) => onChange(newDate, 'to')}
            isInvalid={isInvalid}
          />
        </div>
        {isInvalid && <p className="text-sm text-red-500">"From" must be before "To"</p>}
        <div className="w-30 flex justify-end">
          <Button variant="secondary" onPress={() => setDates(emptyState)}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
