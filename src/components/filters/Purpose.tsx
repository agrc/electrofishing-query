import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, CheckboxGroup } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';
import { getDomainValues } from './utilities';

async function getPurposes() {
  return await getDomainValues(config.urls.events, config.fieldNames.SURVEY_PURPOSE);
}

export default function Purpose(): JSX.Element {
  const purposesDomain = useQuery({ queryKey: ['purposes'], queryFn: getPurposes });
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

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">Purpose</h3>
        <CheckboxGroup onChange={setSelectedValues} value={selectedValues}>
          {purposesDomain.data?.map(({ name, code }) => (
            <div key={code} className="flex gap-1">
              <Checkbox id={code} name={code} value={code} />
              <label htmlFor={code}>{name}</label>
            </div>
          ))}
        </CheckboxGroup>
      </div>
      <div className="w-30 flex justify-end">
        <Button variant="secondary" onPress={() => setSelectedValues([])}>
          Clear
        </Button>
      </div>
    </>
  );
}
