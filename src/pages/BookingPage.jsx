import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import API from "../api/axios";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    carId: Number(id),
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
    startPoint: params.get("startPoint") || "",
    endPoint: params.get("endPoint") || "",
    includeInsurance: true,
    insuranceType: "BASIC",
    couponCode: "",
    specialInstructions: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/bookings", form);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <section className="form-page booking-bg">
      <div className="booking-layout">
        <div className="booking-info-card">
          <span className="hero-tag">Smart Booking</span>
          <h1>Confirm your ride details</h1>
          <p>
            Your backend supports start date, end date, start point, end point,
            insurance and special instructions. Everything is connected here.
          </p>

          <div className="booking-points">
            <div>
              <MapPin />
              <span>Pickup from your selected start point</span>
            </div>
            <div>
              <CalendarDays />
              <span>Book with exact date and time</span>
            </div>
            <div>
              <ShieldCheck />
              <span>Optional insurance included</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          {error && <div className="error-box">{error}</div>}

          <form onSubmit={submitBooking} className="booking-form">
            <label>Start Date & Time</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />

            <label>End Date & Time</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />

            <label>Start Point</label>
            <input
              name="startPoint"
              placeholder="Pune Railway Station"
              value={form.startPoint}
              onChange={handleChange}
              required
            />

            <label>End Point</label>
            <input
              name="endPoint"
              placeholder="Mumbai Airport"
              value={form.endPoint}
              onChange={handleChange}
              required
            />

            <label>Coupon Code</label>
            <input
              name="couponCode"
              placeholder="Optional coupon"
              value={form.couponCode}
              onChange={handleChange}
            />

            <label className="check-row">
              <input
                type="checkbox"
                name="includeInsurance"
                checked={form.includeInsurance}
                onChange={handleChange}
              />
              Include Insurance
            </label>

            <textarea
              name="specialInstructions"
              placeholder="Special instructions"
              value={form.specialInstructions}
              onChange={handleChange}
            ></textarea>

            <button className="primary-btn full-btn">Confirm Booking</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;