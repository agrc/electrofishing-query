import { useQuery } from '@tanstack/react-query';
import { Button, Spinner, Tab, TabList, TabPanel, Tabs, useFirebaseAuth } from '@ugrc/utah-design-system';
import { User } from 'firebase/auth';
import ky from 'ky';
import { useEffect, useState } from 'react';
import { Selection, TableBody } from 'react-aria-components';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import { useSelection } from './contexts/SelectionProvider';
import Download from './Download';
import { getGridQuery, removeIrrelevantWhiteSpace } from './queryHelpers';
import { Cell, Column, Row, Table, TableHeader } from './Table';
import { getEventIdsForDownload, getResultOidsFromStationIds, getStationIdsFromResultRows } from './utils';

export type Result = Record<string, string | number | null>;
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
    id: feature.attributes[config.fieldNames.ESRI_OID],
  }));
}

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
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  useEffect(() => {
    setSelectedKeys(getResultOidsFromStationIds(data, selectedStationIds));
  }, [data, selectedStationIds]);

  if (isPending) {
    return (
      <div className="flex h-full justify-center align-middle">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  const eventIdsForDownload = getEventIdsForDownload(data, selectedKeys);

  const onSelectionChange = (selectedOids: Selection) => {
    if (selectedOids === 'all') {
      setSelectedStationIds(new Set(data?.map((row) => row[config.fieldNames.STATION_ID] as string)));
    } else {
      setSelectedStationIds(getStationIdsFromResultRows(data, selectedOids as Set<string>));
    }
  };

  return (
    <>
      <span className="absolute right-12 top-2 z-10 self-center">
        Records: <strong>{data?.length}</strong>
        {selectedStationIds.size > 0 && (
          <span>
            {' '}
            | Selected: <strong>{selectedKeys === 'all' ? data?.length : selectedKeys.size}</strong>
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
      <Tabs aria-label="results panel" className="mt-1">
        <TabList>
          <Tab id="grid">Results</Tab>
          <Tab id="download">Download</Tab>
        </TabList>
        <TabPanel id="grid" className="p-0">
          <Table
            aria-label="query results"
            className="-z-10 w-full border-t dark:border-t-zinc-300"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          >
            <TableHeader>
              <Column id={config.fieldNames.EVENT_DATE} minWidth={120}>
                Event Date
              </Column>
              <Column id={config.fieldNames.OBSERVERS} minWidth={120}>
                Observers
              </Column>
              <Column id={`${config.fieldNames.WaterName}_Stream`} minWidth={170}>
                Stream
              </Column>
              <Column id={`${config.fieldNames.DWR_WaterID}_Stream`} minWidth={120}>
                Stream ID
              </Column>
              <Column id={`${config.fieldNames.ReachCode}_Stream`} minWidth={200}>
                Stream Reach Code
              </Column>
              <Column id={`${config.fieldNames.WaterName}_Lake`} minWidth={150}>
                Lake
              </Column>
              <Column id={`${config.fieldNames.DWR_WaterID}_Lake`} minWidth={120}>
                Lake ID
              </Column>
              <Column id={`${config.fieldNames.ReachCode}_Lake`} minWidth={200}>
                Lake Reach Code
              </Column>
              <Column id={config.fieldNames.STATION_NAME} minWidth={180}>
                Station Name
              </Column>
              <Column id={config.fieldNames.SPECIES} minWidth={180}>
                Species Codes
              </Column>
              <Column id={config.fieldNames.TYPES} minWidth={150}>
                Equipment
              </Column>
              <Column id={config.fieldNames.SUBMITTER} minWidth={180}>
                Submitter
              </Column>
              <Column id={config.fieldNames.EVENT_ID} isRowHeader minWidth={350}>
                Event ID
              </Column>
            </TableHeader>
            <TableBody items={data}>
              {(row) => (
                <Row>
                  <Cell>{new Date(row[config.fieldNames.EVENT_DATE] as number).toLocaleDateString()}</Cell>
                  <Cell>{row[config.fieldNames.OBSERVERS]}</Cell>
                  <Cell>{row[`${config.fieldNames.WaterName}_Stream`]}</Cell>
                  <Cell>{row[`${config.fieldNames.DWR_WaterID}_Stream`]}</Cell>
                  <Cell>{row[`${config.fieldNames.ReachCode}_Stream`]}</Cell>
                  <Cell>{row[`${config.fieldNames.WaterName}_Lake`]}</Cell>
                  <Cell>{row[`${config.fieldNames.DWR_WaterID}_Lake`]}</Cell>
                  <Cell>{row[`${config.fieldNames.ReachCode}_Lake`]}</Cell>
                  <Cell>{row[config.fieldNames.STATION_NAME]}</Cell>
                  <Cell>{row[config.fieldNames.SPECIES]}</Cell>
                  <Cell>{row[config.fieldNames.TYPES]}</Cell>
                  <Cell>{row[config.fieldNames.SUBMITTER]}</Cell>
                  <Cell>{row[config.fieldNames.EVENT_ID]}</Cell>
                </Row>
              )}
            </TableBody>
          </Table>
        </TabPanel>
        <TabPanel id="download">
          <Download eventIds={eventIdsForDownload} />
        </TabPanel>
      </Tabs>
    </>
  );
}
