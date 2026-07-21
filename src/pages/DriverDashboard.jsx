import React, { useCallback, useEffect, useState } from "react";
import { BadgeCheck, CircleDollarSign, Gauge, MapPin, Navigation, Power, Route, Star, WalletCards, CheckCircle2, XCircle } from "lucide-react";
import API from "../api/axios";

const emptyProfile = { licenseNumber: "", aadhaarLast4: "", vehicleNumber: "", vehicleModel: "" };

function DriverDashboard() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [profileResponse, requestResponse] = await Promise.all([API.get("/driver/profile"), API.get("/driver/requests")]);
      const data = profileResponse.data?.data;
      setProfile(data);
      setRequests(requestResponse.data?.data || []);
      setForm({ licenseNumber: data?.licenseNumber || "", aadhaarLast4: "", vehicleNumber: data?.vehicleNumber || "", vehicleModel: data?.vehicleModel || "" });
    } catch (requestError) {
      if (requestError.response?.status !== 404) setError(requestError.response?.data?.message || "Unable to load driver workspace.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); }, [load]);

  const submitProfile = async (event) => { event.preventDefault(); try { const response = await API.post("/driver/profile", form); setProfile(response.data?.data); setMessage("Driver profile submitted for verification."); } catch (e) { setError(e.response?.data?.message || "Unable to save driver profile."); } };
  const toggleAvailability = async () => { try { const response = await API.patch(`/driver/availability?online=${!profile?.online}`); setProfile(response.data?.data); } catch (e) { setError(e.response?.data?.message || "Unable to change availability."); } };
  const shareLocation = () => { if (!navigator.geolocation) return setError("Location is not supported by this browser."); navigator.geolocation.getCurrentPosition(async ({ coords }) => { try { const response = await API.patch(`/driver/location?latitude=${coords.latitude}&longitude=${coords.longitude}`); setProfile(response.data?.data || profile); setMessage("Live location updated successfully."); } catch (e) { setError(e.response?.data?.message || "Unable to update location."); } }, () => setError("Location permission was denied."), { enableHighAccuracy: true }); };
  const respond = async (requestId, accept) => { try { await API.post(`/driver/requests/${requestId}/${accept ? "accept" : "reject"}`); setMessage(accept ? "Trip accepted. Passenger details are now available in notifications." : "Trip rejected. It has been sent to the next nearest driver."); await load(); } catch (e) { setError(e.response?.data?.message || "Unable to respond to request."); } };

  if (loading) return <main className="workspace-page"><p className="muted-state">Loading driver workspace...</p></main>;

  return <main className="workspace-page">
    <section className="workspace-hero driver-hero"><div><span className="workspace-kicker"><Gauge size={16} /> Live driver partner</span><h1>Driver Command Center</h1><p>Go online, share live location and receive the nearest trip requests automatically.</p></div>{profile && <button className={`availability-button ${profile.online ? "online" : "offline"}`} onClick={toggleAvailability}><Power size={19} /> {profile.online ? "Online" : "Go online"}</button>}</section>
    {error && <div className="error-box">{error}</div>}{message && <div className="success-box">{message}</div>}
    {!profile ? <section className="workspace-card driver-onboarding-card"><BadgeCheck size={38}/><h2>Complete driver verification</h2><form className="compact-form" onSubmit={submitProfile}><div className="form-row"><input value={form.licenseNumber} onChange={(e)=>setForm({...form,licenseNumber:e.target.value.toUpperCase()})} placeholder="Driving licence number" required/><input value={form.aadhaarLast4} onChange={(e)=>setForm({...form,aadhaarLast4:e.target.value.replace(/\D/g,"").slice(0,4)})} placeholder="Aadhaar last 4 digits" required/></div><div className="form-row"><input value={form.vehicleNumber} onChange={(e)=>setForm({...form,vehicleNumber:e.target.value.toUpperCase()})} placeholder="Vehicle registration" required/><input value={form.vehicleModel} onChange={(e)=>setForm({...form,vehicleModel:e.target.value})} placeholder="Vehicle model" required/></div><button className="primary-action">Submit for verification</button></form></section> : <>
      <section className="metric-grid four"><article><WalletCards/><div><span>Wallet</span><strong>₹{Number(profile.walletBalance||0).toLocaleString()}</strong></div></article><article><CircleDollarSign/><div><span>Total earnings</span><strong>₹{Number(profile.totalEarnings||0).toLocaleString()}</strong></div></article><article><Route/><div><span>Completed trips</span><strong>{profile.completedTrips||0}</strong></div></article><article><Star/><div><span>Average rating</span><strong>{Number(profile.averageRating||0).toFixed(1)}</strong></div></article></section>
      <section className="professional-list-card"><div className="list-card-heading"><div><h2>Live trip requests</h2><p>Nearest requests appear here and refresh every 10 seconds.</p></div></div>{requests.length===0?<p className="muted-state">No active request right now. Stay online and keep your location updated.</p>:requests.map((r)=><article className="driver-request-card" key={r.requestId}><div><strong>{r.startPoint} → {r.endPoint}</strong><p>{r.tripType} · {Number(r.distanceFromPickupKm||0).toFixed(1)} km from pickup</p><small>{r.startDate ? new Date(r.startDate).toLocaleString("en-IN") : ""}</small>{r.specialInstructions&&<p>Instructions: {r.specialInstructions}</p>}</div><div className="row-actions"><button className="approve" onClick={()=>respond(r.requestId,true)}><CheckCircle2 size={17}/>Accept</button><button className="reject" onClick={()=>respond(r.requestId,false)}><XCircle size={17}/>Reject</button></div></article>)}</section>
      <div className="workspace-two-column"><section className="workspace-card"><div className="workspace-card-head"><div><BadgeCheck size={21}/><h2>Verification status</h2></div><span className={`status-pill status-${String(profile.verificationStatus).toLowerCase()}`}>{profile.verificationStatus}</span></div><div className="detail-stack"><p><span>Licence</span><strong>{profile.licenseNumber}</strong></p><p><span>Vehicle</span><strong>{profile.vehicleModel}</strong></p><p><span>Registration</span><strong>{profile.vehicleNumber}</strong></p></div></section><section className="workspace-card"><div className="workspace-card-head"><div><Navigation size={21}/><h2>Live operations</h2></div></div><p className="card-description">Only approved drivers who are online and have a current location are considered for automatic dispatch.</p><button className="secondary-action full-width" onClick={shareLocation}><MapPin size={18}/>Update live location</button><div className="driver-location-box"><p><span>Latitude: </span><strong>{profile.latitude??"Not shared"}</strong></p><p><span>Longitude: </span><strong>{profile.longitude??"Not shared"}</strong></p><p><span>Status: </span><strong>{profile.online?"Online - receiving nearby requests":"Offline"}</strong></p></div></section></div>
    </>}
  </main>;
}

export default DriverDashboard;
