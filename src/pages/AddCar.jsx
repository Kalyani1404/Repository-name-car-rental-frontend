import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AddCar = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [car, setCar] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    registrationNumber: "",
    fuelType: "PETROL",
    transmission: "MANUAL",
    seatingCapacity: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    currentLocationCity: "",
    currentLocationLatitude: "",
    currentLocationLongitude: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    features: "",
    fuelPolicy: "FULL_TO_FULL",
    mileageLimitPerDay: "",
    lateFeePerHour: "",
    securityDeposit: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const submitCar = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.post("/cars", car);
      setMessage("Car added successfully");
      setTimeout(() => navigate("/admin"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add car");
    }
  };

  return (
    <section className="form-page">
      <div className="form-card wide">
        <div className="section-head left">
          <span className="hero-tag">Admin Only</span>
          <h1>Add New Car</h1>
          <p>Use Cloudinary image URL for better image loading.</p>
        </div>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitCar} className="car-form">
          <input name="name" placeholder="Car Name" onChange={handleChange} required />
          <input name="brand" placeholder="Brand" onChange={handleChange} required />
          <input name="model" placeholder="Model" onChange={handleChange} required />
          <input name="year" placeholder="Year" type="number" onChange={handleChange} required />
          <input name="color" placeholder="Color" onChange={handleChange} required />
          <input name="registrationNumber" placeholder="Registration Number" onChange={handleChange} required />

          <select name="fuelType" onChange={handleChange}>
            <option>PETROL</option>
            <option>DIESEL</option>
            <option>CNG</option>
            <option>EV</option>
          </select>

          <select name="transmission" onChange={handleChange}>
            <option>MANUAL</option>
            <option>AUTOMATIC</option>
          </select>

          <input name="seatingCapacity" placeholder="Seating Capacity" type="number" onChange={handleChange} required />
          <input name="pricePerDay" placeholder="Price Per Day" type="number" onChange={handleChange} required />
          <input name="pricePerWeek" placeholder="Price Per Week" type="number" onChange={handleChange} required />
          <input name="pricePerMonth" placeholder="Price Per Month" type="number" onChange={handleChange} required />
          <input name="currentLocationCity" placeholder="Current City" onChange={handleChange} required />
          <input name="currentLocationLatitude" placeholder="Latitude" type="number" onChange={handleChange} />
          <input name="currentLocationLongitude" placeholder="Longitude" type="number" onChange={handleChange} />
          <input name="insuranceProvider" placeholder="Insurance Provider" onChange={handleChange} required />
          <input name="insurancePolicyNumber" placeholder="Insurance Policy Number" onChange={handleChange} required />
          <input name="mileageLimitPerDay" placeholder="Mileage Limit Per Day" type="number" onChange={handleChange} required />
          <input name="lateFeePerHour" placeholder="Late Fee Per Hour" type="number" onChange={handleChange} required />
          <input name="securityDeposit" placeholder="Security Deposit" type="number" onChange={handleChange} required />
          <input name="imageUrl" placeholder="Cloudinary Image URL" onChange={handleChange} />

          <textarea name="features" placeholder="Features e.g. AC,GPS,Bluetooth" onChange={handleChange}></textarea>

          <button className="primary-btn full-btn">Add Car</button>
        </form>
      </div>
    </section>
  );
};

export default AddCar;