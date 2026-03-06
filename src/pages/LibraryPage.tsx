import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Twitter, BookOpen, Loader2, Library as LibraryIcon, ShieldCheck, User as UserIcon, Share2, Eye } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import type { DigitalBook } from '@shared/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeb3Store } from '@/store/useWeb3Store';
export function LibraryPage() {
  const isConnected = useWeb3Store(s => s.isConnected);
  const address = useWeb3Store(s => s.address);
  const connect = useWeb3Store(s => s.connect);
  const [ownedBookIds, setOwnedBookIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<DigitalBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!isConnected || !address) return;
      setIsLoading(true);
      try {
        const [libRes, catRes] = await Promise.all([
          fetch(`/api/library/${address.toLowerCase()}`),
          fetch('/api/books')
        ]);
        const libData = await libRes.json();
        const catData = await catRes.json();
        if (isMounted) {
          if (libData.success) setOwnedBookIds(libData.data || []);
          if (catData.success) setCatalog(catData.data || []);
        }
      } catch (err) {
        console.error("Library sync failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [isConnected, address]);
  const ownedBooks = useMemo(() => {
    return catalog.filter(b => ownedBookIds.includes(b.id));
  }, [ownedBookIds, catalog]);
  const shareOnX = (bookTitle: string) => {
    const text = encodeURIComponent(`Just unlocked "${bookTitle}" on CryptoCampus! 📚💎 #Web3 #BSC #FlexSmart`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  if (!isConnected) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-8 animate-fade-in">
          <div className="w-32 h-32 glass-panel rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors" />
            <LibraryIcon className="w-12 h-12 text-teal-400 relative z-10" />
          </div>
          <div className="space-y-3">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Private Vault</h2>
            <p className="text-white/40 max-w-sm mx-auto text-lg leading-relaxed font-medium">
              Connect your wallet to synchronize your decentralized asset collection.
            </p>
          </div>
          <Button onClick={() => connect()} className="btn-premium h-14 px-12 text-lg">
            Authorize Wallet
          </Button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="space-y-20">
        {/* User Profile Header */}
        <header className="relative w-full rounded-[3rem] overflow-hidden glass-panel p-10 border-white/5">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-xl shadow-teal-500/20 border-4 border-white/5">
              <UserIcon className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black tracking-tight uppercase italic">{address?.slice(0, 6)}...{address?.slice(-4)}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-black uppercase tracking-widest text-white/40">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  Verified Holder
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  {ownedBooks.length} Assets Owned
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 px-6 py-2 rounded-2xl text-xs font-black tracking-widest uppercase">
                Premium Account
              </Badge>
              <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Member Since 2024</p>
            </div>
          </div>
        </header>
        {/* Assets Grid */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white/40">Your Collection</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
              <p className="text-white/30 font-black text-xs uppercase tracking-[0.5em] animate-pulse">Syncing Blockchain Data</p>
            </div>
          ) : ownedBooks.length === 0 ? (
            <div className="text-center py-32 glass-panel rounded-[3rem] border-dashed flex flex-col items-center gap-8 max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white/20" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black uppercase italic tracking-tight text-white/60">Your vault is empty.</p>
                <p className="text-white/30 font-medium">Head over to the marketplace to start your collection.</p>
              </div>
              <Button asChild className="btn-premium px-10 h-12">
                <a href="/">Browse Marketplace</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ownedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card overflow-hidden flex flex-col h-full group transition-all duration-500 rounded-[2.5rem] hover:-translate-y-2">
                    <div className="relative p-6 flex gap-6">
                      <div className="relative shrink-0">
                        <img 
                          src={book.imageUrl} 
                          className="w-32 h-44 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700" 
                          alt="" 
                        />
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center border-4 border-[#1e1e1e] shadow-xl">
                          <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <Badge className="bg-teal-500/10 text-teal-400 border-none mb-3 text-[9px] font-black uppercase tracking-[0.2em]">Verified Asset</Badge>
                          <CardTitle className="text-2xl font-black leading-tight uppercase italic group-hover:text-teal-400 transition-colors line-clamp-2">{book.title}</CardTitle>
                          <p className="text-xs text-white/40 font-bold mt-2 uppercase tracking-widest">{book.author}</p>
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button className="bg-white text-black hover:bg-teal-500 hover:text-white flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2">
                             <Eye className="w-4 h-4" /> Read
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/5 hover:border-blue-400/50 hover:bg-blue-400/10 hover:text-blue-400 h-11 w-11 p-0 rounded-xl transition-all"
                            onClick={() => shareOnX(book.title)}
                          >
                            <Twitter className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="px-8 py-4 border-t border-white/5 bg-black/20">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                        <span className="text-white/20">Asset ID</span>
                        <span className="text-teal-500/60">{book.id.toUpperCase()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}