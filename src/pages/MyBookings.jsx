import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  CarFront,
  IndianRupee,
  MapPin,
  RefreshCw,
} from "lucide-react";

import API from "../api/axios";

const extractBookings = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) {
    return body;
  }

  if (Array.isArray(body?.data)) {
    return body.data;
  }

  if (Array.isArray(body?.content)) {
    return body.content;
  }

  if (Array.isArray(body?.data?.content)) {
    return body.data.content;
  }

  if (Array.isArray(body?.bookings)) {
    return body.bookings;
  }

  return [];
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not provided";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const readValue = (
  object,
  camelCaseKey,
  snakeCaseKey,
  fallback = ""
) => {
  return (
    object?.[camelCaseKey] ??
    object?.[snakeCaseKey] ??
    fallback
  );
};

const MyBookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadBookings = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await API.get("/bookings");

        setBookings(
          extractBookings(response)
        );
      } catch (err) {
        console.error(
          "Unable to load bookings:",
          err.response?.data || err
        );

        setBookings([]);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load your bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <section className="dashboard-page my-bookings-page">
      <div className="dashboard-head bookings-page-head">
        <div>
          <span className="hero-tag">
            Trips
          </span>

          <h1>My Bookings</h1>

          <p>
            Track your rental bookings,
            journey details and payment
            status.
          </p>
        </div>

        <div className="booking-count-box">
          <strong>
            {bookings.length}
          </strong>

          <span>
            {bookings.length === 1
              ? "booking"
              : "bookings"}
          </span>
        </div>
      </div>

      {error && (
        <div className="bookings-error-state">
          <div>
            <strong>
              Unable to load bookings
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
          >
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="bookings-loading">
          <span className="booking-loader" />

          <p>
            Loading your bookings...
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        bookings.length === 0 && (
          <div className="bookings-empty-state">
            <div className="bookings-empty-icon">
              <CarFront size={34} />
            </div>

            <h2>No bookings yet</h2>

            <p>
              Your confirmed car bookings
              will appear here.
            </p>

            <a href="/cars">
              Explore cars
              <ArrowRight size={17} />
            </a>
          </div>
        )}

      {!loading &&
        bookings.length > 0 && (
          <div className="booking-list">
            {bookings.map(
              (booking, index) => {
                const id =
                  readValue(
                    booking,
                    "id",
                    "id"
                  ) || index;

                const carName =
                  readValue(
                    booking,
                    "carName",
                    "car_name"
                  ) ||
                  booking?.car?.name ||
                  "Rental Car";

                const carBrand =
                  readValue(
                    booking,
                    "carBrand",
                    "car_brand"
                  ) ||
                  booking?.car?.brand ||
                  "RentRide";

                const startPoint =
                  readValue(
                    booking,
                    "startPoint",
                    "start_point"
                  ) ||
                  readValue(
                    booking,
                    "pickupLocation",
                    "pickup_location",
                    "Pickup point"
                  );

                const endPoint =
                  readValue(
                    booking,
                    "endPoint",
                    "end_point"
                  ) ||
                  readValue(
                    booking,
                    "dropoffLocation",
                    "dropoff_location",
                    "Drop point"
                  );

                const startDate =
                  readValue(
                    booking,
                    "startDate",
                    "start_date"
                  );

                const endDate =
                  readValue(
                    booking,
                    "endDate",
                    "end_date"
                  );

                const status =
                  readValue(
                    booking,
                    "status",
                    "status",
                    "PENDING"
                  );

                const total =
                  readValue(
                    booking,
                    "grandTotal",
                    "grand_total"
                  ) ||
                  readValue(
                    booking,
                    "totalAmount",
                    "total_amount",
                    0
                  );

                return (
                  <article
                    className="booking-card"
                    key={id}
                  >
                    <div className="booking-card-accent" />

                    <div className="booking-car-summary">
                      <div className="booking-car-icon">
                        <CarFront
                          size={25}
                        />
                      </div>

                      <div>
                        <span>
                          {carBrand}
                        </span>

                        <h3>
                          {carName}
                        </h3>

                        <p>
                          Booking #{id}
                        </p>
                      </div>
                    </div>

                    <div className="booking-route">
                      <div>
                        <MapPin
                          size={17}
                        />

                        <span>
                          {startPoint}
                        </span>
                      </div>

                      <ArrowRight
                        className="route-arrow"
                        size={18}
                      />

                      <div>
                        <MapPin
                          size={17}
                        />

                        <span>
                          {endPoint}
                        </span>
                      </div>
                    </div>

                    <div className="booking-dates">
                      <div>
                        <CalendarDays
                          size={17}
                        />

                        <span>
                          <small>
                            Start
                          </small>

                          {formatDate(
                            startDate
                          )}
                        </span>
                      </div>

                      <div>
                        <CalendarDays
                          size={17}
                        />

                        <span>
                          <small>
                            End
                          </small>

                          {formatDate(
                            endDate
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="booking-card-result">
                      <span
                        className={`booking-status status-${String(
                          status
                        ).toLowerCase()}`}
                      >
                        {status}
                      </span>

                      <div className="booking-total">
                        <IndianRupee
                          size={18}
                        />

                        <div>
                          <small>
                            Total
                          </small>

                          <strong>
                            ₹
                            {Number(
                              total || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
    </section>
  );
};

export default MyBookings;