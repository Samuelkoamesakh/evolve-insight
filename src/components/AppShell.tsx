import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Sparkles, LayoutDashboard, History, Settings, Shield, Home, Menu, X, FileBarChart,
  User as UserIcon, LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "Riwayat Asesmen", icon: History },
  { to: "/profile", label: "Profil", icon: UserIcon },
  { to: "/settings", label: "Pengaturan", icon: Settings },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate({ to: "/auth", replace: true });
  }

  const initials = (user?.user_metadata?.full_name || user?.email || "U").trim().charAt(0).toUpperCase();

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
        <div className="mt-auto space-y-3">
          <div className="p-3 rounded-xl bg-gradient-soft border border-border">
            <div className="text-sm font-medium">Coba asesmen baru</div>
            <p className="text-xs text-muted-foreground mt-1">Lihat perkembangan kemampuanmu.</p>
            <Link to="/assessment/goal" className="mt-3 inline-flex items-center justify-center w-full rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium py-2 shadow-glow">
              Mulai
            </Link>
          </div>
          {user && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-2.5">
              <div className="size-9 shrink-0 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-semibold text-sm">{initials}</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate">{user.user_metadata?.full_name || user.email}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
              </div>
              <button onClick={handleSignOut} aria-label="Keluar" className="size-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition">
                <LogOut className="size-4" />
              </button>
            </div>
          )}
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
          <Link to="/profile" aria-label="Profil" className="size-9 grid place-items-center rounded-lg bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow">
            {initials}
          </Link>
        </header>
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}