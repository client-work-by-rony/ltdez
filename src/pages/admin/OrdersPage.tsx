import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Download, ShoppingCart, DollarSign, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      setOrders(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (o.customer_name || "").toLowerCase().includes(s) ||
        (o.phone_number || "").includes(s) ||
        (o.customer_email || "").toLowerCase().includes(s) ||
        (o.gateway_order_id || "").toLowerCase().includes(s) ||
        (o.gateway_transaction_id || "").toLowerCase().includes(s)
      );
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "completed");
    return {
      total: orders.length,
      revenue: completed.reduce((s, o) => s + Number(o.amount || 0), 0),
      successful: completed.length,
      pending: orders.filter((o) => o.status === "pending").length,
      conversion: orders.length ? Math.round((completed.length / orders.length) * 100) : 0,
    };
  }, [orders]);

  function exportCSV() {
    const header = ["Date", "Order ID", "Customer", "Phone", "Email", "Amount", "Method", "Status", "Transaction ID"];
    const rows = filtered.map((o) => [
      new Date(o.created_at).toLocaleString(),
      o.gateway_order_id || o.id,
      o.customer_name || "",
      o.phone_number || "",
      o.customer_email || "",
      o.amount,
      o.payment_method,
      o.status,
      o.gateway_transaction_id || "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders & Payments</h1>
        <p className="text-muted-foreground text-sm">All payment requests and order tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={ShoppingCart} label="Total Orders" value={stats.total} color="text-blue-600" />
        <Stat icon={DollarSign} label="Revenue" value={`৳${stats.revenue}`} color="text-green-600" />
        <Stat icon={CheckCircle2} label="Successful" value={stats.successful} color="text-emerald-600" />
        <Stat icon={Clock} label="Pending" value={stats.pending} color="text-amber-600" />
        <Stat icon={TrendingUp} label="Conversion" value={`${stats.conversion}%`} color="text-primary" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search name, phone, email, order id..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Txn ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No orders found</TableCell></TableRow>
                ) : filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-xs">{new Date(o.created_at).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{o.customer_name || "-"}<br/><span className="text-xs text-muted-foreground">{o.customer_email}</span></TableCell>
                    <TableCell className="font-mono text-xs">{o.phone_number}</TableCell>
                    <TableCell className="font-bold">৳{o.amount}</TableCell>
                    <TableCell className="text-xs uppercase">{o.payment_method}</TableCell>
                    <TableCell><Badge className={STATUS_COLORS[o.status] || ""}>{o.status}</Badge></TableCell>
                    <TableCell className="font-mono text-[10px] max-w-[150px] truncate" title={o.gateway_transaction_id || ""}>{o.gateway_transaction_id || o.gateway_order_id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
