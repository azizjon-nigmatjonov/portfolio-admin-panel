import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TOP_METRICS,
  CASH_FLOW_DATA,
  CATEGORY_DATA,
  CHART_COLORS,
  USER_GROWTH_DATA,
} from "@/data/mock/analytics";
import { ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ChartTooltip({
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
          <span className="text-xs font-medium text-foreground">
            {typeof entry.value === "number" && entry.value > 1000
              ? `$${(entry.value / 1000).toFixed(0)}K`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOP_METRICS.map((metric) => (
          <Card key={metric.label} className="border-border/50">
            <CardContent className="p-5">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <div className="mt-1 flex items-end justify-between">
                <span className="text-2xl font-semibold tracking-tight text-foreground">{metric.value}</span>
                <span className={cn("flex items-center gap-0.5 text-xs font-medium", metric.up ? "text-success" : "text-destructive")}>
                  {metric.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASH_FLOW_DATA} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="inflow" fill="hsl(234, 89%, 64%)" radius={[4, 4, 0, 0]} maxBarSize={28} name="Inflow" />
                <Bar dataKey="outflow" fill="hsl(0, 72%, 51%)" opacity={0.6} radius={[4, 4, 0, 0]} maxBarSize={28} name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Transaction Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex h-64 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {CATEGORY_DATA.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number | undefined) => [`${value ?? 0}%`, "Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {CATEGORY_DATA.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">User Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={USER_GROWTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(160, 60%, 45%)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "hsl(160, 60%, 45%)", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
