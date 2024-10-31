import { useQuery } from '@tanstack/react-query';
import { useFirebaseAuth } from '@ugrc/utah-design-system';
import { User } from 'firebase/auth';
import ky from 'ky';
import { TableBody } from 'react-aria-components';
import config from '../config';
import { useFilter } from './contexts/FilterProvider';
import { getGridQuery, removeIrrelevantWhiteSpace } from './queryHelpers';
import { Cell, Column, Row, Table, TableHeader } from './Table';

const STATION_NAME = 'STATION_NAME';
type Result = Record<string, string | number | null>;
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
      s.${config.fieldNames.NAME} as ${STATION_NAME},
      SPECIES = STUFF((SELECT DISTINCT ', ' + f.${config.fieldNames.SPECIES_CODE}
                       FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.Fish_evw as f
                       WHERE se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}
                       FOR XML PATH ('')),
                       1, 1, ''),
      TYPES = STUFF((SELECT DISTINCT ', ' + eq.TYPE
                     FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.Equipment_evw as eq
                     WHERE se.${config.fieldNames.EVENT_ID} = eq.${config.fieldNames.EVENT_ID}
                     FOR XML PATH ('')),
                     1, 1, '')
  FROM ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.SamplingEvents_evw as se

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.Fish_evw as f
  ON se.${config.fieldNames.EVENT_ID} = f.${config.fieldNames.EVENT_ID}

  INNER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.Stations_evw as s
  ON s.${config.fieldNames.STATION_ID} = se.${config.fieldNames.STATION_ID}

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.UDWRLakes_evw as l
  ON l.${config.fieldNames.Permanent_Identifier} = s.${config.fieldNames.WATER_ID}

  LEFT OUTER JOIN ${config.databaseSecrets.databaseName}.${config.databaseSecrets.user}.UDWRStreams_evw as st
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

export default function ResultsGrid() {
  const { filter } = useFilter();

  const { currentUser } = useFirebaseAuth();
  const gridQuery = getGridQuery(Object.values(filter));
  const { data, isPending, error } = useQuery({
    queryKey: ['grid', gridQuery],
    queryFn: () => {
      if (currentUser) {
        return getData(gridQuery, currentUser);
      }
    },
  });

  if (isPending) {
    return <span>loading...</span>;
  }
  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <>
      <div className="px-2 py-2">Results: {data?.length}</div>
      <Table aria-label="query results" className="-z-10 h-full w-full border-t dark:border-t-zinc-300">
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
          <Column id={STATION_NAME} minWidth={180}>
            Station Name
          </Column>
          <Column id={config.fieldNames.SPECIES} minWidth={180}>
            Species Codes
          </Column>
          <Column id={config.fieldNames.TYPES} minWidth={150}>
            Equipment
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
              <Cell>{row[STATION_NAME]}</Cell>
              <Cell>{row[config.fieldNames.SPECIES]}</Cell>
              <Cell>{row[config.fieldNames.TYPES]}</Cell>
              <Cell>{row[config.fieldNames.EVENT_ID]}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </>
  );
}
