import React, { useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, CarFront, IdCard, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DriverRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    licenseNumber: "", aadhaarLast4: "", vehicleNumber: "", vehicleModel: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === "aadhaarLast4" ? value.replace(/\D/g, "").slice(0, 4) : value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      await API.post("/auth/register-driver", {
        ...form,
        email: form.email.trim().toLowerCase(),
        licenseNumber: form.licenseNumber.trim().toUpperCase(),
        vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
      });
      setMessage("Driver account created. Sign in to open your Driver Dashboard.");
      window.setTimeout(() => navigate("/", { replace: true }), 1400);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register driver account.");
    } finally { setLoading(false); }
  };

  return (
    <main className="driver-register-page">
      <section className="driver-register-shell">
        <aside className="driver-register-info">
          <div className="driver-register-brand"><CarFront size={28} /><strong>RentRide Driver</strong></div>
          <h1>Join the RentRide driver network.</h1>
          <p>Create your driver account, complete verification, choose when you are online and keep your live pickup location updated.</p>
          <div className="driver-register-steps">
            <span><BadgeCheck size={18} /> Driver verification</span>
            <span><BadgeCheck size={18} /> Online / offline availability</span>
            <span><BadgeCheck size={18} /> Secure live location updates</span>
          </div>
        </aside>

        <div className="driver-register-form-card">
          <button className="register-back-button" type="button" onClick={() => navigate("/")}><ArrowLeft size={18} /> Back to login</button>
          <h2>Driver registration</h2>
          <p>Enter your personal, licence and vehicle details.</p>
          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <form className="driver-register-form" onSubmit={submit}>
            <div className="driver-field"><UserRound size={18} /><input name="fullName" value={form.fullName} onChange={update} placeholder="Full name" required /></div>
            <div className="driver-field"><Mail size={18} /><input type="email" name="email" value={form.email} onChange={update} placeholder="Email address" required /></div>
            <div className="driver-field"><Phone size={18} /><input name="phone" value={form.phone} onChange={update} placeholder="10-digit phone number" required /></div>
            <div className="driver-field"><LockKeyhole size={18} /><input type="password" name="password" value={form.password} onChange={update} placeholder="Password" required minLength={8} /></div>
            <div className="driver-field"><IdCard size={18} /><input name="licenseNumber" value={form.licenseNumber} onChange={update} placeholder="Driving licence number" required /></div>
            <div className="driver-field"><IdCard size={18} /><input name="aadhaarLast4" value={form.aadhaarLast4} onChange={update} placeholder="Aadhaar last 4 digits" required pattern="[0-9]{4}" /></div>
            <div className="driver-field"><CarFront size={18} /><input name="vehicleNumber" value={form.vehicleNumber} onChange={update} placeholder="Vehicle registration number" required /></div>
            <div className="driver-field"><CarFront size={18} /><input name="vehicleModel" value={form.vehicleModel} onChange={update} placeholder="Vehicle model" required /></div>
            <button className="login-submit" disabled={loading}>{loading ? "Creating driver account..." : "Create driver account"}{!loading && <ArrowRight size={18} />}</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default DriverRegister;
