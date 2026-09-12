import React from "react";

function pulse(className: string) {
  return `animate-pulse bg-slate-200 rounded ${className}`;
}

// ─── Generic shimmer row (for tables)
export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-5">
        <div className={pulse("h-4 w-full")} />
      </td>
    ))}
  </tr>
);

// ─── KPI card skeleton
export const SkeletonKpiCard: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
    <div className={pulse("h-3 w-24")} />
    <div className={pulse("h-8 w-16")} />
    <div className={pulse("h-3 w-32")} />
  </div>
);

// ─── Table skeleton (header + rows)
export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
    <div className="p-4 border-b border-slate-100">
      <div className={pulse("h-5 w-40")} />
    </div>
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Page-level error state
export const QueryError: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = "Something went wrong while loading data.", onRetry }) => (
  <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
    <p className="text-rose-700 font-semibold text-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="h-9 px-5 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
      >
        Retry
      </button>
    )}
  </div>
);
