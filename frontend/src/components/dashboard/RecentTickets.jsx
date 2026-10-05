import { Link } from "react-router-dom";
import TicketStatus from "../tickets/TicketStatus";
import EmptyState from "../common/EmptyState";

export default function RecentTickets({ tickets = [] }) {
  if (!tickets.length)
    return (
      <EmptyState
        title="No recent tickets"
        message="Your recent tickets will appear here."
      />
    );
  return (
    <div className="recent-list">
      {tickets.slice(0, 5).map((ticket) => (
        <Link
          to={`/tickets/${ticket._id || ticket.id}`}
          className="recent-item"
          key={ticket._id || ticket.id}
        >
          <div>
            <strong>{ticket.title}</strong>
            <small>#{String(ticket._id || ticket.id).slice(-6)}</small>
          </div>
          <TicketStatus status={ticket.status} />
        </Link>
      ))}
    </div>
  );
}
