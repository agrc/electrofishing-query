SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  t.BWID,
  t.WWID,
  t.STARTING_BANK,
  t.TRANSECT_ID,
  t.TRANSECT_NUM

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Transect_evw as t
ON t.EVENT_ID = se.EVENT_ID

WHERE se.EVENT_ID IN ({1})
