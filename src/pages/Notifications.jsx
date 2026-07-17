import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, CircleAlert, Info, ReceiptText } from "lucide-react";
import API from "../api/axios";

const iconForType = (type) => {
  const normalized = String(type || "INFO").toUpperCase();
  if (normalized.includes("PAYMENT")) return <ReceiptText size={20} />;
  if (normalized.includes("ALERT") || normalized.includes("ERROR")) return <CircleAlert size={20} />;
  return <Info size={20} />;
};

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const response = await API.get("/notifications");
      setItems(response.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await API.patch(`/notifications/${id}/read`);
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const markAll = async () => {
    await API.patch("/notifications/read-all");
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <main className="workspace-page">
      <section className="workspace-hero compact">
        <div><span className="workspace-kicker"><Bell size={16} /> Updates</span><h1>Notifications</h1><p>Booking, payment, account and system updates in one place.</p></div>
        <button className="secondary-action" onClick={markAll}><CheckCheck size={18} /> Mark all read</button>
      </section>

      {error && <div className="error-box">{error}</div>}
      <section className="professional-list-card">
        {loading ? <p className="muted-state">Loading notifications...</p> : items.length === 0 ? (
          <div className="empty-state-pro"><Bell size={38} /><h3>You are all caught up</h3><p>New updates will appear here.</p></div>
        ) : items.map((item) => (
          <article key={item.id} className={`notification-row ${item.read ? "read" : "unread"}`}>
            <span className="notification-icon">{iconForType(item.type)}</span>
            <div className="notification-copy"><h3>{item.title || "RentRide update"}</h3><p>{item.message}</p><small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}</small></div>
            {!item.read && <button onClick={() => markRead(item.id)}>Mark read</button>}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Notifications;
