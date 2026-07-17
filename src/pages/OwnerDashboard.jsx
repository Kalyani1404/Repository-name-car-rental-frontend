import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Car, CalendarCheck, Users } from "lucide-react";
import API from "../api/axios";
import CarCard from "../components/CarCard";

const OwnerDashboard = () => {
  const [cars, setCars] = useState([]);

  const loadCars = async () => {
    const res = await API.get("/cars");
    setCars(res.data.data || []);
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <section className="dashboard-page">
      <div className="admin-hero">
        <div>
          <span className="hero-tag">Admin Control Center</span>
          <h1>Manage your rental fleet</h1>
          <p>Add cars, track bookings and manage your car rental startup.</p>
        </div>

        <Link to="/admin/add-car" className="primary-btn">
          <PlusCircle size={18} /> Add New Car
        </Link>
      </div>

      <div className="admin-stats">
        <div><Car /><h3>{cars.length}</h3><p>Total Cars</p></div>
        <div><CalendarCheck /><h3>Live</h3><p>Bookings</p></div>
        <div><Users /><h3>3</h3><p>Roles</p></div>
      </div>

      <h2 className="section-title">Fleet Cars</h2>

      <div className="cars-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
};

export default OwnerDashboard;