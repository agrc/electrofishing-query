import { useQuery } from '@tanstack/react-query';
import { RowSelectionState, Updater } from '@tanstack/react-table';
import { Button, Spinner, Tab, TabList, TabPanel, Tabs, useFirebaseAuth } from '@ugrc/utah-design-system';
import { User } from 'firebase/auth';
import ky from 'ky';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import { useSelection } from './contexts/SelectionProvider';
import Download from './Download';
import { getGridQuery, removeIrrelevantWhiteSpace } from './queryHelpers';
import { Table } from './Table';
import { getEventIdsForDownload, getResultOidsFromStationIds, getStationIdsFromResultRows } from './utils';

export type Result = {
  EVENT_ID: string;
  EVENT_DATE: number;
  OBSERVERS: string;
  WaterName_Lake: string | null;
  DWR_WaterID_Lake: string | null;
  ReachCode_Lake: string | null;
  WaterName_Stream: string | null;
  DWR_WaterID_Stream: string | null;
  ReachCode_Stream: string | null;
  STATION_NAME: string;
  STATION_ID: string;
  SPECIES: string | null;
  TYPES: string | null;
  SUBMITTER: string | null;
  ESRI_OID: number;
};

async function getData(where: string, currentUser: User): Promise<Result[]> {
  if (where === '') {
    return [];
  }

  const query = `
  SELECT DISTINCT
      se.${config.fieldNames.EVENT_ID},
      ${config.fieldNames.EVENT_DATE},
      ${config.fieldNames.OBSERVERS},
      l.${config.fieldNames.WaterName} as ${config.fieldNames.WaterName}_Lake,
      l.${config.fieldNames.DWR_WaterID} as ${config.fieldNames.DWR_WaterID}_Lake,
      l.${config.fieldNames.ReachCode} as ${config.fieldNames.ReachCode}_Lake,
      st.${config.fieldNames.WaterName} as ${config.fieldNames.WaterName}_Stream,
      st.${config.fieldNames.DWR_WaterID} as ${config.fieldNames.DWR_WaterID}_Stream,
      st.${config.fieldNames.ReachCode} as ${config.fieldNames.ReachCode}_Stream,
      s.${config.fieldNames.NAME} as ${config.fieldNames.STATION_NAME},
      s.${config.fieldNames.STATION_ID},
      SPECIES = STUFF((SELECT DISTINCT ', ' + f.${config.fieldNames.SPECIES_CODE}
                       FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.fish} as f
                       WHERE se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}
                       FOR XML PATH ('')),
                       1, 1, ''),
      TYPES = STUFF((SELECT DISTINCT ', ' + eq.TYPE
                     FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.equipment} as eq
                     WHERE se.${config.fieldNames.EVENT_ID} = eq.${config.fieldNames.EVENT_ID}
                     FOR XML PATH ('')),
                     1, 1, ''),
      se.${config.fieldNames.SUBMITTER}
  FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.events} as se

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.fish} as f
  ON se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.equipment} as eq
  ON se.${config.fieldNames.EVENT_ID} = eq.${config.fieldNames.EVENT_ID}

  INNER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.stations} as s
  ON s.${config.fieldNames.STATION_ID} = se.${config.fieldNames.STATION_ID}

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.lakes} as l
  ON l.${config.fieldNames.Permanent_Identifier} = s.${config.fieldNames.WATER_ID}

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.${config.tableNames.streams} as st
  ON st.${config.fieldNames.Permanent_Identifier} = s.${config.fieldNames.WATER_ID}

  WHERE ${where}
`;

  const params = {
    f: 'json',
    layer: JSON.stringify({
      id: 1,
      source: {
        type: 'dataLayer',
        dataSource: {
          type: 'queryTable',
          workspaceId: config.dynamicWorkspaceId,
          query: removeIrrelevantWhiteSpace(query),
          oidFields: config.fieldNames.EVENT_ID,
        },
      },
    }),
    outFields: '*',
    where: '1=1',
    returnGeometry: false,
    orderByFields: `${config.fieldNames.EVENT_DATE} DESC`,
  };

  const url = `${config.urls.featureService}/dynamicLayer/query`;

  type Response = { error?: { message: string }; features: Array<{ attributes: Result }> };
  const urlEncoded = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    urlEncoded.append(key, value as string);
  }
  const responseJson: Response = await ky
    .post(url, {
      body: urlEncoded,
      headers: {
        Authorization: `Bearer ${await currentUser?.getIdToken()}`,
      },
    })
    .json();

  if (responseJson.error) {
    throw new Error(responseJson.error.message);
  }

  return responseJson.features.map((feature) => ({
    ...feature.attributes,
    id: feature.attributes.ESRI_OID,
  }));
}

