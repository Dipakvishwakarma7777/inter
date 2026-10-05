import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  message = "There is no data to display.",
  action
}) {
  return (
    <div className="empty-state">
      <Inbox size={42} />
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
