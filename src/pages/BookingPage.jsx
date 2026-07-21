import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, CarFront, MapPin, Navigation, ShieldCheck, UserRound } from "lucide-react";
import API from "../api/axios";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    carId: Number(id),
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
    startPoint: params.get("startPoint") || "",
    endPoint: params.get("endPoint") || "",
    bookingType: "WITH_DRIVER",
    pickupLatitude: "",
    pickupLongitude: "",
    dropLatitude: "",
    dropLongitude: "",
    includeInsurance: true,
    insuranceType: "BASIC",
    couponCode: "",
    specialInstructions: "",
    drivingLicenseNumber: "",
    identityProofReference: "",
    ageConfirmed: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return setError("Location is not supported by this browser.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({ ...current, pickupLatitude: coords.latitude, pickupLongitude: coords.longitude }));
        setLocating(false);
      },
      () => { setError("Please allow location permission to find the nearest live driver."); setLocating(false); },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/bookings", {
        ...form,
        pickupLatitude: form.pickupLatitude === "" ? null : Number(form.pickupLatitude),
        pickupLongitude: form.pickupLongitude === "" ? null : Number(form.pickupLongitude),
        dropLatitude: form.dropLatitude === "" ? null : Number(form.dropLatitude),
        dropLongitude: form.dropLongitude === "" ? null : Number(form.dropLongitude),
      });
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <section className="form-page booking-bg">
      <div className="booking-layout">
        <div className="booking-info-card">
          <span className="hero-tag">Uber/Ola style smart dispatch</span>
          <h1>Book self-drive or get the nearest live driver</h1>
          <p>For driver bookings, RentRide sends the request to the nearest approved online driver. If they reject or do not answer in 30 seconds, the request automatically moves to the next nearest driver.</p>
          <div className="booking-points">
            <div><Navigation /><span>Live pickup location is used only to rank nearby drivers.</span></div>
            <div><CalendarDays /><span>Local and outstation trips are automatically identified from distance.</span></div>
            <div><ShieldCheck /><span>Admin can monitor bookings and payments but cannot pay on behalf of a user.</span></div>
          </div>
        </div>

        <div className="form-card">
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={submitBooking} className="booking-form">
            <label>Booking Type</label>
            <div className="booking-type-grid">
              <button type="button" className={form.bookingType === "WITH_DRIVER" ? "booking-type-card active" : "booking-type-card"} onClick={() => setForm({ ...form, bookingType: "WITH_DRIVER" })}>
                <UserRound size={22} /><strong>With Driver</strong><span>Nearest live driver gets the request first.</span>
              </button>
              <button type="button" className={form.bookingType === "SELF_DRIVE" ? "booking-type-card active" : "booking-type-card"} onClick={() => setForm({ ...form, bookingType: "SELF_DRIVE" })}>
                <CarFront size={22} /><strong>Self Drive</strong><span>Licence and age confirmation required.</span>
              </button>
            </div>

            <label>Start Date & Time</label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} required />
            <label>End Date & Time</label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} required />
            <label>Start Point</label>
            <input name="startPoint" placeholder="Pune Railway Station" value={form.startPoint} onChange={handleChange} required />
            <label>End Point</label>
            <input name="endPoint" placeholder="Mumbai Airport" value={form.endPoint} onChange={handleChange} required />

            {form.bookingType === "WITH_DRIVER" && (
              <>
                <button type="button" className="secondary-action full-width" onClick={useCurrentLocation} disabled={locating}>
                  <MapPin size={18} /> {locating ? "Getting location..." : "Use My Live Pickup Location"}
                </button>
                {form.pickupLatitude && <small className="location-confirmed">Pickup location shared: {Number(form.pickupLatitude).toFixed(5)}, {Number(form.pickupLongitude).toFixed(5)}</small>}
                <div className="form-row">
                  <input name="dropLatitude" type="number" step="any" placeholder="Drop latitude (optional)" value={form.dropLatitude} onChange={handleChange} />
                  <input name="dropLongitude" type="number" step="any" placeholder="Drop longitude (optional)" value={form.dropLongitude} onChange={handleChange} />
                </div>
              </>
            )}

            {form.bookingType === "SELF_DRIVE" && (
              <div className="self-drive-docs">
                <label>Driving Licence Number</label>
                <input name="drivingLicenseNumber" placeholder="MH12 20260012345" value={form.drivingLicenseNumber} onChange={handleChange} required />
                <label>Identity Proof Reference</label>
                <input name="identityProofReference" placeholder="Aadhaar/PAN reference" value={form.identityProofReference} onChange={handleChange} />
                <label className="check-row"><input type="checkbox" name="ageConfirmed" checked={form.ageConfirmed} onChange={handleChange} /> I confirm that I meet the legal driving age requirement.</label>
              </div>
            )}

            <label>Coupon Code</label>
            <input name="couponCode" placeholder="Optional coupon" value={form.couponCode} onChange={handleChange} />
            <label className="check-row"><input type="checkbox" name="includeInsurance" checked={form.includeInsurance} onChange={handleChange} /> Include Insurance</label>
            <textarea name="specialInstructions" placeholder="Pickup landmark, passenger count or special instructions" value={form.specialInstructions} onChange={handleChange}></textarea>
            <button className="primary-btn full-btn">{form.bookingType === "WITH_DRIVER" ? "Request Nearest Driver" : "Submit Self-Drive Booking"}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
