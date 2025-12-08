import React, { useState, createContext, useContext } from 'react';
import { colors } from '../../config/theme.config';

interface TooltipContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
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

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
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

  const handleMouseEnter = () => {
    context?.setIsOpen(true);
  };

  const handleMouseLeave = () => {
    context?.setIsOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
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

  if (!context?.isOpen) {
    return null;
  }

  return (
    <div
      className={`absolute z-50 px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap animate-fade-in ${className}`}
      style={{
        backgroundColor: colors.textPrimary,
        color: colors.bgPrimary,
        ...(side === 'top' && { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }),
        ...(side === 'bottom' && { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }),
        ...(side === 'left' && { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }),
        ...(side === 'right' && { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
