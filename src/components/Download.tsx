import { submitJob } from '@arcgis/core/rest/geoprocessor';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Link, Select, SelectItem, Spinner } from '@ugrc/utah-design-system';
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

  return value.url.replace('http', 'https');
}

type State = {
  format: string;
  error: string | null;
  isBusy: boolean;
  url: string | null;
};

export default function Download({ eventIds }: { eventIds: string[] }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<State>({
    format: '',
    error: null,
    isBusy: false,
    url: null,
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

    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'data.zip';
    // document.body.appendChild(link);
    // link.click();
    // // document.body.removeChild(link);

    updateState({ isBusy: false, url });
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
          {state.isBusy ? (
            <Spinner />
          ) : (
            `Generate download of ${eventIds.length} record${eventIds.length > 1 ? 's' : ''}`
          )}
        </Button>
      </p>
      {state.url && (
        <p className="my-4 text-lg">
          <Link href={state.url} download="data.zip">
            Download data
          </Link>
        </p>
      )}
      {state.error && <div className="text-sm text-rose-600 forced-colors:text-[Mark]">{state.error}</div>}
    </div>
  );
}
