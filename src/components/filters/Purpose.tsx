import { useQuery } from '@tanstack/react-query';
import { Button, Checkbox, CheckboxGroup } from '@ugrc/utah-design-system';
import ky from 'ky';
import { useEffect, useState } from 'react';
import config from '../../config';
import { useFilter } from '../contexts/FilterProvider';

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

  const purposeField = responseJson.fields.find((field: Field) => field.name === config.fieldNames.SURVEY_PURPOSE);

  if (!purposeField) {
    throw new Error(`${config.fieldNames.SURVEY_PURPOSE} field not found in ${url}`);
  }

  return purposeField.domain.codedValues;
}

export default function Purpose(): JSX.Element {
  const purposesDomain = useQuery({ queryKey: ['purposes'], queryFn: getPurposes });
  const { filterDispatch } = useFilter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValues.length > 0) {
      filterDispatch({
        type: 'UPDATE_TABLE',
        filterKey: 'purpose',
        value: {
          where: `${config.fieldNames.SURVEY_PURPOSE} IN ('${selectedValues.join("','")}')`,
          table: config.tableNames.events,
        },
      });
    } else {
      filterDispatch({ type: 'CLEAR_TABLE', filterKey: 'purpose' });
    }
  }, [selectedValues, filterDispatch]);

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold">Purpose</h3>
        <CheckboxGroup onChange={setSelectedValues} value={selectedValues}>
          {purposesDomain.data?.map(({ name, code }) => (
            <div key={code} className="ml-2 flex gap-1">
              <Checkbox id={code} name={code} value={code} />
              <label htmlFor={code}>{name}</label>
            </div>
          ))}
        </CheckboxGroup>
      </div>
      <div className="w-30 flex justify-end">
        <Button variant="secondary" onPress={() => setSelectedValues([])}>
          clear all
        </Button>
      </div>
    </>
  );
}
