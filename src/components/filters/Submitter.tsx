import { TextField } from '@ugrc/utah-design-system';
import debounce from 'lodash.debounce';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';

export default function Submitter() {
  const { filterDispatch } = useFilter();

  const onChange = debounce((value: string) => {
    filterDispatch({
      type: 'UPDATE_TABLE',
      filterKey: 'submitter',
      value: {
        table: config.tableNames.events,
        where: `${config.fieldNames.SUBMITTER} = '${value}'`,
      },
    });
  }, 1250);

  return (
    <>
      <h3 className="text-lg font-semibold">Submitter</h3>
      <TextField label="Email" aria-label="email" onChange={onChange} type="email" />
    </>
  );
}
