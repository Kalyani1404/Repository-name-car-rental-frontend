import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const REGISTER_CAR_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90";

const FULL_NAME_PATTERN = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[6-9][0-9]{9}$/;

function Register() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, isDriver } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordRules = useMemo(() => {
    const value = form.password;
    return [
      {
        key: "letters",
        label: "At least 2 letters",
        valid: (value.match(/[A-Za-z]/g) || []).length >= 2,
      },
      {
        key: "numbers",
        label: "At least 3 numbers",
        valid: (value.match(/[0-9]/g) || []).length >= 3,
      },
      {
        key: "symbols",
        label: "At least 2 symbols",
        valid: (value.match(/[^A-Za-z0-9\s]/g) || []).length >= 2,
      },
      {
        key: "spaces",
        label: "No spaces",
        valid: value.length > 0 && !/\s/.test(value),
      },
    ];
  }, [form.password]);

  const allPasswordRulesValid =
    form.password.length > 0 && passwordRules.every((rule) => rule.valid);

  const fieldError = (name) => {
    if (!touched[name]) return "";
    const value = form[name]?.trim();

    if (name === "fullName") {
      if (!value) return "Full name is required.";
      if (!FULL_NAME_PATTERN.test(value)) {
        return "Enter first and last name using letters only.";
      }
    }

    if (name === "email") {
      if (!value) return "Email address is required.";
      if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address.";
    }

    if (name === "phone") {
      if (!value) return "Mobile number is required.";
      if (!PHONE_PATTERN.test(value)) {
        return "Enter exactly 10 digits starting with 6, 7, 8 or 9.";
      }
    }

    if (name === "password") {
      if (!form.password) return "Password is required.";
      if (!allPasswordRulesValid) return "Complete the password requirements below.";
    }

    if (name === "confirmPassword") {
      if (!form.confirmPassword) return "Confirm password is required.";
      if (form.confirmPassword !== form.password) return "Passwords do not match.";
    }

    return "";
  };

  if (isLoggedIn) {
    return (
      <Navigate
        to={isAdmin ? "/admin" : isDriver ? "/driver" : "/cars"}
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "fullName") {
      nextValue = value
        .replace(/[^A-Za-z\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .slice(0, 60);
    }
    if (name === "email") nextValue = value.replace(/\s/g, "").toLowerCase();
    if (name === "phone") nextValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "password" || name === "confirmPassword") {
      nextValue = value.replace(/\s/g, "");
    }

    setForm((current) => ({ ...current, [name]: nextValue }));
    setError("");
    setMessage("");
  };

  const handleBlur = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
  };

  const validateAll = () => {
    const allTouched = {
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    return (
      FULL_NAME_PATTERN.test(form.fullName.trim()) &&
      EMAIL_PATTERN.test(form.email.trim()) &&
      PHONE_PATTERN.test(form.phone.trim()) &&
      allPasswordRulesValid &&
      form.confirmPassword === form.password
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateAll()) return;

    try {
      setLoading(true);
      await API.post("/auth/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      setMessage("Account created successfully. Redirecting to sign in...");
      window.setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (requestError.code === "ERR_NETWORK"
            ? "Unable to connect to the server. Please try again."
            : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFeedback = (name) => {
    const currentError = fieldError(name);
    const value = form[name];
    if (!touched[name] && !value) return null;

    if (currentError) {
      return (
        <motion.div className="inline-validation invalid" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          <XCircle size={15} />
          <span>{currentError}</span>
        </motion.div>
      );
    }

    if (value) {
      return (
        <motion.div className="inline-validation valid" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          <CheckCircle2 size={15} />
          <span>{name === "phone" ? "Valid mobile number" : "Looks good"}</span>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <main className="login-page">
      <div className="login-background-orb orb-one" />
      <div className="login-background-orb orb-two" />

      <motion.section
        className="login-experience register-experience"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="login-visual-panel register-visual-panel">
          <img src={REGISTER_CAR_IMAGE} alt="Premium RentRide vehicle" className="login-visual-image" />
          <div className="login-image-overlay" />

          <div className="login-brand-mark">
            <span><CarFront size={24} /></span>
            <div><strong>RentRide</strong><small>Create your journey</small></div>
          </div>

          <div className="login-visual-content">
            <div className="login-kicker"><Sparkles size={16} /> Join RentRide today</div>
            <h1>Create your account and start booking your next ride.</h1>
            <p>Secure registration, verified cars and complete trip management in one place.</p>
            <div className="login-benefits">
              <div><CheckCircle2 size={18} /> Secure account access</div>
              <div><CheckCircle2 size={18} /> Verified rental fleet</div>
              <div><CheckCircle2 size={18} /> Booking history and support</div>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-inner register-form-inner">
            <button type="button" className="register-back-button" onClick={() => navigate("/")}>
              <ArrowLeft size={18} /> Back to login
            </button>

            <span className="login-form-badge"><ShieldCheck size={16} /> Secure registration</span>
            <h2>Create account</h2>
            <p className="login-form-subtitle">Enter accurate details to create your RentRide account.</p>

            <AnimatePresence>
              {error && <motion.div className="error-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
              {message && <motion.div className="success-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{message}</motion.div>}
            </AnimatePresence>

            <form className="login-form register-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="fullName">Full name</label>
              <div className={`login-input ${fieldError("fullName") ? "input-error" : ""}`}>
                <UserRound size={19} />
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="First and last name" autoComplete="name" />
              </div>
              {renderFeedback("fullName")}

              <label htmlFor="registerEmail">Email address</label>
              <div className={`login-input ${fieldError("email") ? "input-error" : ""}`}>
                <Mail size={19} />
                <input id="registerEmail" type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" autoComplete="email" />
              </div>
              {renderFeedback("email")}

              <label htmlFor="phone">Phone number</label>
              <div className={`login-input ${fieldError("phone") ? "input-error" : ""}`}>
                <Phone size={19} />
                <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur} placeholder="9876543210" inputMode="numeric" maxLength={10} autoComplete="tel" />
              </div>
              {renderFeedback("phone")}

              <label htmlFor="registerPassword">Password</label>
              <div className={`login-input ${fieldError("password") ? "input-error" : ""}`}>
                <LockKeyhole size={19} />
                <input id="registerPassword" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="Create a secure password" autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <AnimatePresence>
                {form.password.length > 0 && (
                  <motion.div className="professional-rule-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    {allPasswordRulesValid ? (
                      <div className="password-strong"><CheckCircle2 size={16} /> Strong password</div>
                    ) : (
                      passwordRules.map((rule) => (
                        <div key={rule.key} className={`professional-rule ${rule.valid ? "valid" : "invalid"}`}>
                          {rule.valid ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                          <span>{rule.label}</span>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <label htmlFor="confirmPassword">Confirm password</label>
              <div className={`login-input ${fieldError("confirmPassword") ? "input-error" : ""}`}>
                <LockKeyhole size={19} />
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="Enter password again" autoComplete="new-password" />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((current) => !current)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {renderFeedback("confirmPassword")}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="login-register-link">
              Already have an account? <button type="button" onClick={() => navigate("/")}>Sign in here</button>
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default Register;
