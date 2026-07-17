import React, { useEffect, useState } from "react";
import { BadgeCheck, Car, CheckCircle2, IndianRupee, Shield, Users, XCircle } from "lucide-react";
import API from "../api/axios";

function AdminOperations() {
  const [stats, setStats] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [dashboardResponse, driversResponse] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/drivers"),
      ]);
      setStats(dashboardResponse.data?.data || {});
      setDrivers(driversResponse.data?.data || []);
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load admin operations."); }
  };

  useEffect(() => { load(); }, []);

  const verify = async (id, status) => {
    await API.patch(`/admin/drivers/${id}/verification?status=${status}`);
    await load();
  };

  return (
    <main className="workspace-page">
      <section className="workspace-hero compact"><div><span className="workspace-kicker"><Shield size={16} /> Administration</span><h1>Operations Center</h1><p>Monitor platform growth and review driver verification requests.</p></div></section>
      {error && <div className="error-box">{error}</div>}
      <section className="metric-grid four">
        <article><Users /><div><span>Users</span><strong>{stats.users || 0}</strong></div></article>
        <article><BadgeCheck /><div><span>Drivers</span><strong>{stats.drivers || 0}</strong></div></article>
        <article><Car /><div><span>Fleet cars</span><strong>{stats.cars || 0}</strong></div></article>
        <article><IndianRupee /><div><span>Payments</span><strong>{stats.payments || 0}</strong></div></article>
      </section>

      <section className="professional-list-card">
        <div className="list-card-heading"><div><h2>Driver verification queue</h2><p>{stats.pendingDriverApprovals || 0} pending review</p></div></div>
        {drivers.length === 0 ? <p className="muted-state">No driver profiles available.</p> : drivers.map((driver) => (
          <article className="admin-driver-row" key={driver.id}>
            <div className="driver-avatar">{String(driver.name || "D").charAt(0)}</div>
            <div className="driver-primary"><strong>{driver.name}</strong><p>{driver.email} · {driver.phone || "No phone"}</p><small>{driver.vehicleModel || "Vehicle pending"} · {driver.vehicleNumber || "No registration"}</small></div>
            <span className={`status-pill status-${String(driver.verificationStatus).toLowerCase()}`}>{driver.verificationStatus}</span>
            <div className="row-actions">
              <button className="approve" onClick={() => verify(driver.id, "APPROVED")}><CheckCircle2 size={17} /> Approve</button>
              <button className="reject" onClick={() => verify(driver.id, "REJECTED")}><XCircle size={17} /> Reject</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default AdminOperations;
