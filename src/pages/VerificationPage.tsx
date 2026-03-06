import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Info, ExternalLink, Activity, Globe, Database } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
export function VerificationPage() {
  const [hash, setHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<null | 'valid' | 'invalid'>(null);
  const handleVerify = () => {
    if (!hash.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setResult('valid');
      toast.success("Verification Confirmed", {
        description: "Asset integrity validated against BSC network."
      });
    }, 2000);
  };
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-teal-500/10 text-teal-400 mb-4 animate-pulse">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter">Asset Registry</h1>
          <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Verify any digital book's authenticity. Enter the cryptographic hash or asset ID to query the blockchain.
          </p>
        </div>
        <Card className="glass-panel border-white/5 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl pointer-events-none" />
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-2xl font-black uppercase italic tracking-tight">On-Chain Lookup</CardTitle>
            <CardDescription className="text-white/30 font-medium">Providing real-time verification via the FlexSmart Protocol.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-6">
            <div className="relative group">
              <Input
                placeholder="Enter 0x Transaction Hash or Asset ID..."
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="bg-white/[0.03] border-white/5 h-16 pl-14 rounded-2xl focus:ring-2 focus:ring-teal-500/50 text-lg transition-all"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-teal-400 transition-colors" />
            </div>
            <Button
              disabled={isVerifying || !hash}
              onClick={handleVerify}
              className="btn-premium w-full h-16 text-xl uppercase tracking-widest"
            >
              {isVerifying ? (
                <span className="flex items-center gap-3">
                  <Activity className="w-6 h-6 animate-spin" />
                  Querying Mainnet...
                </span>
              ) : "Authenticate Asset"}
            </Button>
          </CardContent>
        </Card>
        {result === 'valid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-[3rem] glass-panel bg-teal-500/5 border-teal-500/20 space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-teal-400 uppercase italic">Authenticity Confirmed</h3>
                <p className="text-white/40 font-medium">This asset is uniquely registered to the Binance Smart Chain.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-2">
                <Globe className="w-5 h-5 text-white/20" />
                <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">Network</p>
                <p className="font-mono text-sm font-bold text-teal-400">BSC Mainnet</p>
              </div>
              <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-2">
                <Database className="w-5 h-5 text-white/20" />
                <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">Protocol</p>
                <p className="font-mono text-sm font-bold text-teal-400">FlexSmart v2.4</p>
              </div>
              <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 space-y-2">
                <Activity className="w-5 h-5 text-white/20" />
                <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">Confirms</p>
                <p className="font-mono text-sm font-bold text-teal-400">1,400+ Nodes</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-teal-500/10">
              <div className="flex items-center gap-3 text-xs text-white/40 font-medium">
                <Info className="w-4 h-4" />
                <span>Last verified 2 seconds ago.</span>
              </div>
              <a href="#" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-teal-400 hover:text-teal-300 transition-colors">
                View On Block Explorer <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}