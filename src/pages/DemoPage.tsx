import { useEffect, useState, useCallback } from 'react'
import { Sparkles, BookOpen, Library, ExternalLink, Share2, Wallet, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from '@/components/ui/sonner'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Configuration constants for the requested theme/network
const TOKEN_ADDRESS = '0x849868846635300B4413e85adcFD0a057c675B8e'
const REDEEM_DESTINATION = '0x1234567890123456789012345678901234567890'
const NETWORK_NAME = 'BSC & FlexSmart Testnet'

interface Book {
  id: string
  title: string
  author: string
  image: string
  price: string
  unlocked: boolean
}

const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'The Ethereal Web', author: 'Satoshi Nakamoto', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&h=300', price: '1 BOOK', unlocked: true },
  { id: '2', title: 'Smart Contract Zen', author: 'Vitalik Buterin', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&h=300', price: '1 BOOK', unlocked: false },
  { id: '3', title: 'Scalable Futures', author: 'Aurelia Flex', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&h=300', price: '1 BOOK', unlocked: false },
]

export function DemoPage() {
  const [balance, setBalance] = useState('12.50')
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null)
  const [view, setView] = useState<'verify' | 'library'>('verify')

  // Share on X Handler
  const shareOnX = (bookTitle: string) => {
    const text = encodeURIComponent(`Just unlocked a new book "${bookTitle}" using FlexSmart! #CryptoCampus`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }

  // Simulated Redemption Flow
  const handleRedeem = useCallback(async (bookId: string) => {
    setIsRedeeming(bookId)
    try {
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, unlocked: true } : b))
      setBalance(prev => (parseFloat(prev) - 1).toFixed(2))
      
      toast.success('Book unlocked successfully!', {
        description: `1 BOOK token sent to ${REDEEM_DESTINATION.slice(0, 6)}...`,
      })
    } catch (err: any) {
      toast.error('Transaction failed: ' + err.message)
    } finally {
      setIsRedeeming(null)
    }
  }, [])

  return (
    <AppLayout>
      <main className="min-h-screen bg-[#04111d] text-white p-4 md:p-8 font-sans">
        <Toaster richColors position="top-center" />

        {/* Hero Section */}
        <header className="max-w-6xl mx-auto mb-12 text-center space-y-6 pt-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-2xl bg-[#2081e2] flex items-center justify-center shadow-[0_0_20px_rgba(32,129,226,0.4)] animate-pulse">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">FlexSmart Library</h1>
          <p className="text-[#8a939b] text-lg max-w-2xl mx-auto">
            The premier decentralized bookstore on {NETWORK_NAME}. 
            Redeem your <code className="text-[#00f2ff]">{TOKEN_ADDRESS.slice(0, 6)}...</code> tokens for digital knowledge.
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              variant={view === 'verify' ? 'default' : 'outline'}
              className={view === 'verify' ? "bg-[#2081e2] hover:bg-[#1868b7]" : "border-[#2081e2] text-[#2081e2]"}
              onClick={() => setView('verify')}
            >
              Verify Access
            </Button>
            <Button 
              variant={view === 'library' ? 'default' : 'outline'}
              className={view === 'library' ? "bg-[#2081e2] hover:bg-[#1868b7]" : "border-[#2081e2] text-[#2081e2]"}
              onClick={() => setView('library')}
            >
              My Library
            </Button>
          </div>
        </header>

        {/* Verification View */}
        {view === 'verify' && (
          <section className="max-w-xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-[#262b2f] border-[#353840] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#00f2ff]" />
                  Token Verification
                </CardTitle>
                <CardDescription className="text-[#8a939b]">
                  Verify your BSC wallet balance to access the library.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[#04111d] border border-[#353840] flex justify-between items-center">
                  <div>
                    <p className="text-xs text-[#8a939b] uppercase">Your Balance</p>
                    <p className="text-2xl font-bold text-[#00f2ff]">{balance} BOOK</p>
                  </div>
                  <Badge variant="outline" className="text-[#00f2ff] border-[#00f2ff]">Verified</Badge>
                </div>
                <div className="text-sm text-[#8a939b] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Connected to {NETWORK_NAME}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#2081e2] hover:bg-[#1868b7]" onClick={() => setView('library')}>
                  Enter Library
                </Button>
              </CardFooter>
            </Card>
          </section>
        )}

        {/* Library Dashboard */}
        {view === 'library' && (
          <section className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Library className="w-6 h-6 text-[#00f2ff]" />
                Available Collections
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <Card 
                  key={book.id} 
                  className="bg-[#262b2f] border-[#353840] text-white overflow-hidden group hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 animate-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    {!book.unlocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          className="bg-[#2081e2] hover:bg-[#1868b7]"
                          onClick={() => handleRedeem(book.id)}
                          disabled={isRedeeming === book.id}
                        >
                          {isRedeeming === book.id ? 'Processing...' : `Redeem for ${book.price}`}
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-[#8a939b] font-medium uppercase tracking-wider">{book.author}</span>
                      {book.unlocked && <Badge className="bg-green-500/20 text-green-500 border-none">Owned</Badge>}
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#2081e2] transition-colors">{book.title}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    {book.unlocked ? (
                      <>
                        <Button variant="secondary" className="flex-1 bg-[#353840] hover:bg-[#4c505c] text-white">
                          Read Now
                        </Button>
                        <Button size="icon" variant="outline" className="border-[#353840] hover:bg-[#353840]" onClick={() => shareOnX(book.title)}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-transparent border border-[#2081e2] text-[#2081e2] hover:bg-[#2081e2] hover:text-white"
                        onClick={() => handleRedeem(book.id)}
                        disabled={isRedeeming === book.id}
                      >
                        {isRedeeming === book.id ? 'Redeeming...' : `Unlock for ${book.price}`}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-[#353840] text-center text-[#8a939b] pb-10">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
              Docs <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
              FlexSmart Scan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-sm">Powered by Cloudflare & Binance Smart Chain</p>
        </footer>
      </main>
    </AppLayout>
  )
}
//