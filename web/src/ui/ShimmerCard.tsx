function ShimmerCard({ className = '' }: { className?: string }) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ring-1 ring-white ${className}`}
    >
      {/* Image Area */}
      <div className="relative h-32 overflow-hidden bg-slate-100 sm:h-40">
        <div className="shimmer-bg h-full w-full" />
        {/* Premium Badge */}
        <span className="absolute left-2 top-2 rounded-full bg-slate-200 px-2 py-0.5 text-[9px] sm:px-2.5 sm:text-[10px]">
          <div className="shimmer-bg h-2.5 w-12 rounded sm:w-14" />
        </span>
      </div>

      {/* Content Area */}
      <div className="space-y-1.5 p-2.5 sm:space-y-2 sm:p-3">
        {/* Title and Favorite Button */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* Title - 2 lines */}
            <div className="space-y-1">
              <div className="shimmer-bg h-3 w-full rounded sm:h-3.5" />
              <div className="shimmer-bg h-3 w-3/4 rounded sm:h-3.5" />
            </div>
          </div>
          {/* Favorite Button */}
          <div className="shimmer-bg h-7 w-7 shrink-0 rounded-full sm:h-8 sm:w-8" />
        </div>

        {/* Description - 2 lines */}
        <div className="space-y-1">
          <div className="shimmer-bg h-2.5 w-full rounded sm:h-3" />
          <div className="shimmer-bg h-2.5 w-5/6 rounded sm:h-3" />
        </div>

        {/* Price and View Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <div className="shimmer-bg h-5 w-16 rounded sm:h-6 sm:w-20" />
          <div className="shimmer-bg h-6 w-12 rounded-xl sm:h-7 sm:w-14" />
        </div>
      </div>
    </article>
  );
}

export default ShimmerCard;
