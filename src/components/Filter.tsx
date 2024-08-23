import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { Button, Checkbox, CheckboxGroup, TextField } from '@ugrc/utah-design-system';
import { useEffect } from 'react';
import { useMap } from './hooks';

const secureServiceUrl = import.meta.env.VITE_PROXY_URL;

// TODO!: replace partial list with actual list
const purpose = ['Depletion estimate', 'Mark-Recapture', 'Disease certification', 'Genetics', 'Other'];

export default function Filter() {
  const { addLayers, mapView } = useMap();

  useEffect(() => {
    if (!mapView) {
      return;
    }

    const stations = new FeatureLayer({
      url: `${secureServiceUrl}/mapservice/0`,
      id: 'stations',
    });
    addLayers([stations]);
  }, [addLayers, mapView]);

  return (
    <>
      <h2 className="text-xl font-bold">Map filters</h2>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <div>
          <h3 className="text-lg font-semibold">Purpose</h3>
          <CheckboxGroup>
            {purpose.map((p) => (
              <div key={p} className="ml-2 flex gap-1">
                <Checkbox type="checkbox" id={p} name={p} value={p} />
                <label htmlFor={p}>{p}</label>
              </div>
            ))}
          </CheckboxGroup>
        </div>
        <div className="w-30 flex justify-end">
          <Button variant="secondary">clear all</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <h3 className="text-lg font-semibold">Species and length</h3>
        <div className="flex flex-col gap-2">
          <div className="ml-2 flex gap-1">
            species <TextField className="w-20" />
          </div>
          <div className="ml-2 flex gap-1">
            min <TextField className="w-20" />
            max <TextField className="w-20" />
          </div>
          <div className="w-30 flex justify-end">
            <Button variant="secondary">clear all</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <h3 className="text-lg font-semibold">Date range</h3>
        <div className="flex flex-col gap-2">
          <div className="ml-2 flex gap-1">
            from <TextField className="w-20" />
            to <TextField className="w-20" />
          </div>
          <div className="w-30 flex justify-end">
            <Button variant="secondary">clear all</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded border border-zinc-200 p-3 dark:border-zinc-700">
        <h3 className="text-lg font-semibold">Water body</h3>
        <div className="flex flex-col gap-2">
          <div className="ml-2 flex gap-1">
            name <TextField className="w-20" />
          </div>
          <div className="w-30 flex justify-end">
            <Button variant="secondary">clear all</Button>
          </div>
        </div>
      </div>
    </>
  );
}
