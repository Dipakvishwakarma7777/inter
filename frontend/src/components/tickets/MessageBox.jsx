import { useState } from "react";
import Button from "../common/Button";

export default function MessageBox({ onSend, loading = false }) {
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await onSend(message.trim());
    setMessage("");
  };

  return (
    <form className="message-box" onSubmit={submit}>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" placeholder="Write a reply..." />
      <Button type="submit" loading={loading}>Send Reply</Button>
    </form>
  );
}
