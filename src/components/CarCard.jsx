import React, { useState } from "react";

import {
  ArrowUpRight,
  Fuel,
  Gauge,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

const SAMPLE_IMAGES = {
  swift:
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85",

  baleno:
    "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=85",

  wagonr:
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=85",

  dzire:
    "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1000&q=85",

  nexon:
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",

  punch:
    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85",

  creta:
    "https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=1000&q=85",

  default:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
};

const getSampleImage = (car) => {
  const carText = `${car.name || ""} ${
    car.model || ""
  } ${car.brand || ""}`.toLowerCase();

  const matchingKey = Object.keys(
    SAMPLE_IMAGES
  ).find(
    (key) =>
      key !== "default" &&
      carText.includes(key)
  );

  return matchingKey
    ? SAMPLE_IMAGES[matchingKey]
    : SAMPLE_IMAGES.default;
};

function CarCard({ car, trip }) {
  const [imageSource, setImageSource] =
    useState(
      car.imageUrl || getSampleImage(car)
    );

  const bookingQuery = new URLSearchParams({
    startDate: trip?.startDate || "",
    endDate: trip?.endDate || "",
    startPoint: trip?.startPoint || "",
    endPoint: trip?.endPoint || "",
  }).toString();

  return (
    <article className="car-card">
      <div className="car-image-area">
        <img
          src={imageSource}
          alt={`${car.brand || ""} ${
            car.name || "Rental car"
          }`}
          onError={() =>
            setImageSource(getSampleImage(car))
          }
        />

        <div className="car-image-shade" />

        <span className="car-availability">
          <ShieldCheck size={14} />
          {car.availabilityStatus ||
            "AVAILABLE"}
        </span>

        <span className="car-rating">
          <Star size={14} />
          {Number(car.rating || 4.8).toFixed(
            1
          )}
        </span>
      </div>

      <div className="car-card-body">
        <div className="car-card-heading">
          <div>
            <span className="car-brand">
              {car.brand}
            </span>

            <h3>{car.name}</h3>

            <p>
              {car.model} · {car.year}
            </p>
          </div>

          <div className="car-price">
            <strong>
              ₹{car.pricePerDay}
            </strong>

            <span>per day</span>
          </div>
        </div>

        <div className="car-specifications">
          <span>
            <Fuel size={16} />
            {car.fuelType}
          </span>

          <span>
            <Gauge size={16} />
            {car.transmission}
          </span>

          <span>
            <Users size={16} />
            {car.seatingCapacity} seats
          </span>

          <span>
            <MapPin size={16} />
            {car.currentLocationCity}
          </span>
        </div>

        <div className="car-feature-line">
          {car.features ||
            "AC, music system and comfortable seating"}
        </div>

        <div className="car-card-actions">
          <Link
            to={`/cars/${car.id}`}
            className="car-details-button"
          >
            View details
          </Link>

          <Link
            to={`/book/${car.id}?${bookingQuery}`}
            className="book-car-button"
          >
            Book car
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CarCard;