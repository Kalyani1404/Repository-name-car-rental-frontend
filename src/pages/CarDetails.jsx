import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    API.get(`/cars/${id}`).then((res) => setCar(res.data.data));
  }, [id]);

  if (!car) return <div className="page-center">Loading car details...</div>;

  return (
    <section className="details-page">
      <div className="details-card">
        <img src={car.imageUrl} alt={car.name} />

        <div className="details-content">
          <span className="hero-tag">{car.availabilityStatus}</span>
          <h1>{car.name}</h1>
          <p>{car.brand} • {car.model} • {car.year}</p>

          <div className="details-grid">
            <div><strong>Fuel</strong><span>{car.fuelType}</span></div>
            <div><strong>Transmission</strong><span>{car.transmission}</span></div>
            <div><strong>Seats</strong><span>{car.seatingCapacity}</span></div>
            <div><strong>City</strong><span>{car.currentLocationCity}</span></div>
            <div><strong>Deposit</strong><span>₹{car.securityDeposit}</span></div>
            <div><strong>Price</strong><span>₹{car.pricePerDay}/day</span></div>
          </div>

          <p className="features-text">{car.features}</p>

          <Link to={`/book/${car.id}`} className="primary-btn full-btn">
            Book This Car
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarDetails;