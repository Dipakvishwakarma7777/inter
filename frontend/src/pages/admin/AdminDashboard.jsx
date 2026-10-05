import { useEffect, useState } from "react";
import {
  Users,
  UserRoundCog,
  Ticket,
  FolderKanban,
  AlertTriangle,
} from "lucide-react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    adminService
      .getDashboard()
      .then((r) => setData(r.data))
      .catch(() => {});
  }, []);
  if (!data) return <Loader />;
  return (
    <>
      <DashboardHeader
        title="Admin Dashboard"
        description="Manage the complete support operation."
      />
      <div className="stats-grid">
        <StatCard title="Users" value={data.users} icon={Users} />
        <StatCard title="Agents" value={data.agents} icon={UserRoundCog} />
        <StatCard title="Tickets" value={data.tickets} icon={Ticket} />
        <StatCard
          title="Categories"
          value={data.categories}
          icon={FolderKanban}
        />
        <StatCard title="Open" value={data.open} icon={Ticket} />
        <StatCard
          title="SLA Breaches"
          value={data.breached}
          icon={AlertTriangle}
        />
      </div>
    </>
  );
}
