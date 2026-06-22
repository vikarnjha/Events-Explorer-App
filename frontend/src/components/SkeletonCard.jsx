import { memo } from "react";

function SkeletonCard() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md shadow-slate-200/70">
      <div className="skeleton-shimmer h-56 bg-slate-200" />

      <div className="p-5">
        <div className="skeleton-shimmer mb-3 h-5 w-4/5 rounded-full bg-slate-200" />
        <div className="skeleton-shimmer mb-5 h-5 w-2/3 rounded-full bg-slate-200" />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-8 w-8 rounded-full bg-slate-200" />
            <div className="skeleton-shimmer h-4 w-1/2 rounded-full bg-slate-200" />
          </div>

          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer h-8 w-8 rounded-full bg-slate-200" />
            <div className="skeleton-shimmer h-4 w-3/4 rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="skeleton-shimmer mt-6 h-12 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

export default memo(SkeletonCard);
