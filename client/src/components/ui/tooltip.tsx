import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { colors } from '../../config/theme.config';

interface TooltipContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const TooltipContext = createContext<TooltipContextValue | undefined>(undefined);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Simple tooltip for backwards compatibility (used in DashboardLayout)
interface SimpleTooltipProps {
  content: string;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

// Composable tooltip (new API for Settings page)
interface ComposableTooltipProps {
  children: React.ReactNode;
}

export function Tooltip(props: SimpleTooltipProps | ComposableTooltipProps) {
  // Check if it's the simple API (has 'content' prop)
  if ('content' in props) {
    const { content, children, side = 'right' } = props as SimpleTooltipProps;
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
        {isOpen && (
          <div
            className="absolute z-50 px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none"
            style={{
              backgroundColor: colors.textPrimary,
              color: colors.bgPrimary,
              ...(side === 'top' && { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }),
              ...(side === 'bottom' && { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }),
              ...(side === 'left' && { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }),
              ...(side === 'right' && { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }),
            }}
          >
            {content}
          </div>
        )}
      </div>
    );
  }

  // Composable API
  const { children } = props as ComposableTooltipProps;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative inline-block">
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const context = useContext(TooltipContext);
  const localRef = useRef<HTMLElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (context) {
      context.triggerRef.current = e.currentTarget as HTMLElement;
      context.setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    context?.setIsOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref: localRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    } as any);
  }

  return (
    <button
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
});

TooltipTrigger.displayName = 'TooltipTrigger';

export function TooltipContent({
  children,
  side = 'top',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const context = useContext(TooltipContext);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context?.isOpen && context.triggerRef.current) {
      const triggerRect = context.triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const gap = 8;

      let top = 0;
      let left = 0;

      switch (side) {
        case 'top':
          top = triggerRect.top - gap - (tooltipRect?.height || 0);
          left = triggerRect.left + triggerRect.width / 2 - (tooltipRect?.width || 0) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + gap;
          left = triggerRect.left + triggerRect.width / 2 - (tooltipRect?.width || 0) / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - (tooltipRect?.height || 0) / 2;
          left = triggerRect.left - gap - (tooltipRect?.width || 0);
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - (tooltipRect?.height || 0) / 2;
          left = triggerRect.right + gap;
          break;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = tooltipRect?.width || 0;
      const tooltipHeight = tooltipRect?.height || 0;

      // Clamp to viewport bounds with padding
      left = Math.max(8, Math.min(left, viewportWidth - tooltipWidth - 8));
      top = Math.max(8, Math.min(top, viewportHeight - tooltipHeight - 8));

      setPosition({ top, left });
    }
  }, [context?.isOpen, side]);

  if (!context?.isOpen) {
    return null;
  }

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-[9999] px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap animate-fade-in pointer-events-none ${className}`}
      style={{
        backgroundColor: colors.textPrimary,
        color: colors.bgPrimary,
        top: position.top,
        left: position.left,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
