import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-mark">RC</span>
        Courses
      </div>

      {isAuthenticated && (
        <>
          <nav className="topbar-nav">
            <NavLink
              to="/courses"
              className={({ isActive }) => "topbar-link" + (isActive ? " active" : "")}
            >
              Catalog
            </NavLink>
            <NavLink
              to="/enrollments"
              className={({ isActive }) => "topbar-link" + (isActive ? " active" : "")}
            >
              My Enrollments
            </NavLink>
          </nav>

          <div className="topbar-user">
            <span className="topbar-username">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </>
      )}
    </header>
  );
}
