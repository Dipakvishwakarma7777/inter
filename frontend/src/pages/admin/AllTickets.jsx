import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TicketFilters from "../../components/tickets/TicketFilters";
import TicketTable from "../../components/tickets/TicketTable";
import Loader from "../../components/common/Loader";
import useTickets from "../../hooks/useTickets";
export default function AllTickets() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
  });
  const { tickets, loading } = useTickets(filters);
  return (
    <>
      <DashboardHeader
        title="All Tickets"
        description="View every ticket in the system."
      />
      <TicketFilters
        filters={filters}
        onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
      />
      {loading ? <Loader /> : <TicketTable tickets={tickets} admin />}
    </>
  );
}
