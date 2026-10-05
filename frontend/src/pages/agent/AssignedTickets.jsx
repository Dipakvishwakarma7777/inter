import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TicketFilters from "../../components/tickets/TicketFilters";
import TicketTable from "../../components/tickets/TicketTable";
import Loader from "../../components/common/Loader";
import useTickets from "../../hooks/useTickets";
export default function AssignedTickets() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
  });
  const { tickets, loading } = useTickets({ ...filters, assignedTo: "me" });
  return (
    <>
      <DashboardHeader
        title="Assigned Tickets"
        description="Work on tickets assigned to you."
      />
      <TicketFilters
        filters={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
      />
      {loading ? <Loader /> : <TicketTable tickets={tickets} />}
    </>
  );
}
