import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Settings = {
  id?: string;
  gateway_name: string;
  is_active: boolean;
  mode: string;
  credentials: Record<string, string>;
  return_url?: string | null;
  cancel_url?: string | null;
  success_url?: string | null;
};

const FIELDS: Record<string, { key: string; label: string; secret?: boolean }[]> = {
  shurjopay: [
    { key: "username", label: "Username" },
    { key: "password", label: "Password", secret: true },
    { key: "store_id", label: "Store ID" },
    { key: "signature_key", label: "Signature Key", secret: true },
    { key: "prefix", label: "Prefix (e.g. FTF)" },
  ],
  uddoktapay: [
    { key: "api_key", label: "API Key", secret: true },
    { key: "base_url", label: "Base URL" },
    { key: "webhook_secret", label: "Webhook Secret", secret: true },
  ],
};

export default function PaymentGatewayPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, Settings>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from("payment_gateway_settings")
      .select("*");
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setLoading(false); return; }
    const map: Record<string, Settings> = {};
    (rows || []).forEach((r: any) => { map[r.gateway_name] = r; });
    setData(map);
    setLoading(false);
  }

  async function save(name: string) {
    setSaving(name);
    const s = data[name];
    const { error } = await supabase
      .from("payment_gateway_settings")
      .update({
        is_active: s.is_active,
        mode: s.mode,
        credentials: s.credentials,
        return_url: s.return_url,
        cancel_url: s.cancel_url,
        success_url: s.success_url,
      })
      .eq("gateway_name", name);
    setSaving(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Saved!", description: `${name} settings updated` });
  }

  const update = (name: string, patch: Partial<Settings>) =>
    setData((d) => ({ ...d, [name]: { ...d[name], ...patch } }));

  const updateCred = (name: string, key: string, value: string) =>
    setData((d) => ({ ...d, [name]: { ...d[name], credentials: { ...d[name].credentials, [key]: value } } }));

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Payment Gateway Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">API credentials দিন এবং gateway active করুন। সব data encrypted এবং admin-only।</p>
      </div>

      <Tabs defaultValue="shurjopay">
        <TabsList>
          <TabsTrigger value="shurjopay">ShurjoPay</TabsTrigger>
          <TabsTrigger value="uddoktapay">UddoktaPay</TabsTrigger>
        </TabsList>

        {(["shurjopay", "uddoktapay"] as const).map((name) => {
          const s = data[name];
          if (!s) return null;
          return (
            <TabsContent value={name} key={name}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="capitalize">{name}</CardTitle>
                      <CardDescription>
                        Status: <span className={`font-semibold ${s.is_active ? "text-green-600" : "text-muted-foreground"}`}>{s.is_active ? "Active" : "Disabled"}</span>
                        {" • "}Mode: <span className="font-semibold uppercase">{s.mode}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Enable</Label>
                      <Switch checked={s.is_active} onCheckedChange={(v) => update(name, { is_active: v })} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Label className="text-sm font-semibold">Mode:</Label>
                    <div className="flex gap-2">
                      {["sandbox", "live"].map((m) => (
                        <button key={m} onClick={() => update(name, { mode: m })}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase ${s.mode === m ? "bg-primary text-primary-foreground" : "bg-white border"}`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {FIELDS[name].map((f) => {
                      const showKey = `${name}-${f.key}`;
                      const visible = !f.secret || reveal[showKey];
                      return (
                        <div key={f.key}>
                          <Label className="text-xs">{f.label}</Label>
                          <div className="relative">
                            <Input
                              type={visible ? "text" : "password"}
                              value={s.credentials?.[f.key] || ""}
                              onChange={(e) => updateCred(name, f.key, e.target.value)}
                              placeholder={f.label}
                            />
                            {f.secret && (
                              <button type="button" onClick={() => setReveal((r) => ({ ...r, [showKey]: !r[showKey] }))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded">
                                {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => save(name)} disabled={saving === name}>
                      {saving === name ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Card>
        <CardHeader><CardTitle className="text-base">Webhook & Callback URLs</CardTitle></CardHeader>
        <CardContent className="text-xs space-y-2 text-muted-foreground">
          <p><strong>ShurjoPay Callback (auto):</strong></p>
          <code className="block p-2 bg-muted rounded break-all">{import.meta.env.VITE_SUPABASE_URL}/functions/v1/shurjopay-callback</code>
        </CardContent>
      </Card>
    </div>
  );
}
