SELECT
  se.EVENT_ID,
  se.EVENT_DATE,

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

FROM {0}.WILDADMIN.SamplingEvents_evw as se

INNER JOIN {0}.WILDADMIN.Stations_evw as s
ON s.STATION_ID = se.STATION_ID

INNER JOIN {0}.WILDADMIN.Equipment_evw as e
ON e.EVENT_ID = se.EVENT_ID

WHERE se.EVENT_ID IN ({1})
