"use client";
import * as React from "react";

interface TabsProps {
  value: any;
  onValueChange: (value: any) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
          : child
      )}
    </div>
  );
}

export function TabsList({ children, className = "" }: any) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value: tabValue, value, onValueChange, children, className = "" }: any) {
  const active = value === tabValue;
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? "bg-emerald-500 text-white"
          : "bg-transparent text-slate-400 hover:bg-slate-700/50"
      } ${className}`}
      onClick={() => onValueChange && onValueChange(tabValue)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: tabValue, value, children }: any) {
  if (value !== tabValue) return null;
  return <div className="mt-4">{children}</div>;
}