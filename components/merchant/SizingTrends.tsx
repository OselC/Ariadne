"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["var(--color-success)", "var(--color-warning)", "var(--color-danger)", "var(--color-muted)"];
const axisTick = { fill: "var(--color-muted)", fontSize: 12 };
const axisLine = { stroke: "var(--color-rule)" };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[var(--radius-card)] border bg-background p-3 text-xs text-foreground shadow-[var(--shadow-card)]">
      {label && <div className="mb-2 font-semibold">{label}</div>}
      <div className="space-y-1.5 tnum">
        {payload.map((item: any) => (
          <div key={item.dataKey ?? item.name} className="flex items-center justify-between gap-5">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span aria-hidden="true" className="h-2 w-2" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartLegend({ payload }: any) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {payload?.map((item: any) => (
        <li key={item.value} className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2" style={{ backgroundColor: item.color }} />
          {item.value}
        </li>
      ))}
    </ul>
  );
}

export function SizingTrends({ data }: { data: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demand vs Returns by Size</CardTitle>
          <CardDescription>Compare purchase volume with returns before revising size depth.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] tnum" role="img" aria-label="Purchases and returns by garment size">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sizingDemand}>
              <XAxis dataKey="size" tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
              <YAxis tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-paper-3)" }} />
              <Bar dataKey="demand" name="Purchases" fill="var(--color-ink)" />
              <Bar dataKey="returns" name="Returns" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Read each size as a ratio, not volume alone.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Trend — Try-On → Purchase → Return</CardTitle>
          <CardDescription>Follow try-ons through purchase and return outcomes week by week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] tnum" role="img" aria-label="Weekly try-on, purchase, and return trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyTrend}>
              <XAxis dataKey="week" tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
              <YAxis tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-rule-2)" }} />
              <Line type="monotone" dataKey="tryOns" stroke="var(--color-muted)" strokeWidth={2} dot={false} name="Try-ons" />
              <Line type="monotone" dataKey="purchases" stroke="var(--color-ink)" strokeWidth={2} dot={false} name="Purchases" />
              <Line type="monotone" dataKey="returns" stroke="var(--color-accent)" strokeWidth={2} dot={false} name="Returns" />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Fit Risk Distribution</CardTitle>
          <CardDescription>Layer 1 (GPT-4o) risk assessment drives pre-purchase warnings.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[260px] items-center tnum" role="img" aria-label="Distribution of low, medium, and high fit risk">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.fitRisk}
                dataKey="count"
                nameKey="risk"
                cx="50%"
                cy="50%"
                outerRadius={88}
                label={{ fill: "var(--color-muted)", fontSize: 12 }}
              >
                {data.fitRisk.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<ChartLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
