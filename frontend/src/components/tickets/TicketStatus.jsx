const labels = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  pending: "Pending"
};

export default function TicketStatus({ status }) {
  return <span className={`status status-${status}`}>{labels[status] || status}</span>;
}
