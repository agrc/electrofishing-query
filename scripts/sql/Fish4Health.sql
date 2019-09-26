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

  h.FISH_ID,
  h.EYE,
  h.GILL,
  h.PSBR,
  h.THYMUS,
  h.FAT,
  h.SPLEEN,
  h.HIND,
  h.KIDNEY,
  h.LIVER,
  h.BILE,
  h.GENDER,
  h.REPRODUCTIVE,
  h.HEMATOCRIT,
  h.LEUKOCRIT,
  h.PLPRO,
  h.FIN,
  h.OPERCLE,
  h.COLLECTION_PART

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Fish_evw as f
ON f.EVENT_ID = se.EVENT_ID

INNER JOIN {0}.WILDADMIN.Health_evw as h
ON h.FISH_ID = f.FISH_ID

LEFT OUTER JOIN {0}.WILDADMIN.UDWRLakes_evw as l
ON l.Permanent_Identifier = s.WATER_ID

LEFT OUTER JOIN {0}.WILDADMIN.UDWRStreams_evw as st
ON st.Permanent_Identifier = s.WATER_ID

WHERE se.EVENT_ID IN ({1})
