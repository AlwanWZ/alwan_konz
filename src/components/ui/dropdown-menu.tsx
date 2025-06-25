"use client";
import * as React from "react";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function DropdownMenuTrigger({ asChild, children, ...props }: any) {
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ...props,
    "data-dropdown-trigger": true,
  });
}

export function DropdownMenuContent({ children, className = "" }: any) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  React.useEffect(() => {
    const trigger = document.querySelector('[data-dropdown-trigger]');
    if (!trigger) return;
    const openMenu = () => setOpen((o) => !o);
    trigger.addEventListener("click", openMenu);
    return () => trigger.removeEventListener("click", openMenu);
  }, []);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute mt-2 right-0 min-w-[180px] rounded-lg shadow-lg z-50 ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className = "" }: any) {
  return <div className={`px-4 py-2 text-xs font-semibold text-slate-400 ${className}`}>{children}</div>;
}

export function DropdownMenuSeparator({ className = "" }: any) {
  return <div className={`my-1 border-t ${className}`} />;
}

export function DropdownMenuItem({ children, onClick, className = "" }: any) {
  return (
    <div
      className={`px-4 py-2 cursor-pointer select-none text-sm hover:bg-slate-700/50 rounded transition ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="menuitem"
    >
      {children}
    </div>
  );
}