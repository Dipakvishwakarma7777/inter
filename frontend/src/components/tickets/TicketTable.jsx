import { Link } from "react-router-dom";
import TicketStatus from "./TicketStatus";
import TicketPriority from "./TicketPriority";
import EmptyState from "../common/EmptyState";

export default function TicketTable({ tickets = [], admin = false }) {
  if (!tickets.length) {
    return <EmptyState title="No tickets found" message="Try changing your filters or create a new ticket." />;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Subject</th>{admin && <th>Customer</th>}<th>Priority</th><th>Status</th><th>Category</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id || ticket.id}>
              <td>#{String(ticket._id || ticket.id).slice(-6)}</td>
              <td><strong>{ticket.title}</strong></td>
              {admin && <td>{ticket.createdBy?.name || ticket.createdBy?.email || "—"}</td>}
              <td><TicketPriority priority={ticket.priority} /></td>
              <td><TicketStatus status={ticket.status} /></td>
              <td>{ticket.category?.name || ticket.category || "General"}</td>
              <td><Link className="table-link" to={`/tickets/${ticket._id || ticket.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
