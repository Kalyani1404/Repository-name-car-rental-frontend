import React, {
  useEffect,
  useState,
} from "react";

import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const getName = (user) => {
  if (user?.fullName) {
    return user.fullName;
  }

  const name = [
    user?.firstName,
    user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    name ||
    user?.email?.split("@")[0] ||
    "RentRide User"
  );
};

function Profile() {
  const { user } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response =
          await API.get("/bookings");

        setBookings(
          response.data?.data || []
        );
      } catch (error) {
        console.error(
          "Unable to load booking history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "COMPLETED"
    ).length;

  const activeBookings =
    bookings.filter((booking) =>
      ["PENDING", "CONFIRMED"].includes(
        booking.status
      )
    ).length;

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-main-card">
          <div className="profile-large-avatar">
            {getName(user)
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          <div>
            <span className="eyebrow">
              <UserRound size={16} />
              Account profile
            </span>

            <h1>{getName(user)}</h1>

            <p>
              Manage your account details and
              view your complete RentRide
              activity.
            </p>
          </div>

          <span className="profile-status">
            <CheckCircle2 size={17} />
            {user?.status || "ACTIVE"}
          </span>
        </div>

        <div className="profile-stat-grid">
          <div>
            <CalendarDays size={21} />
            <strong>{bookings.length}</strong>
            <span>Total bookings</span>
          </div>

          <div>
            <Clock3 size={21} />
            <strong>{activeBookings}</strong>
            <span>Active bookings</span>
          </div>

          <div>
            <CarFront size={21} />
            <strong>
              {completedBookings}
            </strong>
            <span>Completed trips</span>
          </div>
        </div>
      </section>

      <section className="profile-content-grid">
        <div className="profile-details-card">
          <h2>Personal information</h2>

          <div className="profile-detail-row">
            <UserRound size={19} />

            <div>
              <span>Full name</span>
              <strong>{getName(user)}</strong>
            </div>
          </div>

          <div className="profile-detail-row">
            <Mail size={19} />

            <div>
              <span>Email address</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>
          </div>

          <div className="profile-detail-row">
            <Phone size={19} />

            <div>
              <span>Phone number</span>
              <strong>
                {user?.phone || "Not available"}
              </strong>
            </div>
          </div>

          <div className="profile-detail-row">
            <ShieldCheck size={19} />

            <div>
              <span>Account role</span>
              <strong>
                {user?.role || "USER"}
              </strong>
            </div>
          </div>
        </div>

        <div className="profile-history-card">
          <div className="profile-history-head">
            <div>
              <h2>Recent booking history</h2>
              <p>
                Your most recent rental activity.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="profile-loading">
              Loading history...
            </p>
          ) : bookings.length === 0 ? (
            <div className="profile-empty-history">
              <CarFront size={35} />

              <h3>No bookings yet</h3>

              <p>
                Search for a car and complete your
                first booking.
              </p>
            </div>
          ) : (
            <div className="profile-booking-list">
              {bookings
                .slice(0, 5)
                .map((booking) => (
                  <article key={booking.id}>
                    <div>
                      <strong>
                        {booking.carName ||
                          `Booking #${booking.id}`}
                      </strong>

                      <p>
                        {booking.startPoint ||
                          booking.pickupLocation}
                        {" → "}
                        {booking.endPoint ||
                          booking.dropoffLocation}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`booking-status status-${String(
                          booking.status
                        ).toLowerCase()}`}
                      >
                        {booking.status}
                      </span>

                      <strong>
                        ₹{booking.grandTotal}
                      </strong>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Profile;