import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/elements";
import { KPIS, REVENUE_CHART_DATA, ACTIVITY_CHART_DATA, RECENT_TRANSACTIONS } from "@/data/mock/dashboard";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-muted-foreground capitalize">{entry.name}:</span>
          <span className="text-xs font-medium text-foreground">${(entry.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
}

function ActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Transactions:</span>
        <span className="text-xs font-medium text-foreground">{payload[0].value.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Volume:</span>
        <span className="text-xs font-medium text-foreground">${((payload[1]?.value ?? 0) / 1000).toFixed(0)}K</span>
      </div>
    </div>
  );
}

export default function DashboardMainPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground">Expenses</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_CHART_DATA}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}K`} dx={-4} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(234, 89%, 64%)" fill="url(#revenueGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="hsl(220, 10%, 46%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ACTIVITY_CHART_DATA} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-4} />
                    <Tooltip content={<ActivityTooltip />} />
                    <Bar dataKey="transactions" fill="hsl(234, 89%, 64%)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="volume" fill="hsl(234, 89%, 64%)" opacity={0.2} radius={[4, 4, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <button className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex flex-col">
            {RECENT_TRANSACTIONS.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    txn.type === "incoming" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {txn.type === "incoming" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-foreground">{txn.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {txn.id} &middot; {txn.time}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("text-sm font-mono font-medium", txn.type === "incoming" ? "text-success" : "text-foreground")}>
                    {txn.amount}
                  </span>
                  <Badge variant="outline" className={cn("px-1.5 py-0 text-[10px] capitalize", statusStyles[txn.status])}>
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
