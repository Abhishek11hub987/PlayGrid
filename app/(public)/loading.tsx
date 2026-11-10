export default function PublicLoading() {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-10 space-y-8 animate-pulse">
      <div className="h-64 rounded-2xl bg-surface-900/90 border border-white/5" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-surface-900/90 border border-white/5" />
        ))}
      </div>
    </div>
  )
}

