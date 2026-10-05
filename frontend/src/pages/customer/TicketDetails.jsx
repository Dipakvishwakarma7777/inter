import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Paperclip, Trash2 } from "lucide-react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import MessageBox from "../../components/tickets/MessageBox";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import TicketStatus from "../../components/tickets/TicketStatus";
import TicketPriority from "../../components/tickets/TicketPriority";
import ticketService from "../../services/ticketService";
import { formatDateTime } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";
import { io } from "socket.io-client";
export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null),
    [comments, setComments] = useState([]),
    [attachments, setAttachments] = useState([]),
    [loading, setLoading] = useState(true),
    [sending, setSending] = useState(false),
    [error, setError] = useState("");
  const load = async () => {
    try {
      const [t, c, a] = await Promise.all([
        ticketService.getTicket(id),
        ticketService.getComments(id),
        ticketService.getAttachments(id),
      ]);
      setTicket(t.data);
      setComments(c.data || []);
      setAttachments(a.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load ticket.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    const token = localStorage.getItem("supportdesk_token");
    if (!token) return;
    const base =
      (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "") ||
      window.location.origin;
    const socket = io(base, { auth: { token } });
    socket.emit("ticket:join", id);
    socket.on("comment:created", (c) => setComments((x) => [...x, c]));
    socket.on("ticket:updated", (t) => setTicket(t));
    return () => {
      socket.emit("ticket:leave", id);
      socket.disconnect();
    };
  }, [id]);
  const send = async (message) => {
    setSending(true);
    try {
      await ticketService.addComment(id, message);
      const r = await ticketService.getComments(id);
      setComments(r.data || []);
    } finally {
      setSending(false);
    }
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const r = await ticketService.uploadAttachment(id, file);
      setAttachments((a) => [r.data, ...a]);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
    e.target.value = "";
  };
  const download = async (attachment) => {
    setError("");
    try {
      await ticketService.downloadAttachment(attachment._id, attachment.fileName);
    } catch (err) {
      setError(err.response?.data?.message || "Download failed");
    }
  };
  if (loading) return <Loader />;
  if (error && !ticket) return <div className="alert alert-error">{error}</div>;
  return (
    <>
      <DashboardHeader
        title={ticket.title}
        description={`Ticket #${String(ticket._id).slice(-6)}`}
        action={
          <Link to="/tickets" className="btn btn-secondary">
            <ArrowLeft size={17} /> Back
          </Link>
        }
      />
      <div className="ticket-detail-grid">
        <section className="section-card">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="ticket-detail-meta">
            <TicketStatus status={ticket.status} />
            <TicketPriority priority={ticket.priority} />
            <span>{ticket.category?.name || "General"}</span>
            {ticket.slaDueAt && (
              <span>SLA due {formatDateTime(ticket.slaDueAt)}</span>
            )}
          </div>
          <p className="ticket-description">{ticket.description}</p>
          <h3>Conversation</h3>
          <div className="conversation">
            {comments.map((c) => (
              <div className="message" key={c._id}>
                <div>
                  <strong>{c.user?.name || "User"}</strong>
                  <small>{formatDateTime(c.createdAt)}</small>
                </div>
                <p>{c.message}</p>
              </div>
            ))}
          </div>
          <MessageBox onSend={send} loading={sending} />
          <div className="message-box">
            <h3>Attachments</h3>
            <input
              type="file"
              onChange={upload}
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.zip,.docx"
            />
            <div className="conversation">
              {attachments.map((a) => (
                <div className="message" key={a._id}>
                  <div>
                    <span>
                      <Paperclip size={14} /> {a.fileName}
                    </span>
                    <small>{Math.round(a.fileSize / 1024)} KB</small>
                  </div>
                  <div>
                    <button
                      className="table-link"
                      onClick={() => download(a)}
                    >
                      Download
                    </button>
                    {(user?.role === "admin" ||
                      String(a.uploadedBy?._id || a.uploadedBy) ===
                        String(user?.id || user?._id)) && (
                      <button
                        className="icon-button"
                        onClick={async () => {
                          await ticketService.deleteAttachment(a._id);
                          setAttachments((x) =>
                            x.filter((y) => y._id !== a._id),
                          );
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="section-card">
          <h3>Ticket information</h3>
          <dl className="detail-list">
            <dt>Status</dt>
            <dd>
              <TicketStatus status={ticket.status} />
            </dd>
            <dt>Priority</dt>
            <dd>
              <TicketPriority priority={ticket.priority} />
            </dd>
            <dt>Created</dt>
            <dd>{formatDateTime(ticket.createdAt)}</dd>
            <dt>Updated</dt>
            <dd>{formatDateTime(ticket.updatedAt)}</dd>
            <dt>Assigned Agent</dt>
            <dd>{ticket.assignedTo?.name || "Not assigned"}</dd>
            <dt>SLA</dt>
            <dd>
              {ticket.slaBreached
                ? "Breached"
                : ticket.slaDueAt
                  ? formatDateTime(ticket.slaDueAt)
                  : "—"}
            </dd>
          </dl>
        </aside>
      </div>
    </>
  );
}
