import Graphic from '@arcgis/core/Graphic';
import {
  Button,
  featureServiceProvider,
  multiProvider,
  Sherlock,
  Tag,
  TagGroup,
  useFirebaseAuth,
} from '@ugrc/utah-design-system';
import { useEffect } from 'react';
import { useListData } from 'react-stately';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';

const filterKey = 'location';
function getKey(graphic: Graphic): string {
  return graphic.attributes[config.fieldNames.DWR_WaterID];
}

export default function Location(): JSX.Element {
  const { currentUser } = useFirebaseAuth();
  const kyOptions = {
    hooks: {
      beforeRequest: [
        async (request: Request) => {
          console.log('interceptor ky options triggered');
          request.headers.set('Authorization', `Bearer ${await currentUser?.getIdToken()}`);
        },
      ],
    },
  };
  const streamsProvider = featureServiceProvider(
    config.urls.streams,
    config.fieldNames.WaterName,
    // @ts-expect-error - need to update the type for featureServiceProvider
    config.fieldNames.COUNTY,
    kyOptions,
  );
  const lakesProvider = featureServiceProvider(
    config.urls.lakes,
    config.fieldNames.WaterName,
    // @ts-expect-error - need to update the type for featureServiceProvider
    config.fieldNames.COUNTY,
    kyOptions,
  );
  const provider = multiProvider([streamsProvider, lakesProvider]);

  const list = useListData<Graphic>({
    initialItems: [],
    getKey,
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
          aria-label="selected streams or lakes"
          onRemove={(keys) => list.remove(...keys)}
          items={list.items}
          selectionMode="multiple"
          className="mb-4"
        >
          {(graphic: Graphic) => {
            const attributes = graphic.attributes;
            const name = `${attributes[config.fieldNames.WaterName]} (${attributes[config.fieldNames.COUNTY]})`;

            return <Tag id={getKey(graphic)}>{name}</Tag>;
          }}
        </TagGroup>
      </div>
      <div className="w-30 flex justify-end">
        <Button
          aria-label="clear all species and length filters"
          variant="secondary"
          onPress={() => {
            // todo: clear sherlock input value once this enhancement is implemented: https://github.com/agrc/kitchen-sink/issues/340
            list.remove(...list.items.map((item) => getKey(item)));
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
