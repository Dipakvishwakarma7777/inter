import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, CheckCircle2, Ticket, AlertTriangle } from "lucide-react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import RecentTickets from "../../components/dashboard/RecentTickets";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import useTickets from "../../hooks/useTickets";
import dashboardService from "../../services/dashboardService";
export default function AgentDashboard() {
  const { tickets, loading: ticketsLoading, error, refetch } = useTickets({ assignedTo: "me", limit: 10 });
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  useEffect(() => {
    dashboardService
      .get()
      .then((response) => setDashboard(response.data))
      .catch((err) =>
        setDashboardError(
          err.response?.data?.message || "Unable to load dashboard.",
        ),
      );
  }, []);
  if (ticketsLoading || (!dashboard && !dashboardError)) return <Loader />;
  return (
    <>
      <DashboardHeader
        title="Agent Dashboard"
        description="Monitor and work through your assigned support queue."
        action={
          <Link to="/agent/tickets">
            <Button>View Queue</Button>
          </Link>
        }
      />
      {(error || dashboardError) && (
        <ErrorMessage
          message={error || dashboardError}
          onRetry={() => {
            refetch();
            setDashboardError("");
            dashboardService
              .get()
              .then((response) => setDashboard(response.data))
              .catch((err) =>
                setDashboardError(
                  err.response?.data?.message || "Unable to load dashboard.",
                ),
              );
          }}
        />
      )}
      <div className="stats-grid">
        <StatCard title="Assigned" value={dashboard?.tickets.total ?? 0} icon={Ticket} />
        <StatCard
          title="In Progress"
          value={dashboard?.tickets.inProgress ?? 0}
          icon={Clock3}
        />
        <StatCard
          title="Urgent"
          value={dashboard?.tickets.urgent ?? 0}
          icon={AlertTriangle}
        />
        <StatCard
          title="Resolved"
          value={dashboard?.tickets.resolved ?? 0}
          icon={CheckCircle2}
        />
      </div>
      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h2>Recent Assigned Tickets</h2>
            <p>Tickets currently in your queue.</p>
          </div>
        </div>
        <RecentTickets tickets={tickets} />
      </section>
    </>
  );
}
