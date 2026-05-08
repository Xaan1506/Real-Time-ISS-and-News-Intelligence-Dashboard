export function SkeletonCard() {
  return <div className="h-[112px] animate-pulse rounded-2xl border border-white/10 bg-white/5" />;
}

export function SkeletonNewsCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="h-40 animate-pulse bg-white/10" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
