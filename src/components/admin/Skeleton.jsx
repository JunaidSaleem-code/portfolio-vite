export function Skeleton({ className = "" }) {
  return (
    <div
      className={
        "animate-pulse rounded-md bg-zinc-800/60 " + className
      }
    />
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950 p-3"
        >
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-12 w-16 rounded" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </li>
      ))}
    </ul>
  );
}

export function FormSkeleton({ rows = 4 }) {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
