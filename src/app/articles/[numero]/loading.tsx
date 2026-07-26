export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-6 py-10" aria-label="Chargement de l'article">
      <div className="mb-6 h-4 w-64 rounded bg-rdc-blue-100" />
      <div className="mb-4 h-9 w-56 rounded bg-rdc-blue-100" />
      <div className="space-y-3 rounded-2xl border border-rdc-blue-100 p-6">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`h-4 rounded bg-rdc-blue-50 ${i % 3 === 2 ? "w-4/5" : "w-full"}`} />)}
      </div>
    </div>
  );
}