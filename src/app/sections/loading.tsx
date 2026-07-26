export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-6 py-10" aria-label="Chargement du sommaire">
      <div className="mb-8 h-8 w-72 rounded bg-rdc-blue-100" />
      <div className="mb-8 h-1 w-16 rounded bg-rdc-blue-200" />
      <div className="mb-8 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-rdc-blue-50" />)}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-rdc-blue-50" />)}
      </div>
    </div>
  );
}