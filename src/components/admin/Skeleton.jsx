export function Skeleton({ className = "" }) {
  return <div className={"st-skeleton " + className} />;
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="st-card--flat flex items-center gap-3 px-3 py-3"
        >
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-12 w-16 rounded-md" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
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
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
