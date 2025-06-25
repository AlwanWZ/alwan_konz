"use client";
import * as React from "react";

export function Dialog({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export function DialogTrigger({ asChild, children, ...props }: any) {
  if (asChild) return React.cloneElement(children, props);
  return <button {...props}>{children}</button>;
}

export function DialogContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 ${className}`} {...props}>
      <div className="bg-slate-900 rounded-xl p-6 max-w-lg w-full border border-slate-700 shadow-xl">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="mb-4" {...props}>{children}</div>;
}

export function DialogTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-xl font-bold ${className}`} {...props}>{children}</h2>;
}