import type { ReactNode } from 'react';
import { colors } from '../../config/theme.config';

interface TableProps {
  children: ReactNode;
}

interface TableHeaderProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  style?: React.CSSProperties;
}

export function Table({ children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg" style={{ backgroundColor: colors.bgPrimary }}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead style={{ backgroundColor: colors.bgSecondary }}>
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, onClick, className = '' }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`border-b transition-all ${onClick ? 'cursor-pointer hover:bg-opacity-50' : ''} ${className}`}
      style={{
        borderColor: `${colors.border}20`,
        backgroundColor: onClick ? 'transparent' : colors.bgPrimary,
      }}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${className}`}
      style={{ color: colors.textSecondary }}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', colSpan, style }: TableCellProps) {
  return (
    <td
      className={`px-4 py-3 text-sm ${className}`}
      style={{ color: colors.textPrimary, ...style }}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
