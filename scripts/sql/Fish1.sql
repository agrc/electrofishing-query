SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  f.FISH_ID,
  f.CATCH_ID,
  f.PASS_NUM,
  f.SPECIES_CODE,
  f.LENGTH,
  f.LENGTH_TYPE,
  f.WEIGHT,
  f.NOTES

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Fish_evw as f
ON f.EVENT_ID = se.EVENT_ID

WHERE se.EVENT_ID IN ({1})
