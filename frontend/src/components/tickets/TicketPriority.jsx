const labels = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };

export default function TicketPriority({ priority }) {
  return <span className={`priority priority-${priority}`}>{labels[priority] || priority}</span>;
}
