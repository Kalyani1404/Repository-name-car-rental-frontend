import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import API from "../api/axios";
import CarCard from "../components/CarCard";
import Loader from "../components/Loader";

const emptySearchForm = {
  startPoint: "",
  endPoint: "",
  startDate: "",
  endDate: "",
  search: "",
  city: "",
};

const isValidRideSearch = (form) => {
  return Boolean(
    form.startPoint.trim() &&
      form.endPoint.trim() &&
      form.startDate &&
      form.endDate
  );
};

function UserDashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [trip, setTrip] = useState(() => {
    const savedSearch =
      localStorage.getItem("rideSearch");

    if (!savedSearch) {
      return emptySearchForm;
    }

    try {
      return {
        ...emptySearchForm,
        ...JSON.parse(savedSearch),
      };
    } catch {
      return emptySearchForm;
    }
  });

  const [searchSubmitted, setSearchSubmitted] =
    useState(false);

  const [validationMessage, setValidationMessage] =
    useState("");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/cars");

        setCars(response.data?.data || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load cars."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTrip((current) => ({
      ...current,
      [name]: value,
    }));

    setValidationMessage("");
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!isValidRideSearch(trip)) {
      setValidationMessage(
        "Please enter pickup location, drop location, start date and end date."
      );

      setSearchSubmitted(false);
      return;
    }

    if (
      new Date(trip.endDate) <=
      new Date(trip.startDate)
    ) {
      setValidationMessage(
        "End date and time must be after the start date and time."
      );

      setSearchSubmitted(false);
      return;
    }

    localStorage.setItem(
      "rideSearch",
      JSON.stringify(trip)
    );

    setSearchSubmitted(true);

    window.setTimeout(() => {
      document
        .getElementById("available-cars")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const resetSearch = () => {
    setTrip(emptySearchForm);
    setSearchSubmitted(false);
    setValidationMessage("");

    localStorage.removeItem("rideSearch");
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const searchableText = [
        car.name,
        car.brand,
        car.model,
        car.fuelType,
        car.transmission,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesName =
        searchableText.includes(
          trip.search.trim().toLowerCase()
        );

      const matchesCity =
        !trip.city.trim() ||
        car.currentLocationCity
          ?.toLowerCase()
          .includes(
            trip.city.trim().toLowerCase()
          );

      const isAvailable =
        car.isAvailable !== false &&
        car.availabilityStatus !==
          "UNAVAILABLE";

      return (
        matchesName &&
        matchesCity &&
        isAvailable
      );
    });
  }, [cars, trip.search, trip.city]);

  return (
    <main className="cars-page">
      <section className="ride-search-hero">
        <div className="ride-hero-decoration ride-circle-one" />
        <div className="ride-hero-decoration ride-circle-two" />

        <motion.div
          className="ride-search-intro"
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <span className="eyebrow">
            <Sparkles size={16} />
            Start with your journey
          </span>

          <h1>
            Choose where and when. We will show
            the right cars.
          </h1>

          <p>
            Enter your trip details before
            browsing vehicles. This helps you
            choose a car based on the correct
            date, time and route.
          </p>

          <div className="ride-highlights">
            <span>
              <ShieldCheck size={17} />
              Verified cars
            </span>

            <span>
              <Clock3 size={17} />
              Flexible booking
            </span>

            <span>
              <CarFront size={17} />
              Budget-friendly options
            </span>
          </div>
        </motion.div>

        <motion.form
          className="ride-search-card"
          onSubmit={handleSearch}
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <div className="ride-search-card-head">
            <span className="ride-search-icon">
              <Search size={21} />
            </span>

            <div>
              <h2>Find your ride</h2>
              <p>
                All four trip details are
                required.
              </p>
            </div>
          </div>

          {validationMessage && (
            <div className="error-box">
              {validationMessage}
            </div>
          )}

          <div className="ride-form-grid">
            <div className="ride-field">
              <label htmlFor="startPoint">
                Pickup location
              </label>

              <div>
                <MapPin size={18} />

                <input
                  id="startPoint"
                  name="startPoint"
                  type="text"
                  placeholder="Pune Railway Station"
                  value={trip.startPoint}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ride-field">
              <label htmlFor="endPoint">
                Drop location
              </label>

              <div>
                <MapPin size={18} />

                <input
                  id="endPoint"
                  name="endPoint"
                  type="text"
                  placeholder="Mumbai Airport"
                  value={trip.endPoint}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ride-field">
              <label htmlFor="startDate">
                Start date and time
              </label>

              <div>
                <CalendarDays size={18} />

                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={trip.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="ride-field">
              <label htmlFor="endDate">
                End date and time
              </label>

              <div>
                <CalendarDays size={18} />

                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={trip.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="search-cars-button"
          >
            Search available cars
            <ArrowRight size={19} />
          </button>

          {searchSubmitted && (
            <button
              type="button"
              className="reset-search-button"
              onClick={resetSearch}
            >
              Clear trip details
            </button>
          )}
        </motion.form>
      </section>

      {!searchSubmitted && (
        <section className="before-search-section">
          <div className="before-search-card">
            <span>
              <CarFront size={30} />
            </span>

            <div>
              <h2>
                Cars will appear after trip search
              </h2>

              <p>
                Enter the pickup, drop, start date
                and end date above to see available
                vehicles.
              </p>
            </div>
          </div>

          <div className="popular-types">
            <div>
              <strong>Hatchback</strong>
              <span>
                Swift, WagonR, Baleno
              </span>
            </div>

            <div>
              <strong>Compact SUV</strong>
              <span>
                Nexon, Punch, Venue
              </span>
            </div>

            <div>
              <strong>Sedan</strong>
              <span>
                Dzire, Amaze, Aura
              </span>
            </div>
          </div>
        </section>
      )}

      {searchSubmitted && (
        <section
          className="available-cars-section"
          id="available-cars"
        >
          <div className="cars-results-header">
            <div>
              <span className="eyebrow">
                <CarFront size={16} />
                Available vehicles
              </span>

              <h2>
                Cars for your selected journey
              </h2>

              <p>
                {trip.startPoint} to{" "}
                {trip.endPoint}
              </p>
            </div>

            <div className="result-count">
              <strong>
                {filteredCars.length}
              </strong>
              <span>cars found</span>
            </div>
          </div>

          <div className="secondary-car-filters">
            <div>
              <Search size={18} />

              <input
                type="text"
                name="search"
                value={trip.search}
                onChange={handleChange}
                placeholder="Search car, brand or model"
              />
            </div>

            <div>
              <MapPin size={18} />

              <input
                type="text"
                name="city"
                value={trip.city}
                onChange={handleChange}
                placeholder="Filter by car city"
              />
            </div>

            <span>
              <SlidersHorizontal size={18} />
              Live filters
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="error-box">
              {error}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="empty-cars-state">
              <CarFront size={44} />

              <h3>No matching cars found</h3>

              <p>
                Change the search text or city
                filter and try again.
              </p>
            </div>
          ) : (
            <div className="cars-grid">
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                >
                  <CarCard
                    car={car}
                    trip={trip}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default UserDashboard;