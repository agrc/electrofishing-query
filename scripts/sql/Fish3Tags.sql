SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  t.FISH_ID,
  t.NUMBER,
  t.[TYPE],
  t.[LOCATION],
  t.COLOR,
  t.NEW_TAG,
  t.TRANSPONDER_FREQ,
  t.TRANSMITTER_FREQ,
  t.TRANSMITTER_FREQ_TYPE

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Fish_evw as f
ON f.EVENT_ID = se.EVENT_ID

INNER JOIN {0}.WILDADMIN.Tags_evw as t
ON t.FISH_ID = f.FISH_ID

WHERE se.EVENT_ID IN ({1})
