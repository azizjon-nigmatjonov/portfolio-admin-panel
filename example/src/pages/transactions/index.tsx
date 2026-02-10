import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/elements";
import { TRANSACTIONS } from "@/data/mock/transactions";
import { Download, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from "lucide-react";

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

const PAGE_SIZE = 8;

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((txn) => {
      const matchSearch =
        txn.description.toLowerCase().includes(search.toLowerCase()) ||
        txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.counterparty.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || txn.status === statusFilter;
      const matchType = typeFilter === "all" || txn.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <SearchInput
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="h-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-28">ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((txn) => (
              <TableRow key={txn.id} className="cursor-pointer">
                <TableCell className="font-mono text-xs text-muted-foreground">{txn.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                        txn.type === "incoming" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {txn.type === "incoming" ? (
                        <ArrowDownLeft className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{txn.description}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{txn.counterparty}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {txn.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`px-1.5 py-0 text-[10px] capitalize ${statusStyles[txn.status]}`}>
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-mono text-sm font-medium ${
                      txn.type === "incoming" ? "text-success" : "text-foreground"
                    }`}
                  >
                    {txn.type === "incoming" ? "+" : "-"}$
                    {txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-16 text-center text-sm font-medium text-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
