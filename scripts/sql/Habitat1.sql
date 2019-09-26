SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  l.WaterName as WaterName_Lake,
  l.Permanent_Identifier as Permanent_Identifier_Lake,
  l.ReachCode as ReachCode_Lake,
  st.WaterName as WaterName_Stream,
  st.Permanent_Identifier as Permanent_Identifier_Stream,
  st.ReachCode as ReachCode_Stream,

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

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Habitat_evw as h
ON h.EVENT_ID = se.EVENT_ID

LEFT OUTER JOIN {0}.WILDADMIN.UDWRLakes_evw as l
ON l.Permanent_Identifier = s.WATER_ID

LEFT OUTER JOIN {0}.WILDADMIN.UDWRStreams_evw as st
ON st.Permanent_Identifier = s.WATER_ID

WHERE se.EVENT_ID IN ({1})
