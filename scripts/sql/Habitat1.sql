SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  s.NAME,
  s.STATION_ID,
  s.STREAM_TYPE,

  h.BANKVEG,
  h.DOVR,
  h.DUND,
  h.LGWD,
  h.POOL,
  h.SPNG,
  h.RIFF,
  h.RUNA,
  h.SUB_FINES,
  h.SUB_SAND,
  h.SUB_GRAV,
  h.SUB_COBB,
  h.SUB_RUBB,
  h.SUB_BOUL,
  h.SUB_BEDR,
  h.SIN,
  h.EROS,
  h.TEMP_,
  h.CON,
  h.OXYGEN,
  h.SOLIDS,
  h.TURBIDITY,
  h.ALKALINITY,
  h.BACKWATER,
  h.PH

FROM ELECTROFISHING.WILDADMIN.SamplingEvents_evw as se

INNER JOIN ELECTROFISHING.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN ELECTROFISHING.WILDADMIN.Habitat_evw as h
ON h.EVENT_ID = se.EVENT_ID

WHERE se.EVENT_ID IN ('<ids>')
