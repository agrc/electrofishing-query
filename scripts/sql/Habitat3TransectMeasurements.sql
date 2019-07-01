SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  tm.DEPTH,
  tm.VELOCITY,
  tm.SUBSTRATE,
  tm.DISTANCE_START,
  tm.TRANSECT_ID

FROM ELECTROFISHING.WILDADMIN.SamplingEvents_evw as se

INNER JOIN ELECTROFISHING.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN ELECTROFISHING.WILDADMIN.Transect_evw as t
ON t.EVENT_ID = se.EVENT_ID

INNER JOIN ELECTROFISHING.WILDADMIN.TransectMeasurements_evw as tm
ON tm.TRANSECT_ID = t.TRANSECT_ID

WHERE se.EVENT_ID IN ('<ids>')
