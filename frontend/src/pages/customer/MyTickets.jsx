import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Button from "../../components/common/Button";
import TicketFilters from "../../components/tickets/TicketFilters";
import TicketTable from "../../components/tickets/TicketTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import useTickets from "../../hooks/useTickets";
import useDebounce from "../../hooks/useDebounce";
export default function MyTickets() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    category: "",
    page: 1,
  });
  const search = useDebounce(filters.search);
  const { tickets, meta, loading, error, refetch } = useTickets({
    ...filters,
    search,
    page: filters.page,
  });
  const change = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  return (
    <>
      <DashboardHeader
        title="My Tickets"
        description="View and track all your support requests."
        action={
          <Link to="/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        }
      />
      <TicketFilters filters={filters} onChange={change} />
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <>
          <TicketTable tickets={tickets} />
          <Pagination
            page={meta.page || filters.page}
            totalPages={meta.totalPages || 1}
            onChange={(p) => change("page", p)}
          />
        </>
      )}
    </>
  );
}
