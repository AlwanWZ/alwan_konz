import * as React from "react";

export function Badge({ children, className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-slate-700 text-white ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}