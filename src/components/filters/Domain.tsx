import { Button, Checkbox, CheckboxGroup, Spinner } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import { type FilterKeys, useFilter } from '../contexts/FilterProvider';
import { useDomainValues } from './utilities';

type DomainProps = {
  featureServiceUrl: string;
  fieldName: string;
  filterKey: FilterKeys;
  label: string;
  tableName: string;
};
export default function Domain({ featureServiceUrl, fieldName, filterKey, label, tableName }: DomainProps) {
  const { data, isPending, error } = useDomainValues(featureServiceUrl, fieldName);
  const { filterDispatch } = useFilter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey,
        value: {
          where: `${fieldName} IN ('${selectedValues.join("','")}')`,
          table: tableName,
        },
      });
    } else {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey });
    }
  }, [selectedValues, filterDispatch, filterKey, fieldName, tableName]);

  if (error) {
    return (
      <div className="text-sm text-rose-600 forced-colors:text-[Mark]">
        There was an error retrieving the values for this filter
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">{label}</h3>
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
