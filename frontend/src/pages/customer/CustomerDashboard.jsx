import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, Ticket, TrendingUp } from "lucide-react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import RecentTickets from "../../components/dashboard/RecentTickets";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import useTickets from "../../hooks/useTickets";
import { useAuth } from "../../hooks/useAuth";
import dashboardService from "../../services/dashboardService";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { tickets, loading, error, refetch } = useTickets({ limit: 5 });
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

  if (loading || (!dashboard && !dashboardError)) return <Loader />;
  return (
    <>
      <DashboardHeader
        title={`Welcome, ${user?.name || "Customer"}`}
        description="Here is an overview of your support activity."
        action={
          <Link to="/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        }
      />
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {dashboardError && (
        <ErrorMessage
          message={dashboardError}
          onRetry={() => {
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
        <StatCard title="Total Tickets" value={dashboard?.tickets.total ?? 0} icon={Ticket} />
        <StatCard title="Open" value={dashboard?.tickets.open ?? 0} icon={Clock3} />
        <StatCard title="Resolved" value={dashboard?.tickets.resolved ?? 0} icon={CheckCircle2} />
        <StatCard title="Activity" value="Active" icon={TrendingUp} />
      </div>
      <section className="section-card">
        <div className="section-card-header">
          <div>
            <h2>Recent Tickets</h2>
            <p>Your latest support requests.</p>
          </div>
          <Link to="/tickets">View all</Link>
        </div>
        <RecentTickets tickets={tickets} />
      </section>
    </>
  );
}
