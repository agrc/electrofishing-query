import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, CheckboxGroup, TextField } from '@ugrc/utah-design-system';
import ky from 'ky';
import { useEffect } from 'react';
import config from '../config';
import { useMap } from './hooks';

const emptyDefinition = '1=0';

type DomainValue = {
  name: string;
  code: string;
};
type Field = {
  name: string;
  domain: {
    codedValues: DomainValue[];
  };
};
type FeatureLayerDefinition = {
  fields: Field[];
};

async function getPurposes(): Promise<DomainValue[]> {
  // TODO: this should probably come from env var
  // if we do end up staying with the public service, then it will need to be published to the test server (wrimaps.at.utah.gov)
  const url = 'https://wrimaps.utah.gov/arcgis/rest/services/Electrofishing/Public/MapServer/1?f=json';
  const responseJson = (await ky(url).json()) as FeatureLayerDefinition;

  const purposeField = responseJson.fields.find(
    (field: Field) => field.name === config.fieldNames.events.SURVEY_PURPOSE,
  );

  if (!purposeField) {
    throw new Error(`${config.fieldNames.events.SURVEY_PURPOSE} field not found in ${url}`);
  }

  return purposeField.domain.codedValues;
}

export default function Filter() {
  const { addLayers, mapView } = useMap();
  const purposeQuery = useQuery({ queryKey: ['purposes'], queryFn: getPurposes });

  useEffect(() => {
    if (!mapView) {
      return;
    }

    const stations = new FeatureLayer({
      url: 'https://wrimaps.utah.gov/arcgis/rest/services/Electrofishing/Public/MapServer/0',
      definitionExpression: emptyDefinition,
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
            {purposeQuery.data?.map(({ name, code }) => (
              <div key={code} className="ml-2 flex gap-1">
                <Checkbox type="checkbox" id={code} name={code} value={code} />
                <label htmlFor={code}>{name}</label>
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
            <TextField label="species" className="w-20" />
          </div>
          <div className="ml-2 flex gap-1">
            <TextField label="min" className="w-20" />
            <TextField label="max" className="w-20" />
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
            <TextField label="from" className="w-20" />
            <TextField label="to" className="w-20" />
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
            <TextField label="name" className="w-20" />
          </div>
          <div className="w-30 flex justify-end">
            <Button variant="secondary">clear all</Button>
          </div>
        </div>
      </div>
    </>
  );
}
