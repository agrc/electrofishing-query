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

  e.WAVEFORM,
  e.DUTY_CYCLE,
  e.FREQUENCY,
  e.NUM_ANODES,
  e.MACHINE_RES,
  e.MODEL,
  e.ARRAY_TYPE,
  e.NUM_NETTERS,
  e.CATHODE_TYPE,
  e.[TYPE],
  e.PEDAL_TIME,
  e.EQUIPMENT_ID,
  e.VOLTAGE,
  e.AMPS,
  e.CATHODE_LEN,
  e.CATHODE_DIAMETER

FROM {0}.{2}.SamplingEvents_evw as se

INNER JOIN {0}.{2}.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.{2}.Equipment_evw as e
ON e.EVENT_ID = se.EVENT_ID

LEFT OUTER JOIN {0}.{2}.UDWRLakes_evw as l
ON l.Permanent_Identifier = s.WATER_ID

LEFT OUTER JOIN {0}.{2}.UDWRStreams_evw as st
ON st.Permanent_Identifier = s.WATER_ID

WHERE se.EVENT_ID IN ({1})
