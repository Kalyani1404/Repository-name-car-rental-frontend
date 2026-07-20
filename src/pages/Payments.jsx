import React, { useCallback, useEffect, useState } from "react";
import { CreditCard, IndianRupee, ReceiptText, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const extractList = (response) => {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  return [];
};

const Payments = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/payments");
      setPayments(extractList(response));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load payment history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const submitPayment = async (event) => {
    event.preventDefault();
    if (!bookingId) return;

    setPaying(true);
    setError("");
    setMessage("");

    try {
      const response = await API.post("/payments", {
        bookingId: Number(bookingId),
        paymentMethod,
      });
      setMessage(response.data?.message || "Payment successful.");
      await loadPayments();
      window.setTimeout(() => navigate("/my-bookings"), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className="workspace-page payments-page">
      <section className="workspace-hero compact">
        <div>
          <span className="workspace-kicker"><CreditCard size={16} /> Secure Payments</span>
          <h1>{bookingId ? "Complete Payment" : "Payment History"}</h1>
          <p>Pay for a booking and review your RentRide transactions.</p>
        </div>
      </section>

      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      {bookingId && (
        <section className="payment-checkout-card">
          <div>
            <span className="payment-checkout-icon"><IndianRupee size={24} /></span>
            <div>
              <h2>Booking #{bookingId}</h2>
              <p>Select your preferred payment method.</p>
            </div>
          </div>

          <form onSubmit={submitPayment}>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="UPI">UPI</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="CASH">Cash</option>
            </select>
            <button type="submit" className="primary-btn" disabled={paying}>
              {paying ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </section>
      )}

      <section className="professional-list-card">
        <div className="list-card-heading">
          <div>
            <h2>Transactions</h2>
            <p>Your latest payment records</p>
          </div>
          <button type="button" className="secondary-action" onClick={loadPayments}>
            <RefreshCw size={17} /> Refresh
          </button>
        </div>

        {loading ? (
          <p className="muted-state">Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="empty-state-pro">
            <ReceiptText size={38} />
            <h3>No payments yet</h3>
            <p>Your completed transactions will appear here.</p>
          </div>
        ) : (
          payments.map((payment) => (
            <article className="payment-row" key={payment.id}>
              <span className="notification-icon"><ReceiptText size={20} /></span>
              <div className="payment-row-copy">
                <strong>{payment.transactionReference || `Payment #${payment.id}`}</strong>
                <p>Booking #{payment.bookingId} · {payment.paymentMethod || "Payment"}</p>
                <small>{payment.createdAt ? new Date(payment.createdAt).toLocaleString("en-IN") : ""}</small>
              </div>
              <div className="payment-row-result">
                <strong>₹{Number(payment.amount || 0).toLocaleString("en-IN")}</strong>
                <span className={`status-pill status-${String(payment.status || "SUCCESS").toLowerCase()}`}>
                  {payment.status || "SUCCESS"}
                </span>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Payments;
