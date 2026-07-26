export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-6 py-10" aria-label="Chargement du titre">
      <div className="mb-6 h-4 w-48 rounded bg-rdc-blue-100" />
      <div className="mb-3 h-9 w-3/4 rounded bg-rdc-blue-100" />
      <div className="mb-8 h-4 w-48 rounded bg-rdc-blue-50" />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="mb-4 h-20 rounded-xl bg-rdc-blue-50" />)}
    </div>
  );
}