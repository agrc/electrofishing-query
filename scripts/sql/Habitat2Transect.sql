SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

  l.WaterName as WaterName_Lake,
  l.Permanent_Identifier as Permanent_Identifier_Lake,
  l.DWR_WaterID as DWR_WaterID_Lake,
  l.ReachCode as ReachCode_Lake,
  st.WaterName as WaterName_Stream,
  st.Permanent_Identifier as Permanent_Identifier_Stream,
  st.DWR_WaterID as DWR_WaterID_Stream,
  st.ReachCode as ReachCode_Stream,

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

LEFT OUTER JOIN {0}.WILDADMIN.UDWRLakes_evw as l
ON l.Permanent_Identifier = s.WATER_ID

LEFT OUTER JOIN {0}.WILDADMIN.UDWRStreams_evw as st
ON st.Permanent_Identifier = s.WATER_ID

WHERE se.EVENT_ID IN ({1})
