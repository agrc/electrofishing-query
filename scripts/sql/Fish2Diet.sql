SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  d.FISH_ID,
  d.FISH_SPECIES,
  d.CLASS,
  d.MEASUREMENT_TYPE,
  d.MEASUREMENT

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Fish_evw as f
ON f.EVENT_ID = se.EVENT_ID

INNER JOIN {0}.WILDADMIN.Diet_evw as d
ON d.FISH_ID = f.FISH_ID

WHERE se.EVENT_ID IN ({1})
