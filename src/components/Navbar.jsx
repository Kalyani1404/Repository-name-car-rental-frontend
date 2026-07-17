import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  CarFront,
  ChevronDown,
  Gauge,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const getDisplayName = (user) =>
  user?.fullName?.trim() ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.email?.split("@")[0] ||
  "My Profile";

const getInitials = (user) =>
  getDisplayName(user)
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

function Navbar() {
  const { user, isLoggedIn, isAdmin, isDriver, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeProfile = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeProfile);
    return () => document.removeEventListener("mousedown", closeProfile);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (!isLoggedIn) return null;

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to={isDriver ? "/driver" : isAdmin ? "/admin" : "/cars"} className="nav-logo" aria-label="RentRide dashboard">
          <span className="nav-logo-icon"><CarFront size={23} /></span>
          <span className="nav-logo-text">RentRide</span>
        </Link>

        <button type="button" className="nav-toggle" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Toggle navigation">
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {!isDriver && <NavLink to="/cars"><CarFront size={17} /> Cars</NavLink>}
          {!isDriver && <NavLink to="/my-bookings"><CalendarDays size={17} /> My Bookings</NavLink>}
          {isDriver && <NavLink to="/driver"><LayoutDashboard size={17} /> Driver Center</NavLink>}

          <NavLink to="/notifications"><Bell size={17} /> Notifications</NavLink>
          <NavLink to="/safety"><HeartHandshake size={17} /> Safety</NavLink>

          {isAdmin && (
            <>
              <NavLink to="/admin"><Gauge size={17} /> Fleet</NavLink>
              <NavLink to="/admin/operations"><ShieldCheck size={17} /> Operations</NavLink>
              <NavLink to="/admin/add-car" className="add-car-nav"><PlusCircle size={17} /> Add Car</NavLink>
            </>
          )}

          <div className="profile-menu" ref={profileRef}>
            <button type="button" className="profile-trigger" onClick={() => setProfileOpen((current) => !current)}>
              <span className="profile-avatar">{getInitials(user)}</span>
              <span className="profile-trigger-copy"><strong>{getDisplayName(user)}</strong><small>{user?.role || "USER"}</small></span>
              <ChevronDown size={17} className={profileOpen ? "chevron-open" : ""} />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-head">
                  <span className="profile-avatar large">{getInitials(user)}</span>
                  <div><strong>{getDisplayName(user)}</strong><p>{user?.email || "Logged-in account"}</p></div>
                </div>
                <div className="profile-role"><span>{user?.role || "USER"}</span><small>{user?.provider || "LOCAL"}</small></div>
                <Link to="/profile"><UserRound size={18} /> View profile</Link>
                <Link to="/notifications"><Bell size={18} /> Notifications</Link>
                <Link to="/safety"><HeartHandshake size={18} /> Safety center</Link>
                <button type="button" onClick={handleLogout}><LogOut size={18} /> Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
