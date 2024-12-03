import { vi } from 'vitest';

/*
  This is a work-around for an error thrown during test discovery in src/components/filters/utilities.test.ts.
  Here's the error that it was throwing:
   FAIL  src/components/filters/utilities.test.ts [ src/components/filters/utilities.test.ts ]
    TypeError: e is not a constructor
    ❯ node_modules/@arcgis/core/widgets/support/widgetUtils.js:155:7
    ❯ node_modules/@ugrc/utilities/src/hooks/useWebMap.ts:1:31
          1| import MapView from '@arcgis/core/views/MapView.js';
          |                               ^
          2| import WebMap from '@arcgis/core/WebMap.js';
          3| import { useEffect, useRef } from 'react';

  Debugging this error revealed that vitest didn't like how the @arcgis/core/widgets/support/widgetUtils.js file was importing the @esri/arcgis-html-sanitizer module. I couldn't find a way around it other than mocking the MapView module. Mocking the @esri/arcgis-html-sanitizer module didn't work.
*/
vi.mock('@arcgis/core/views/MapView.js', () => {
  return {
    default: vi.fn(),
  };
});
