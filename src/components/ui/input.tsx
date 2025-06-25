import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`rounded-lg px-4 py-2 bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";