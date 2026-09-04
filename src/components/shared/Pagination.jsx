"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Common Pagination Component
 * 
 * Controls requested:
 *  - `<`  : Jumps to First Page
 *  - `<<` : Single step Previous
 *  - Numbers: Page numbers with active indicator & smart ellipsis
 *  - `>>` : Single step Next
 *  - `>`  : Jumps to Last Page
 * 
 * Props:
 *  - currentPage (number): Active page (1-indexed)
 *  - totalPages (number): Total number of pages
 *  - totalItems (number, optional): Total count of items/records
 *  - pageSize (number, optional): Items displayed per page
 *  - onPageChange (function): Callback when page is changed (page) => void
 *  - onPageSizeChange (function, optional): Callback when items per page changes (size) => void
 *  - pageSizeOptions (number[], optional): e.g. [5, 10, 20, 50]
 *  - showSummary (boolean, optional): Whether to show "Showing X-Y of Z results" text (default true)
 *  - showPageSize (boolean, optional): Whether to render rows-per-page dropdown (default false)
 *  - className (string, optional): Wrapper styling override
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 5,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showSummary = true,
  showPageSize = false,
  className = "",
}) {
  // Ensure valid numbers
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage || 1), safeTotalPages);

  const isFirst = safeCurrentPage <= 1;
  const isLast = safeCurrentPage >= safeTotalPages;

  const handlePageSelect = (page) => {
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate smart page numbers array with ellipses
  const getPageNumbers = () => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages = [];
    if (safeCurrentPage <= 3) {
      for (let i = 1; i <= 3; i++) pages.push(i);
      pages.push("ellipsis-end");
      pages.push(safeTotalPages);
    } else if (safeCurrentPage >= safeTotalPages - 2) {
      pages.push(1);
      pages.push("ellipsis-start");
      for (let i = safeTotalPages - 2; i <= safeTotalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis-start");
      pages.push(safeCurrentPage);
      pages.push("ellipsis-end");
      pages.push(safeTotalPages);
    }
    return pages;
  };

  const startRecord = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = totalItems !== undefined ? Math.min(safeCurrentPage * pageSize, totalItems) : safeCurrentPage * pageSize;

  return (
    <div
      className={cn(
        "p-3 sm:p-5 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 select-none",
        className
      )}
    >
      {/* Left side: Results summary & optional rows-per-page selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
        {showSummary && (
          <p className="tracking-wide text-[11px] sm:text-xs">
            Showing{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {startRecord}
            </span>
            {"–"}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {endRecord}
            </span>{" "}
            {totalItems !== undefined && (
              <>
                of{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {totalItems}
                </span>{" "}
                results
              </>
            )}
          </p>
        )}

        {(showPageSize || onPageSizeChange) && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                if (onPageSizeChange) onPageSizeChange(Number(e.target.value));
              }}
              className="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Navigation buttons [<] [<<] [1] [2] ... [>>] [>] */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* First Page Button: < */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => handlePageSelect(1)}
          className={cn(
            "h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all",
            isFirst && "opacity-40 cursor-not-allowed hover:bg-white dark:hover:bg-slate-950 hover:text-slate-700"
          )}
          title="First Page (<)"
        >
          &lt;
        </Button>

        {/* Previous Page Button: << (Single step backwards) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => handlePageSelect(safeCurrentPage - 1)}
          className={cn(
            "h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all",
            isFirst && "opacity-40 cursor-not-allowed hover:bg-white dark:hover:bg-slate-950 hover:text-slate-700"
          )}
          title="Previous Page (<<)"
        >
          &lt;&lt;
        </Button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1 mx-0.5">
          {getPageNumbers().map((item, idx) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-5 sm:w-7 text-center text-slate-400 font-bold text-xs select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = item === safeCurrentPage;
            return (
              <Button
                key={item}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageSelect(item)}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 p-0 rounded-lg sm:rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 border-indigo-600"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {item}
              </Button>
            );
          })}
        </div>

        {/* Next Page Button: >> (Single step forwards) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={() => handlePageSelect(safeCurrentPage + 1)}
          className={cn(
            "h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all",
            isLast && "opacity-40 cursor-not-allowed hover:bg-white dark:hover:bg-slate-950 hover:text-slate-700"
          )}
          title="Next Page (>>)"
        >
          &gt;&gt;
        </Button>

        {/* Last Page Button: > */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={() => handlePageSelect(safeTotalPages)}
          className={cn(
            "h-8 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all",
            isLast && "opacity-40 cursor-not-allowed hover:bg-white dark:hover:bg-slate-950 hover:text-slate-700"
          )}
          title="Last Page (>)"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
}
