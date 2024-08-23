import config from '../config';
import { QueryInfo } from './contexts/FilterProvider';

export function getStationQuery(queryInfos: QueryInfo[]): string {
  // Returns a query that selects stations given some related table queries
  const tables: Record<string, string[]> = {};

  // organize where clauses by table
  queryInfos.forEach((info) => {
    // make sure that we don't mutate this object and mess up the grid query
    info = Object.assign({}, info);

    if (info.table === config.tableNames.fish) {
      // fish table requires an additional join
      info.table = config.tableNames.events;
      info.where = `${config.fieldNames.EVENT_ID} IN (
                      SELECT ${config.fieldNames.EVENT_ID} FROM
                      ${config.databaseName}.WILDADMIN.${config.tableNames.fish}
                      WHERE ${info.where})`;
    }

    if (tables[info.table]) {
      tables[info.table].push(info.where);
    } else {
      tables[info.table] = [info.where];
    }
  });

  const query = Object.keys(tables).reduce((previous, current, currentIndex) => {
    // concat where clauses for table
    const where = tables[current].join(' AND ');

    // support multiple table queries
    if (currentIndex > 0) {
      previous += ' AND ';
    }

    // no need for join on stations table query
    if (current === config.tableNames.stations) {
      return `${previous}(${where})`;
    }

    return `${previous}(${config.fieldNames.STATION_ID} IN (SELECT ${config.fieldNames.STATION_ID}
                  FROM ${config.databaseName}.WILDADMIN.${current} WHERE ${where}))`;
  }, '');

  return removeIrrelevantWhiteSpace(query);
}

export function getGridQuery(queryInfos: QueryInfo[]): string {
  // Returns a query that selects rows in the grid

  return `(${queryInfos
    .reduce((previous: string[], current) => {
      previous.push(current.where);

      return previous;
    }, [])
    .join(') AND (')})`;
}

export function getStationQueryFromIds(ids: string[]): string {
  return `${config.fieldNames.STATION_ID} IN ('${ids.join("', '")}')`;
}

export function removeIrrelevantWhiteSpace(text: string): string {
  return text
    .replace(/\n/g, '') // SQL doesn't like newline characters
    .replace(/ +/g, ' ') // multiple whitespaces
    .replace(/\(\s/g, '(') // spaces around parenthesis
    .replace(/\s\)/g, ')'); // ''
}

type Row = Record<string, string>;
export function getIdsFromGridSelection(rows: Row[], selection: Record<string, boolean>): string {
  const selectedIds = Object.keys(selection);
  if (selectedIds.length > 0) {
    rows = rows.filter((row) => selectedIds.indexOf(row[config.fieldNames.EVENT_ID]) > -1);
  }

  return rows.map((row) => row[config.fieldNames.EVENT_ID]).join(';');
}