const columns = [
  {
    accessorKey: config.fieldNames.EVENT_DATE,
    cell: ({ getValue }: { getValue: () => number }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    accessorKey: config.fieldNames.OBSERVERS,
  },
  {
    accessorKey: `${config.fieldNames.WaterName}_Stream`,
  },
  {
    accessorKey: `${config.fieldNames.DWR_WaterID}_Stream`,
  },
  {
    accessorKey: `${config.fieldNames.ReachCode}_Stream`,
  },
  {
    accessorKey: `${config.fieldNames.WaterName}_Lake`,
  },
  {
    accessorKey: `${config.fieldNames.DWR_WaterID}_Lake`,
  },
  {
    accessorKey: `${config.fieldNames.ReachCode}_Lake`,
  },
  {
    accessorKey: config.fieldNames.STATION_NAME,
  },
  {
    accessorKey: config.fieldNames.SPECIES,
  },
  {
    accessorKey: config.fieldNames.TYPES,
  },
  {
    accessorKey: config.fieldNames.SUBMITTER,
  },
  {
    accessorKey: config.fieldNames.EVENT_ID,
  },
  {
    accessorKey: config.fieldNames.STATION_ID,
  },
];

export default function ResultsGrid() {
  const { filter } = useFilter();

  const { currentUser } = useFirebaseAuth();
  const gridQuery = getGridQuery(Object.values(filter));
  console.log('new grid query:', gridQuery);
  const { data, isPending, error } = useQuery({
    queryKey: ['grid', gridQuery],
    queryFn: () => {
      if (currentUser) {
        return getData(gridQuery, currentUser);
      }
    },
  });

  const { selectedStationIds, setSelectedStationIds } = useSelection();

  if (isPending) {
    return (
      <div className="flex h-full justify-center align-middle">
        <Spinner aria-label="loading results grid" />
      </div>
    );
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  const rowSelection = getResultOidsFromStationIds(data, selectedStationIds);
  const eventIdsForDownload = getEventIdsForDownload(data, rowSelection);

  function onRowSelectionChange(updateFn: Updater<RowSelectionState>) {
    const newSelection = typeof updateFn === 'function' ? updateFn({}) : updateFn;

    setSelectedStationIds(getStationIdsFromResultRows(data, new Set(Object.keys(newSelection))));
  }

  return (
    <>
      <span className="absolute right-12 top-2 z-10 self-center">
        Records: <strong>{data?.length}</strong>
        {selectedStationIds.size > 0 && (
          <span>
            {' '}
            | Selected: <strong>{Object.keys(rowSelection).length}</strong>
            <Button
              variant="secondary"
              size="extraSmall"
              onPress={() => setSelectedStationIds(new Set())}
              className="ml-2"
            >
              Clear Selection
            </Button>
          </span>
        )}
      </span>
      <Tabs aria-label="results panel" className="h-full pt-1">
        <TabList>
          <Tab id="grid">Results</Tab>
          <Tab id="download">Download</Tab>
        </TabList>

        <TabPanel id="grid" className="min-h-0 flex-1 p-0">
          {data && (
            <Table
              caption="query results"
              className="h-full w-full"
              columns={columns}
              data={data}
              additionalTableProps={{
                state: {
                  rowSelection,
                },
                getRowId: (row) => (row as Result).ESRI_OID.toString(),
                enableRowSelection: true,
                onRowSelectionChange,
              }}
            />
          )}
        </TabPanel>
        <TabPanel id="download">
          <Download eventIds={eventIdsForDownload} />
        </TabPanel>
      </Tabs>
    </>
  );
}
