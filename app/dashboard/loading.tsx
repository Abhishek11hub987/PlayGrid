export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 rounded-2xl bg-surface-900/90 border border-white/5" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-surface-900/90 border border-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-surface-900/90 border border-white/5" />
    </div>
  )
}
