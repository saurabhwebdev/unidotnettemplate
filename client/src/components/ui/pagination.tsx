import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Check } from 'lucide-react';
import { colors } from '../../config/theme.config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
}: PaginationProps) {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t"
      style={{ borderColor: colors.border }}
    >
      {/* Info and Page Size */}
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: colors.textMuted }}>
          Showing {startItem} to {endItem} of {totalCount} results
        </span>

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: colors.textMuted }}>
              per page:
            </span>
            <div ref={pageSizeRef} className="relative">
              <button
                type="button"
                onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: `1px solid ${isPageSizeOpen ? colors.primary : colors.border}`,
                  color: colors.textPrimary,
                  boxShadow: isPageSizeOpen ? `0 0 0 3px ${colors.primary}20` : 'none',
                }}
              >
                {pageSize}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isPageSizeOpen ? 'rotate-180' : ''}`}
                  style={{ color: colors.textMuted }}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute bottom-full left-0 mb-1 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-bottom z-50 ${
                  isPageSizeOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-95 translate-y-1 pointer-events-none'
                }`}
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
                  minWidth: '80px',
                }}
              >
                <div className="py-1">
                  {pageSizeOptions.map((size) => {
                    const isSelected = size === pageSize;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          onPageSizeChange(size);
                          setIsPageSizeOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
                        style={{
                          color: isSelected ? colors.primary : colors.textPrimary,
                          backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
                          fontWeight: isSelected ? 500 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = colors.bgHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isSelected ? `${colors.primary}10` : 'transparent';
                        }}
                      >
                        <span>{size}</span>
                        {isSelected && <Check className="w-3 h-3" style={{ color: colors.primary }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'transparent',
            color: currentPage === 1 ? colors.textMuted : colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = colors.bgHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'transparent',
            color: currentPage === 1 ? colors.textMuted : colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = colors.bgHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
                page === '...' ? 'cursor-default' : ''
              }`}
              style={{
                backgroundColor: page === currentPage ? colors.primary : 'transparent',
                color: page === currentPage ? '#fff' : page === '...' ? colors.textMuted : colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                if (page !== currentPage && page !== '...') {
                  e.currentTarget.style.backgroundColor = colors.bgHover;
                }
              }}
              onMouseLeave={(e) => {
                if (page !== currentPage) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'transparent',
            color: currentPage === totalPages ? colors.textMuted : colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = colors.bgHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'transparent',
            color: currentPage === totalPages ? colors.textMuted : colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = colors.bgHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
