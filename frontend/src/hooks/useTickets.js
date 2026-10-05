import { useCallback, useEffect, useState } from "react";
import ticketService from "../services/ticketService";

export default function useTickets(params = {}) {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketService.getTickets(params);
      setTickets(response.tickets || response.data || response || []);
      setMeta(
        response.meta || {
          page: 1,
          totalPages: 1,
          total: (response.tickets || []).length,
        },
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, meta, loading, error, refetch: fetchTickets };
}
