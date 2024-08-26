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

  a.ANODE_DIAMETER,
  a.STOCK_DIAMETER,
  a.EQUIPMENT_ID,
  a.ANODE_SHAPE

FROM {0}.{2}.SamplingEvents_evw as se

INNER JOIN {0}.{2}.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.{2}.Equipment_evw as e
ON e.EVENT_ID = se.EVENT_ID

INNER JOIN {0}.{2}.Anodes_evw as a
ON e.EQUIPMENT_ID = a.EQUIPMENT_ID

LEFT OUTER JOIN {0}.{2}.UDWRLakes_evw as l
ON l.Permanent_Identifier = s.WATER_ID

LEFT OUTER JOIN {0}.{2}.UDWRStreams_evw as st
ON st.Permanent_Identifier = s.WATER_ID

WHERE se.EVENT_ID IN ({1})
