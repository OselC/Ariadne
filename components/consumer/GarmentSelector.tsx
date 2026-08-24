"use client";
import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrencyIDR } from "@/lib/utils";
import { Search, Shirt } from "lucide-react";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
  size_chart: any;
  fabric: string;
  stretch_level: string;
};

export function GarmentSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (p: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filter !== "all") params.set("category", filter);
        if (q) params.set("q", q);
        const res = await fetch(`/api/catalog?${params.toString()}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (active) setProducts(json.products ?? []);
      } catch {
        if (active) {
          setProducts([]);
          setError("Catalog unavailable. Try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }, q ? 300 : 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [filter, q, retry]);

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="garment-search" className="mb-2 block text-xs font-semibold">Search garments</label>
        <div className="flex gap-2">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="garment-search" placeholder="Search Tanuki, LoveChara, Kebaya…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} aria-describedby="garment-search-status" aria-invalid={!!error} />
        </div>
        </div>
        <p id="garment-search-status" className={cn("mt-2 min-h-4 text-xs", error ? "text-destructive" : "text-muted-foreground")} aria-live="polite">{error ?? (loading ? "Updating catalogue…" : `${products.length} garments`)}</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin" aria-label="Garment categories">
        {[
          ["all", "All"],
          ["upper_body", "Tops"],
          ["lower_body", "Bottoms"],
          ["dress", "Dresses"],
          ["outerwear", "Outer"],
          ["traditional", "Traditional"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={cn(
              "min-h-11 shrink-0 rounded-[var(--radius-input)] border px-3.5 text-xs font-medium transition-[background-color,color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
              filter === val ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 4, 4].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onSelect(p)}
              aria-pressed={selectedId === p.id}
              aria-label={`Select ${p.name} by ${p.brand}`}
              className={cn(
                "group overflow-hidden rounded-[var(--radius-card)] border bg-card text-left text-card-foreground transition-[background-color,transform] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
                selectedId === p.id && "border-primary outline outline-1 outline-primary"
              )}
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                <Badge className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">{p.stretch_level} stretch</Badge>
              </div>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shirt aria-hidden="true" className="h-3 w-3" /> {p.brand}
                </div>
                <div className="mt-0.5 truncate text-sm font-semibold leading-tight" title={p.name}>{p.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-bold">{formatCurrencyIDR(p.price)}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{p.fabric}</span>
                </div>
              </CardContent>
            </button>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center justify-between gap-4 border border-dashed p-5 text-sm">
          <span>{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setRetry((value) => value + 1)}>Retry</Button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="border border-dashed p-8 text-center text-sm text-muted-foreground">
          No garments match. Try another brand or category.
        </div>
      )}
    </div>
  );
}
