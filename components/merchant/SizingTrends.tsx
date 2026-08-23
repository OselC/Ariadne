"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export function SizingTrends({ data }: { data: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demand vs Returns by Size</CardTitle>
          <CardDescription>Inventory recommendation: stock deeper in low-return sizes. Re-cut high-return sizes.</CardDescription>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sizingDemand}>
              <XAxis dataKey="size" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="demand" name="Purchases" fill="#0a0a0f" radius={[8, 8, 0, 0]} />
              <Bar dataKey="returns" name="Returns" fill="#e63946" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-muted-foreground">
            Insight: M is top demand; L shows higher return ratio — consider grading adjustment or fabric with more stretch.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Trend — Try-On → Purchase → Return</CardTitle>
          <CardDescription>Healthy funnel: try-ons convert, returns decline week-over-week.</CardDescription>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weeklyTrend}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="tryOns" stroke="#6366f1" strokeWidth={2} dot={false} name="Try-ons" />
              <Line type="monotone" dataKey="purchases" stroke="#0a0a0f" strokeWidth={2} dot={false} name="Purchases" />
              <Line type="monotone" dataKey="returns" stroke="#e63946" strokeWidth={2} dot={false} name="Returns" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-2 text-[11px]">
            <Badge variant="outline">W4: returns down to single digits — Ariadne filtering works</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Fit Risk Distribution</CardTitle>
          <CardDescription>Layer 1 (GPT-4o) risk assessment drives pre-purchase warnings. Target &lt;15% high-risk purchases.</CardDescription>
        </CardHeader>
        <CardContent className="h-[240px] flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.fitRisk} dataKey="count" nameKey="risk" cx="50%" cy="50%" outerRadius={88} label>
                {data.fitRisk.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
