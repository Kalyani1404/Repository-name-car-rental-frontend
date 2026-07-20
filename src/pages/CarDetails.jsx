import React, { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import API from "../api/axios";

const CarDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCar = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(`/cars/${id}`);
      const carData = response.data?.data || response.data;

      if (!carData) {
        throw new Error("Car details were not returned by the server.");
      }

      setCar(carData);
    } catch (requestError) {
      console.error("Unable to load car details:", requestError.response?.data || requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          requestError.message ||
          "Unable to load car details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="page-center">Loading car details...</div>;
  }

  if (error || !car) {
    return (
      <section className="details-page">
        <div className="details-error-card">
          <h2>Unable to load this car</h2>
          <p>{error || "Car not found."}</p>
          <div className="details-error-actions">
            <button type="button" onClick={loadCar} className="secondary-action">
              <RefreshCw size={17} /> Try again
            </button>
            <Link to="/cars" className="primary-btn">
              <ArrowLeft size={17} /> Back to Cars
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const bookingUrl = `/book/${car.id}${location.search || ""}`;

  return (
    <section className="details-page">
      <Link to="/cars" className="details-back-link">
        <ArrowLeft size={18} /> Back to cars
      </Link>

      <div className="details-card">
        <img src={car.imageUrl} alt={car.name || "Rental car"} />

        <div className="details-content">
          <span className="hero-tag">{car.availabilityStatus || "AVAILABLE"}</span>
          <h1>{car.name}</h1>
          <p>
            {car.brand} • {car.model} • {car.year}
          </p>

          <div className="details-grid">
            <div><strong>Fuel</strong><span>{car.fuelType || "N/A"}</span></div>
            <div><strong>Transmission</strong><span>{car.transmission || "N/A"}</span></div>
            <div><strong>Seats</strong><span>{car.seatingCapacity || "N/A"}</span></div>
            <div><strong>City</strong><span>{car.currentLocationCity || "N/A"}</span></div>
            <div><strong>Deposit</strong><span>₹{Number(car.securityDeposit || 0).toLocaleString("en-IN")}</span></div>
            <div><strong>Price</strong><span>₹{Number(car.pricePerDay || 0).toLocaleString("en-IN")}/day</span></div>
          </div>

          <p className="features-text">
            {car.features || "Comfortable seating and essential rental features."}
          </p>

          <Link to={bookingUrl} className="primary-btn full-btn">
            Book This Car
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarDetails;
