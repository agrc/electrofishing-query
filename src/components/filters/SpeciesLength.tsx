import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import { Button, Select, SelectItem, Spinner, TextField } from '@ugrc/utah-design-system';
import { useEffect, useState } from 'react';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';
import { getIsInvalidRange, getQuery, isPositiveWholeNumber, useDomainValues } from './utilities';

export type SpeciesLengthRow = {
  species: string;
  min: string;
  max: string;
};

interface RowControlsProps extends SpeciesLengthRow {
  onChange: (newValue: SpeciesLengthRow) => void;
  addRow: () => void;
  removeRow: () => void;
  isLast?: boolean;
}

function RowControls({ species, min, max, onChange, addRow, removeRow, isLast }: RowControlsProps) {
  const isInvalidRange = getIsInvalidRange(min, max);
  const { data, isPending, error } = useDomainValues(config.urls.fish, config.fieldNames.SPECIES_CODE);

  if (error) {
    return (
      <div className="text-sm text-rose-600 forced-colors:text-[Mark]">
        There was an error retrieving the species values
      </div>
    );
  }

  const iconClasses = 'w-5 text-zinc-700 dark:text-zinc-50';
  const buttonClasses = 'p-0 mb-1';

  return (
    <>
      <div className="flex w-full items-end gap-1">
        {isPending ? (
          <div className="mb-1 size-6">
            <Spinner />
          </div>
        ) : (
          <Select
            className="min-w-28"
            label="Species"
            onSelectionChange={(newValue) => onChange({ species: newValue as string, min, max })}
            placeholder=" "
            selectedKey={species}
          >
            {data?.map(({ name, code }) => (
              <SelectItem key={code} id={code}>
                {name}
              </SelectItem>
            ))}
          </Select>
        )}
        <TextField
          label="Min"
          className="min-w-0 flex-1"
          value={min}
          type="number"
          isInvalid={(min.length && !isPositiveWholeNumber(min)) || isInvalidRange}
          onChange={(newValue: string) => onChange({ species, min: newValue, max })}
        />
        <TextField
          label="Max"
          className="min-w-0 flex-1"
          value={max}
          type="number"
          isInvalid={(max.length && !isPositiveWholeNumber(max)) || isInvalidRange}
          onChange={(newValue: string) => onChange({ species, min, max: newValue })}
        />
        {isLast ? (
          <Button aria-label="add new filter" variant="icon" onPress={addRow} className={buttonClasses}>
            <PlusCircleIcon className={iconClasses} />
          </Button>
        ) : (
          <Button aria-label="remove this filter" variant="icon" onPress={removeRow} className={buttonClasses}>
            <MinusCircleIcon className={iconClasses} />
          </Button>
        )}
      </div>
      {isInvalidRange && <p className="text-sm text-red-500">&quot;Min&quot; must be less than &quot;Max&quot;</p>}
    </>
  );
}

const filterKey = 'speciesLength';
const emptyRow: SpeciesLengthRow = {
  species: '',
  min: '',
  max: '',
};
function isEmpty(row: SpeciesLengthRow) {
  return row.species === '' && row.min === '' && row.max === '';
}

export default function SpeciesLength() {
  const [rows, setRows] = useState<SpeciesLengthRow[]>([emptyRow]);
  const { filterDispatch } = useFilter();

  const onRowChange = (i: number, value: SpeciesLengthRow) => {
    const newRows = [...rows];
    newRows[i] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, emptyRow]);
  };

  const removeRow = (i: number) => {
    const newRows = [...rows];
    newRows.splice(i, 1);
    setRows(newRows);
  };

  useEffect(() => {
    if (rows.length === 1 && isEmpty(rows[0]!)) {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey });
    } else {
      const newQuery = rows
        .map(getQuery)
        .filter((row) => row)
        .join(' OR ');

      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey,
        value: {
          where: newQuery,
          table: config.tableNames.fish,
        },
      });
    }
  }, [rows, filterDispatch]);

  return (
    <>
      <h3 className="text-lg font-semibold">Species and Length (mm)</h3>
      <div className="relative flex flex-col gap-2">
        {rows.map((row: SpeciesLengthRow, i) => (
          <RowControls
            key={i}
            {...row}
            onChange={(newValue: SpeciesLengthRow) => onRowChange(i, newValue)}
            addRow={addRow}
            removeRow={() => removeRow(i)}
            isLast={i === rows.length - 1}
          />
        ))}
        <div className="w-30 flex justify-end">
          <Button
            aria-label="clear all species and length filters"
            variant="secondary"
            onPress={() => setRows([emptyRow])}
          >
            Clear
          </Button>
        </div>
      </div>
    </>
  );
}
