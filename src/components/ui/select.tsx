"use client";
import * as React from "react";

export function Select({ value, onValueChange, children, ...props }: any) {
  return (
    <div {...props}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
          : child
      )}
    </div>
  );
}

export function SelectTrigger({ children, className = "", value, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className={`flex items-center justify-between rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <path d={isOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
        </svg>
      </button>
      
      {isOpen && React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SelectValue) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            isOpen, 
            onClose: () => setIsOpen(false)
          });
        }
        return null;
      })}
    </div>
  );
}

export function SelectValue({ 
  placeholder, 
  children, 
  value, 
  isOpen, 
  onClose,
  ...props 
}: { 
  placeholder?: string; 
  children?: React.ReactNode;
  value?: string;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      <span className="truncate">{value || placeholder}</span>
      {isOpen && (
        <SelectContent onClose={onClose} {...props} />
      )}
    </>
  );
}

export function SelectContent({ 
  children, 
  className = "", 
  onClose,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  // Close dropdown when clicking outside
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node) && onClose) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={ref}
      className={`absolute mt-1 z-50 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ 
  value: itemValue, 
  children, 
  className = "",
  value: selectedValue,
  onValueChange, 
  ...props 
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}) {
  const isSelected = itemValue === selectedValue;
  
  return (
    <div
      className={`px-4 py-2 cursor-pointer hover:bg-emerald-600/20 text-white ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : ''} ${className}`}
      onClick={() => onValueChange && onValueChange(itemValue)}
      {...props}
    >
      <div className="flex items-center justify-between">
        {children}
        {isSelected && (
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );
}