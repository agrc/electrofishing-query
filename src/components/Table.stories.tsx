import { useState } from 'react';
import { Selection, TableBody } from 'react-aria-components';
import results from '../../tests/results.json';
import config from '../config';
import { Cell, Column, Row, Table, TableHeader } from './Table';

export default {
  title: 'Table',
  component: Table,
};

const data = results.features.map((feature) => ({
  ...feature.attributes,
  // @ts-expect-error don't care because this is test data
  id: feature.attributes[config.fieldNames.ESRI_OID],
}));

export const Default = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <Table
      aria-label="query results"
      className="-z-10 w-full border-t dark:border-t-zinc-300"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
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
        <Column id={'STATION_NAME'} minWidth={180}>
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
            <Cell>{row['STATION_NAME']}</Cell>
            <Cell>{row[config.fieldNames.SPECIES]}</Cell>
            <Cell>{row[config.fieldNames.TYPES]}</Cell>
            <Cell>{row[config.fieldNames.EVENT_ID]}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
};
