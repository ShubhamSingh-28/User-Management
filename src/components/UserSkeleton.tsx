

export function UserSkeleton() {
  return (
    <div className="bg-white shadow p-4 rounded animate-pulse">
      <div className="h-6 w-32 bg-gray-300 rounded mb-4" />

      <div className="space-y-3">
        <div className="h-4 w-48 bg-gray-300 rounded" />
        <div className="h-4 w-56 bg-gray-300 rounded" />
        <div className="h-4 w-44 bg-gray-300 rounded" />

        <div className="mt-4 space-y-2">
          <div className="h-4 w-28 bg-gray-300 rounded" />
          <div className="h-4 w-64 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  )
}
