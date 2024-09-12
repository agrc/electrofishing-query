import Graphic from '@arcgis/core/Graphic';
import { Button, featureServiceProvider, multiProvider, Sherlock, Tag, TagGroup } from '@ugrc/utah-design-system';
import { useEffect } from 'react';
import { useListData } from 'react-stately';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';

const streamsProvider = featureServiceProvider(
  config.urls.streams,
  config.fieldNames.WaterName,
  // @ts-ignore
  config.fieldNames.COUNTY,
);
const lakesProvider = featureServiceProvider(
  config.urls.lakes,
  config.fieldNames.WaterName,
  // @ts-ignore
  config.fieldNames.COUNTY,
);
const provider = multiProvider([streamsProvider, lakesProvider]);
const filterKey = 'location';

export default function Location(): JSX.Element {
  const list = useListData<Graphic>({
    initialItems: [],
    getKey: (item) => item.attributes[config.fieldNames.DWR_WaterID],
  });
  const { filterDispatch } = useFilter();

  const onSherlockMatch = (matches: Graphic[]) => {
    list.append(...matches);
  };

  useEffect(() => {
    if (list.items.length > 0) {
      const queries = list.items.map(({ attributes }) => {
        return (
          `${config.fieldNames.WaterName} = '${attributes[config.fieldNames.WaterName]}'` +
          ` AND ${config.fieldNames.COUNTY} = '${attributes[config.fieldNames.COUNTY]}'`
        );
      });

      const tableNameToken = '<tableName>';
      const tableWhere = `(${queries.join(') OR (')})`;
      const joinWhere =
        `${config.fieldNames.WATER_ID} IN (SELECT ${config.fieldNames.Permanent_Identifier}` +
        ` FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${tableNameToken} WHERE ${tableWhere})`;
      const where =
        `${joinWhere.replace(tableNameToken, config.tableNames.streams)}` +
        ` OR ${joinWhere.replace(tableNameToken, config.tableNames.lakes)}`;

      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey,
        value: {
          table: config.tableNames.stations,
          where,
        },
      });
    } else {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey });
    }
  }, [filterDispatch, list.items]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Location</h3>
      <Sherlock provider={provider} label="Search for a stream or lake" onSherlockMatch={onSherlockMatch} />
      <div className="mt-2 flex flex-wrap gap-1">
        <TagGroup
          label="Search for a stream or lake"
          onRemove={(keys: string[]) => list.remove(...keys)}
          items={list.items}
          selectionMode="multiple"
        >
          {(graphic: Graphic) => {
            const attributes = graphic.attributes;
            const name = `${attributes[config.fieldNames.WaterName]} (${attributes[config.fieldNames.COUNTY]})`;

            return <Tag>{name}</Tag>;
          }}
        </TagGroup>
      </div>
      <div className="w-30 flex justify-end">
        <Button aria-label="clear all species and length filters" variant="secondary" onPress={() => setSelected([])}>
          Clear
        </Button>
      </div>
    </div>
  );
}
