import * as React from "react";
import { cn } from "@/shared/utils/cn";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

function TableRowSkeleton({
  columnCount = 1,
  className,
  rowIndex = 0,
}: {
  columnCount?: number;
  className?: string;
  rowIndex?: number;
}) {
  return (
    <TableRow className={className}>
      {Array.from({ length: columnCount }).map((_, i) => (
        <TableCell key={i} className="px-6 py-4">
          <div
            className="h-4 rounded bg-muted/80 animate-skeleton-pulse"
            style={{
              width: i === 0 ? "60%" : i === columnCount - 1 ? "20%" : "85%",
              animationDelay: `${(rowIndex * 0.08 + i * 0.03) % 1.5}s`,
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableCell, TableRowSkeleton };
