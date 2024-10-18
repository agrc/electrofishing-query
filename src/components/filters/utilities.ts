import { useQuery } from '@tanstack/react-query';
import { useFirebaseAuth } from '@ugrc/utah-design-system';
import ky from 'ky';
import config from '../../config';
import { SpeciesLengthRow } from './SpeciesLength';

export function isPositiveWholeNumber(value: string): boolean {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

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

export function useDomainValues(url: string, fieldName: string) {
  const { currentUser } = useFirebaseAuth();
  const getValues = async () => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const responseJson = (await ky(`${url}?f=json`, {
      headers: {
        Authorization: `Bearer ${await currentUser.getIdToken()}`,
      },
    }).json()) as FeatureLayerDefinition;

    const field = responseJson.fields.find((field: Field) => field.name === fieldName);

    if (!field) {
      throw new Error(`${fieldName} field not found in ${url}`);
    }

    return field.domain.codedValues;
  };

  return useQuery({
    queryKey: [url, fieldName],
    queryFn: getValues,
  });
}

export function getIsInvalidRange(min: string, max: string) {
  return isPositiveWholeNumber(min) && isPositiveWholeNumber(max) && Number(min) > Number(max);
}

export function getQuery(row: SpeciesLengthRow): string | null {
  if (getIsInvalidRange(row.min, row.max)) {
    return null;
  }

  const queryInfos = [
    [row.species, '=', config.fieldNames.SPECIES_CODE, "'"],
    [row.min, '>=', config.fieldNames.LENGTH, ''],
    [row.max, '<=', config.fieldNames.LENGTH, ''],
  ];

  const parts = queryInfos
    .filter(([node]) => node.length > 0)
    .map(([node, comparison, fieldName, quote]) => {
      return `${fieldName} ${comparison} ${quote}${node}${quote}`;
    });

  return parts.length ? `(${parts.join(' AND ')})` : null;
}
