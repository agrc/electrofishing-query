SELECT
  se.EVENT_ID,
  se.EVENT_DATE,
  se.GEO_DEF,
  se.LOCATION_NOTES,
  se.SEGMENT_LENGTH,
  se.NUM_PASSES,
  se.WEATHER,
  se.OBSERVERS,
  se.SURVEY_PURPOSE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE
FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

WHERE EVENT_ID IN ({1})
