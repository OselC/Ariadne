"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.set("category", filter);
      if (q) params.set("q", q);
      const res = await fetch(`/api/catalog?${params.toString()}`);
      const json = await res.json();
      if (active) {
        setProducts(json.products ?? []);
        setLoading(false);
      }
    }
    const t = setTimeout(load, q ? 300 : 0);
    load();
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [filter, q]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search Tanuki, LoveChara, Kebaya..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
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
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
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
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <Card
              key={p.id}
              onClick={() => onSelect(p)}
              className={cn(
                "overflow-hidden cursor-pointer transition-all hover:shadow-md group",
                selectedId === p.id && "ring-2 ring-primary shadow-md"
              )}
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                <Badge className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">{p.stretch_level} stretch</Badge>
              </div>
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shirt className="h-3 w-3" /> {p.brand}
                </div>
                <div className="text-sm font-semibold leading-tight line-clamp-2 mt-0.5">{p.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-bold">{formatCurrencyIDR(p.price)}</span>
                  <span className="text-[10px] text-muted-foreground capitalize">{p.fabric}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No garments match. Try another brand or category.
        </div>
      )}
    </div>
  );
}
