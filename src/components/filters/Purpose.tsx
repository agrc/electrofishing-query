import { Button, Checkbox, CheckboxGroup, Spinner } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';
import { useDomainValues } from './utilities';

export default function Purpose(): JSX.Element {
  const { data, isPending, error } = useDomainValues(config.urls.events, config.fieldNames.SURVEY_PURPOSE);
  const { filterDispatch } = useFilter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey: 'purpose',
        value: {
          where: `${config.fieldNames.SURVEY_PURPOSE} IN ('${selectedValues.join("','")}')`,
          table: config.tableNames.events,
        },
      });
    } else {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey: 'purpose' });
    }
  }, [selectedValues, filterDispatch]);

  if (error) {
    return (
      <div className="text-sm text-rose-600 forced-colors:text-[Mark]">
        There was an error retrieving the purpose values
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">Purpose</h3>
        {isPending ? (
          <Spinner />
        ) : (
          <CheckboxGroup onChange={setSelectedValues} value={selectedValues}>
            {data?.map(({ name, code }) => (
              <div key={code} className="flex gap-1">
                <Checkbox id={code} name={code} value={code} />
                <label htmlFor={code}>{name}</label>
              </div>
            ))}
          </CheckboxGroup>
        )}
      </div>
      <div className="w-30 flex justify-end">
        <Button variant="secondary" onPress={() => setSelectedValues([])}>
          Clear
        </Button>
      </div>
    </>
  );
}
