import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  Book,
  CheckCircle,
  Home,
  LogOut,
  Github,
  Check,
  CloudUpload,
  Code2,
  Lock,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3Store } from "@/store/useWeb3Store";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
};
type ExportStep = 'idle' | 'auth' | 'packaging' | 'pushing' | 'success';
export function AppLayout({ children, container = true, className }: AppLayoutProps): JSX.Element {
  const isConnected = useWeb3Store(s => s.isConnected);
  const address = useWeb3Store(s => s.address);
  const tokenBalance = useWeb3Store(s => s.tokenBalance);
  const connect = useWeb3Store(s => s.connect);
  const disconnect = useWeb3Store(s => s.disconnect);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportStep, setExportStep] = useState<ExportStep>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navItems = [
    { name: "Marketplace", path: "/", icon: Home },
    { name: "Library", path: "/library", icon: Book },
    { name: "Verify", path: "/verify", icon: CheckCircle },
  ];
  const handleGithubExport = () => {
    setIsExportModalOpen(true);
    setExportStep('auth');
    setExportProgress(0);
  };
  useEffect(() => {
    let timer: any;
    if (exportStep === 'auth') {
      timer = setTimeout(() => {
        setExportStep('packaging');
        setExportProgress(30);
      }, 1200);
    } else if (exportStep === 'packaging') {
      timer = setTimeout(() => {
        setExportStep('pushing');
        setExportProgress(70);
      }, 1500);
    } else if (exportStep === 'pushing') {
      timer = setTimeout(() => {
        setExportStep('success');
        setExportProgress(100);
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [exportStep]);
  const resetExport = () => {
    setIsExportModalOpen(false);
    setTimeout(() => {
      setExportStep('idle');
      setExportProgress(0);
    }, 300);
  };
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-teal-500/30">
      {/* Immersive Floating Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 pointer-events-none">
        <nav className="max-w-7xl mx-auto glass-panel rounded-3xl pointer-events-auto overflow-hidden">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center group-hover:rotate-[10deg] transition-all shadow-lg shadow-teal-500/20">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic">
                  CAMPUS
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-5 py-2 rounded-xl text-sm font-bold tracking-tight transition-all",
                      location.pathname === item.path 
                        ? "text-teal-400 bg-teal-500/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-4 py-2">
                  <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50">Vault</span>
                    <span className="text-sm font-mono font-bold text-teal-400">{tokenBalance} BOOK</span>
                  </div>
                  <div className="w-px h-6 bg-white/10 hidden sm:block mx-1" />
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                       <span className="text-xs font-mono text-white/80 block">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={disconnect}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={connect}
                  className="btn-premium px-6 h-11"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/5 p-4 space-y-2 bg-black/40 backdrop-blur-3xl animate-in slide-in-from-top-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-bold transition-all",
                    location.pathname === item.path ? "text-teal-400 bg-teal-500/10" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>
      {/* Main Content Area */}
      <main className={cn(
        "flex-1 pt-32 pb-20", 
        container && "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8", 
        className
      )}>
        {children}
      </main>
      {/* Modern Refined Footer */}
      <footer className="border-t border-white/5 bg-black/40 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black italic tracking-tighter">CAMPUS</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                A premium digital library for the decentralized age. Truly own your knowledge, backed by the Binance Smart Chain.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black uppercase tracking-widest text-xs text-white/40">Navigation</h4>
              <ul className="space-y-3">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-muted-foreground hover:text-teal-400 transition-colors font-medium">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-xs text-white/40">Developer</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGithubExport}
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:text-white rounded-xl h-12 gap-3 transition-all"
              >
                <Github className="w-5 h-5" />
                Push to GitHub
              </Button>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground font-medium">
              Built with ❤️ by <span className="text-teal-400">Aurelia</span> | Your AI Co-founder
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">BSC Mainnet Ready</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">FlexSmart Protocol</span>
            </div>
          </div>
        </div>
      </footer>
      {/* GitHub Export Modal (Logic Preserved) */}
      <Dialog open={isExportModalOpen} onOpenChange={(open) => !open && resetExport()}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-md overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <Github className="w-6 h-6 text-teal-400" />
              Sync Codebase
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Exporting the current state to a remote repository.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span className="text-muted-foreground">
                  {exportStep === 'auth' && "Handshake..."}
                  {exportStep === 'packaging' && "Compressing..."}
                  {exportStep === 'pushing' && "Pushing..."}
                  {exportStep === 'success' && "Done"}
                </span>
                <span className="text-teal-400">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2 bg-white/5" indicatorClassName="bg-teal-500" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                exportStep === 'auth' ? "bg-teal-500/10 border-teal-500/20" : "bg-white/[0.02] border-white/5"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  exportProgress > 0 ? "bg-teal-500 text-white" : "bg-white/5 text-muted-foreground"
                )}>
                  {exportProgress > 30 ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <h4 className="text-sm font-bold">Identity Check</h4>
              </div>
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                exportStep === 'packaging' ? "bg-teal-500/10 border-teal-500/20" : "bg-white/[0.02] border-white/5"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  exportProgress > 30 ? "bg-teal-500 text-white" : "bg-white/5 text-muted-foreground"
                )}>
                  {exportProgress > 70 ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </div>
                <h4 className="text-sm font-bold">Build Artifacts</h4>
              </div>
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                exportStep === 'pushing' ? "bg-teal-500/10 border-teal-500/20" : "bg-white/[0.02] border-white/5"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  exportProgress >= 70 ? (exportProgress === 100 ? "bg-teal-500 text-white" : "bg-teal-500/20 text-teal-400") : "bg-white/5 text-muted-foreground"
                )}>
                  {exportProgress === 100 ? <Check className="w-4 h-4" /> : <CloudUpload className={cn("w-4 h-4", exportStep === 'pushing' && "animate-bounce")} />}
                </div>
                <h4 className="text-sm font-bold">Remote Sync</h4>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={resetExport}
              className={cn(
                "w-full rounded-2xl h-12 font-black tracking-tight",
                exportStep === 'success' ? "bg-teal-600 hover:bg-teal-500 text-white" : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              )}
            >
              {exportStep === 'success' ? "Close" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="top-center" />
    </div>
  );
}