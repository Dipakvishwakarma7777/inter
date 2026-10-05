import { Link } from "react-router-dom";
import TicketStatus from "./TicketStatus";
import TicketPriority from "./TicketPriority";

export default function TicketCard({ ticket }) {
  return (
    <Link to={`/tickets/${ticket._id || ticket.id}`} className="ticket-card">
      <div className="ticket-card-top">
        <span className="ticket-id">#{String(ticket._id || ticket.id).slice(-6)}</span>
        <TicketStatus status={ticket.status} />
      </div>
      <h3>{ticket.title}</h3>
      <p>{ticket.description || "No description provided."}</p>
      <div className="ticket-card-bottom">
        <TicketPriority priority={ticket.priority} />
        <small>{ticket.category?.name || ticket.category || "General"}</small>
      </div>
    </Link>
  );
}
