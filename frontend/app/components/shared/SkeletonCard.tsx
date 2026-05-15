export function SkeletonCard({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-[#e5e7eb] bg-white p-5">
      <div className="skeleton h-5 w-1/3" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="skeleton h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
