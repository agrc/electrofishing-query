import { getErrorMessage, type FallbackProps } from 'react-error-boundary';

export default function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="text-red-500">{getErrorMessage(error)}</pre>
    </div>
  );
}
