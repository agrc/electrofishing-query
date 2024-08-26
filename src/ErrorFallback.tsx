export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="text-red-500">{error.message}</pre>
    </div>
  );
}
