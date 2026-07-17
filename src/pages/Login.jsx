import React, { useState } from "react";

import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const LOGIN_CAR_IMAGE =
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=90";

function Login() {
  const {
    login,
    isLoggedIn,
    isAdmin,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (isLoggedIn) {
    return (
      <Navigate
        to={
          isAdmin
            ? "/admin"
            : "/cars"
        }
        replace
      />
    );
  }

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser =
        await login(
          form.email.trim(),
          form.password
        );

      navigate(
        loggedInUser.role ===
          "ADMIN"
          ? "/admin"
          : "/cars",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      setError(
        requestError.response
          ?.data?.message ||
          requestError.message ||
          "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-orb orb-one" />
      <div className="login-background-orb orb-two" />

      <motion.section
        className="login-experience"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.65,
        }}
      >
        <div className="login-visual-panel">
          <img
            src={LOGIN_CAR_IMAGE}
            alt="Car available for rental"
            className="login-visual-image"
          />

          <div className="login-image-overlay" />

          <div className="login-brand-mark">
            <span>
              <CarFront size={24} />
            </span>

            <div>
              <strong>
                RentRide
              </strong>

              <small>
                Drive on your terms
              </small>
            </div>
          </div>

          <div className="login-visual-content">
            <div className="login-kicker">
              <Sparkles size={16} />
              Smart car rental experience
            </div>

            <h1>
              Your next journey starts
              with the right ride.
            </h1>

            <p>
              Search affordable cars,
              choose exact pickup and
              drop locations, book by
              date and time, and manage
              every trip securely.
            </p>

            <div className="login-benefits">
              <div>
                <CheckCircle2
                  size={18}
                />
                Secure JWT authentication
              </div>

              <div>
                <CheckCircle2
                  size={18}
                />
                Verified,
                budget-friendly cars
              </div>

              <div>
                <CheckCircle2
                  size={18}
                />
                Date and
                location-based booking
              </div>
            </div>
          </div>

          <div className="login-floating-location">
            <MapPin size={18} />

            <span>
              Pickup and drop anywhere
            </span>
          </div>

          <div className="login-road">
            <span />
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-inner">
            <span className="login-form-badge">
              <ShieldCheck size={16} />
              Secure account access
            </span>

            <h2>Welcome back</h2>

            <p className="login-form-subtitle">
              Sign in to search cars
              and manage your rental
              bookings.
            </p>

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >
              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input">
                <LockKeyhole
                  size={19}
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in securely"}

                {!loading && (
                  <ArrowRight
                    size={19}
                  />
                )}
              </button>
            </form>

            <div
              style={{
                width: "100%",
                marginTop: "24px",
                paddingTop: "22px",
                borderTop:
                  "1px solid #e2e8f0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                New to RentRide?
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                style={{
                  width: "100%",
                  minHeight: "52px",
                  padding: "13px 20px",
                  border:
                    "2px solid #2563eb",
                  borderRadius: "12px",
                  backgroundColor:
                    "#ffffff",
                  color: "#2563eb",
                  fontSize: "15px",
                  fontWeight: "700",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",
                  gap: "9px",
                  boxSizing:
                    "border-box",
                  transition:
                    "all 0.25s ease",
                }}
                onMouseEnter={(
                  event
                ) => {
                  event.currentTarget.style.backgroundColor =
                    "#2563eb";

                  event.currentTarget.style.color =
                    "#ffffff";

                  event.currentTarget.style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(
                  event
                ) => {
                  event.currentTarget.style.backgroundColor =
                    "#ffffff";

                  event.currentTarget.style.color =
                    "#2563eb";

                  event.currentTarget.style.transform =
                    "translateY(0)";
                }}
              >
                <UserPlus size={18} />
                Create an account
              </button>
            </div>

            <p className="login-security-note">
              Your account is protected
              with role-based access and
              secure token
              authentication.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default Login;