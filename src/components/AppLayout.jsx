import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ScanText, LayoutDashboard, FileText, Scale, LifeBuoy, User, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Analyze", icon: ScanText, end: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/saved-reports", label: "Reports", icon: FileText },
  { to: "/jurisdiction-guide", label: "Guide", icon: Scale },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

export default function AppLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    await base44.auth.logout();
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
      isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted"
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <ScanText className="w-5 h-5 text-background" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight">LeaseLens</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Clause analyzer</p>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <NavLink to="/profile" className={linkClass}>
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </NavLink>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}