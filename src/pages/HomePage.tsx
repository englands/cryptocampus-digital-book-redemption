import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Search, ShieldCheck, Flame, Layers } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import type { DigitalBook } from '@shared/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useWeb3Store } from '@/store/useWeb3Store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
export function HomePage() {
  const isConnected = useWeb3Store(s => s.isConnected);
  const address = useWeb3Store(s => s.address);
  const transferToken = useWeb3Store(s => s.transferToken);
  const connect = useWeb3Store(s => s.connect);
  const [books, setBooks] = useState<DigitalBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const json = await response.json();
        if (json.success) {
          setBooks(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch catalog:", err);
        toast.error("Network synchronization failed.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);
  const handleRedeemClick = (book: DigitalBook) => {
    if (!isConnected) {
      toast.info("Wallet Connection Required", {
        description: "Connect your BSC wallet to unlock assets.",
        action: { label: "Connect", onClick: () => connect() }
      });
      return;
    }
    setSelectedBook(book);
  };
  const confirmRedemption = async () => {
    if (!selectedBook || !address) return;
    setIsRedeeming(true);
    try {
      const txHash = await transferToken("1.0");
      if (txHash) {
        const response = await fetch(`/api/library/${address.toLowerCase()}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId: selectedBook.id })
        });
        if (response.ok) {
          toast.success(`Asset Unlocked!`, {
            description: `${selectedBook.title} is now in your vault.`,
            action: {
              label: "Go to Library",
              onClick: () => window.location.href = "/library"
            }
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Transaction Aborted", { description: err.message || "Failed to confirm." });
    } finally {
      setIsRedeeming(false);
      setSelectedBook(null);
    }
  };
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <AppLayout container={false}>
      {/* Premium Split Hero Section */}
      <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-center overflow-hidden px-4 sm:px-8 lg:px-20 gap-16 pb-20">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 overflow-hidden pointer-events-none">
           <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-teal-500/30 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px]" />
        </div>
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left pt-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-teal-500/20 mb-6">
              <Flame className="w-4 h-4 text-teal-400 fill-teal-400" />
              <span className="text-xs font-black uppercase tracking-widest text-teal-400">Live on FlexSmart v2</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
              Digital <br /> <span className="text-gradient">Acquisitions</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              The first truly decentralized library. Collect, verify, and read premium assets on the blockchain.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-10">
              <Button size="lg" className="btn-premium h-16 px-10 text-xl group">
                Browse Assets
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-4 px-6 text-white/40">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">5k+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Holders</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">12k+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Assets</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="flex-1 relative w-full aspect-square max-w-[600px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20 rounded-[4rem] blur-3xl" />
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=1200&fit=crop" 
            alt="Premium Asset"
            className="relative w-full h-full object-cover rounded-[3rem] border border-white/10 shadow-2xl rotate-[3deg] hover:rotate-0 transition-all duration-700"
          />
          <div className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-[2rem] max-w-xs animate-float">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-white" />
               </div>
               <span className="font-black italic">VERIFIED ASSET</span>
             </div>
             <p className="text-xs text-white/60 font-medium">This asset is cryptographic proof of knowledge ownership on the FlexSmart protocol.</p>
          </div>
        </motion.div>
      </section>
      {/* Marketplace Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-24" id="marketplace">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Marketplace</h2>
            <div className="h-1.5 w-24 bg-teal-500 rounded-full" />
            <p className="text-white/40 font-medium text-lg">Curated digital assets for the intellectual elite.</p>
          </div>
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white/[0.05] transition-all font-medium text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-[2rem] bg-white/5" />
                <Skeleton className="h-8 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
              </div>
            ))
          ) : (
            filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full flex flex-col overflow-hidden group hover:-translate-y-3 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 rounded-[2.5rem]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <Button 
                         onClick={() => handleRedeemClick(book)}
                         className="w-full bg-white text-black hover:bg-teal-500 hover:text-white rounded-2xl font-black uppercase tracking-widest h-12 transition-all"
                       >
                         Instant Redeem
                       </Button>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/60 backdrop-blur-xl border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{book.category}</Badge>
                    </div>
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl font-bold line-clamp-1">{book.title}</CardTitle>
                      <div className="flex items-center gap-1.5 text-teal-400 font-black text-sm">
                        <Flame className="w-4 h-4 fill-teal-400" />
                        {book.price}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{book.author}</p>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 flex-1">
                    <p className="text-sm text-white/50 line-clamp-2 leading-relaxed font-medium">
                      {book.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                      onClick={() => handleRedeemClick(book)}
                      variant="ghost"
                      className="w-full text-xs font-black uppercase tracking-[0.2em] border-t border-white/5 rounded-none h-10 hover:text-teal-400 hover:bg-transparent"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>
      {/* Redemption Flow Modal */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-md rounded-[3rem]">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-2">
              <Layers className="w-6 h-6 text-teal-400" />
            </div>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Authorize Vault</DialogTitle>
            <DialogDescription className="text-white/40 font-medium">
              You are authorizing a transfer of 1.0 BOOK token to the FlexSmart library pool.
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 my-6">
              <img src={selectedBook.imageUrl} className="w-20 h-24 rounded-2xl object-cover shadow-xl" alt="" />
              <div className="space-y-1">
                <h4 className="font-black text-lg line-clamp-1">{selectedBook.title}</h4>
                <p className="text-xs text-white/40 font-bold uppercase">{selectedBook.author}</p>
                <div className="mt-2 text-teal-400 font-mono text-sm font-black tracking-widest">1.00 BOOK</div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              disabled={isRedeeming}
              onClick={confirmRedemption}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black h-14 rounded-2xl text-lg uppercase tracking-widest shadow-lg shadow-teal-500/20"
            >
              {isRedeeming ? "Confirming..." : "Confirm Secure Redemption"}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-12 text-white/30 hover:text-white"
              onClick={() => setSelectedBook(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}