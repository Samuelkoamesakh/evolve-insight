import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, History, Settings, Shield, Home, Menu, X, FileBarChart } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report/a1", label: "Capability Report", icon: FileBarChart },
  { to: "/history", label: "Riwayat Asesmen", icon: History },
  { to: "/settings", label: "Pengaturan", icon: Settings },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card flex-col gap-1 p-4 transition-transform md:flex md:translate-x-0",
        open ? "flex translate-x-0" : "flex -translate-x-full md:translate-x-0"
      )}>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold tracking-tight">Kapable<span className="text-gradient">.ai</span></div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Capability Insights</div>
          </div>
        </Link>
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition">
          <Home className="size-4" /> Beranda
        </Link>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-1">Workspace</div>
        {nav.map((n) => {
          const active = pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              active ? "bg-gradient-soft text-foreground font-medium shadow-soft" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          );
        })}
        <div className="mt-auto p-3 rounded-xl bg-gradient-soft border border-border">
          <div className="text-sm font-medium">Coba asesmen baru</div>
          <p className="text-xs text-muted-foreground mt-1">Lihat perkembangan kemampuanmu.</p>
          <Link to="/assessment/goal" className="mt-3 inline-flex items-center justify-center w-full rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium py-2 shadow-glow">
            Mulai
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:pl-64 min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 h-14">
          <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-secondary">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-primary grid place-items-center"><Sparkles className="size-4 text-primary-foreground" /></div>
            <span className="font-display font-bold">Kapable.ai</span>
          </Link>
          <div className="size-9" />
        </header>
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}