import { submitJob } from '@arcgis/core/rest/geoprocessor';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Select, SelectItem, Spinner } from '@ugrc/utah-design-system';
import { useState } from 'react';
import config from '../config';

async function download(eventIds: string[], format: string): Promise<string> {
  const jobInfo = await submitJob(config.urls.download, {
    Event_Ids: eventIds.join(';'),
    Format: format,
  });

  await jobInfo.waitForJobCompletion();

  const parameter = await jobInfo.fetchResultData('Zip_File');
  const value = parameter.value as __esri.DataFile;

  if (import.meta.env.MODE === 'development') {
    // in local dev, the URL comes back from arcgis server like this:
    // http://wrimaps.at.utah.gov/arcgis/rest/directories/arcgisjobs/electrofishing/download_gpserver/j90f5a566908440338294c24963a064bf/scratch/data.zip
    return value.url.replace('http', 'https');
  } else {
    // in staging and prod the URL comes back like this:
    // http://electrofishing-query.dev.utah.gov/arcgis/rest/directories/arcgisjobs/electrofishing/download_gpserver/jc18805d7a9514528841c41408c1eed1f/scratch/data.zip
    return `${config.urls.arcgisServer}${new URL(value.url).pathname}`;
  }
}

type State = {
  format: string;
  error: string | null;
  isBusy: boolean;
};

export default function Download({ eventIds }: { eventIds: string[] }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>({
    format: '',
    error: null,
    isBusy: false,
  });

  const updateState = (newState: Partial<State>) => setState((prev) => ({ ...prev, ...newState }));

  const onDownloadClick = async () => {
    if (eventIds.length === 0) {
      console.warn('No data to download');

      return;
    }

    updateState({ isBusy: true, error: null });

    let url;
    try {
      url = await queryClient.fetchQuery({
        queryKey: ['download', eventIds],
        queryFn: () => download(eventIds as string[], state.format),
      });
    } catch (error) {
      console.error('Error downloading data', error);
      updateState({ error: 'There was an error with the download service', isBusy: false });

      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateState({ isBusy: false });
  };

  return (
    <div>
      <p>This can take a few minutes to process.</p>
      <Select
        placeholder="select format"
        selectedKey={state.format}
        onSelectionChange={(key) => updateState({ format: key as string })}
        aria-label="select format"
        className="inline-flex py-2"
      >
        <SelectItem id="csv" aria-label="CSV">
          CSV
        </SelectItem>
        <SelectItem id="fgdb" aria-label="File Geodatabase">
          File Geodatabase
        </SelectItem>
      </Select>
      <p>
        <Button
          isDisabled={!eventIds.length || state.isBusy || state.format === ''}
          variant="secondary"
          onPress={onDownloadClick}
        >
          {state.isBusy ? <Spinner /> : `Download ${eventIds.length} record${eventIds.length > 1 ? 's' : ''}`}
        </Button>
      </p>
      {state.error && <div className="text-sm text-rose-600 forced-colors:text-[Mark]">{state.error}</div>}
    </div>
  );
}
