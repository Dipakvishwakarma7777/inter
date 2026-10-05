import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TicketForm from "../../components/tickets/TicketForm";
import ticketService from "../../services/ticketService";
export default function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (data) => {
    setLoading(true);
    try {
      const response = await ticketService.createTicket(data);
      navigate(
        `/tickets/${response.data?._id || response.ticket?._id || response._id || response.id}`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create ticket.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <DashboardHeader
        title="Create Ticket"
        description="Tell us what you need help with."
      />
      <div className="narrow-content">
        {error && <div className="alert alert-error">{error}</div>}
        <TicketForm onSubmit={submit} loading={loading} />
      </div>
    </>
  );
}
