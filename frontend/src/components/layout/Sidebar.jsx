import {
  BarChart3, BookOpen, FolderKanban, LayoutDashboard, LogOut,
  Settings, Ticket, Users, UserRoundCog, X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const common = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "My Tickets", icon: Ticket }
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const links = [...common, { to: "/knowledge", label: "Knowledge Base", icon: BookOpen }, { to: "/ai", label: "AI Assistant", icon: BarChart3 }];
  if (user?.role === "agent") links.push({ to: "/agent/tickets", label: "Assigned Tickets", icon: FolderKanban });
  if (user?.role === "admin") {
    links.push(
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/agents", label: "Agents", icon: UserRoundCog },
      { to: "/admin/tickets", label: "All Tickets", icon: Ticket },
      { to: "/admin/categories", label: "Categories", icon: BookOpen },
      { to: "/analytics", label: "Analytics", icon: BarChart3 }
    );
  }

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">SD</div>
        <strong>SupportDesk</strong>
        <button className="mobile-close icon-button" onClick={onClose}><X size={19} /></button>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
            <Icon size={19} /> <span>{label}</span>
          </NavLink>
        ))}
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`} onClick={onClose}>
          <Settings size={19} /> <span>Profile</span>
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={logout}><LogOut size={18} /> Logout</button>
    </aside>
  );
}
