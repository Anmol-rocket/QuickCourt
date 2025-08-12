"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  Save,
  X,
  Menu,
} from "lucide-react";
import BASE_URL from "../../api/baseURL";
import styles from "./VenueSportsDetail.module.css";
import dashboardStyles from "./FacilityOwnerDashboard.module.css";

// Navbar component consistent with dashboard
const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const userName = localStorage.getItem("fullName") || "Alex Johnson";
  const userEmail = localStorage.getItem("email") || "alex@example.com";
  const userAvatar = localStorage.getItem("avatarUrl") || "";
  const navigate = useNavigate();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={dashboardStyles.navbar}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1500,
        marginTop: 0,
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className={dashboardStyles.navbarContent}>
        <div
          className={dashboardStyles.navbarBrand}
          onClick={() => navigate("/facility-owner-dashboard")}
          style={{ cursor: "pointer" }}
        >
          <h2 className={dashboardStyles.brandTitle}>QUICKCOURT</h2>
        </div>

        {/* Desktop Menu */}
        {!isMobile && (
          <div className={dashboardStyles.navbarMenu}>
            <Link
              to="/facility-owner-dashboard/my-bookings"
              className={dashboardStyles.navLink}
            >
              My Bookings
            </Link>
            <Link
              to="/facility-owner-dashboard/my-venues"
              className={dashboardStyles.navLink}
            >
              My Venues
            </Link>
            <Link
              to="/facility-owner-dashboard/refund"
              className={dashboardStyles.navLink}
            >
              Refund
            </Link>
          </div>
        )}

        {/* Desktop User Section */}
        {!isMobile && (
          <div className={dashboardStyles.userSection}>
            <div
              className={dashboardStyles.userProfile}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className={dashboardStyles.userAvatar}>
                {userAvatar ? (
                  <img
                    src={userAvatar || "/placeholder.svg"}
                    alt={userName}
                    className={dashboardStyles.avatarImage}
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className={dashboardStyles.userInfo}>
                <span className={dashboardStyles.userName}>{userName}</span>
                <span className={dashboardStyles.userEmail}>{userEmail}</span>
              </div>
            </div>

            {userMenuOpen && (
              <div className={dashboardStyles.userDropdown}>
                <Link
                  to="/facility-owner-dashboard/profile"
                  className={dashboardStyles.dropdownItem}
                >
                  Profile
                </Link>
                <hr className={dashboardStyles.dropdownDivider} />
                <button
                  className={dashboardStyles.dropdownItem}
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <Menu size={24} color="#333" />
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            zIndex: 1400,
            padding: "1rem",
            borderTop: "1px solid #e0e0e0",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          {/* Close Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <X size={24} color="#666" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              to="/facility-owner-dashboard/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                padding: "1rem",
                textDecoration: "none",
                color: "#333",
                fontSize: "1.1rem",
                fontWeight: "500",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              📅 My Bookings
            </Link>
            <Link
              to="/facility-owner-dashboard/my-venues"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                padding: "1rem",
                textDecoration: "none",
                color: "#333",
                fontSize: "1.1rem",
                fontWeight: "500",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              🏢 My Venues
            </Link>
            <Link
              to="/facility-owner-dashboard/refund"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                padding: "1rem",
                textDecoration: "none",
                color: "#333",
                fontSize: "1.1rem",
                fontWeight: "500",
                borderBottom: "1px solid #f0f0f0",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              💰 Refund
            </Link>
          </div>

          {/* Mobile User Section */}
          <div
            style={{
              borderTop: "2px solid #f0f0f0",
              paddingTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={24} color="#666" />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    color: "#333",
                  }}
                >
                  {userName}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  {userEmail}
                </div>
              </div>
            </div>

            <Link
              to="/facility-owner-dashboard/profile"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                padding: "1rem",
                textDecoration: "none",
                color: "#333",
                fontSize: "1.1rem",
                fontWeight: "500",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                marginBottom: "0.5rem",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e9ecef";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
              }}
            >
              👤 Profile
            </Link>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#c82333";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#dc3545";
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
};

const UpdateSportsDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get sport data passed from VenueSportsDetail
  const [sportData, setSportData] = useState(location.state?.sport);
  const venueData = location.state?.venue;

  // Get owner email and token from localStorage (following MyVenue pattern)
  const ownerEmail = localStorage.getItem("email") || "";
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt") ||
    "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [venueDetails, setVenueDetails] = useState(null);
  const [venueLoading, setVenueLoading] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    type: "Indoor",
    pricePerHour: "",
    operatingHours: "",
  });

  const fetchVenueDetails = useCallback(
    async (venueId) => {
      if (!venueId || !token) return;

      try {
        setVenueLoading(true);
        console.log("Fetching venue details for ID:", venueId);

        const response = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized access to venue details");
            return;
          }
          throw new Error(`Failed to fetch venue details: ${response.status}`);
        }

        const venue = await response.json();
        console.log("Fetched venue details:", venue);
        setVenueDetails(venue);
      } catch (err) {
        console.error("Error fetching venue details:", err);
      } finally {
        setVenueLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    console.log("UpdateSportsDetails: token:", token ? "exists" : "missing");
    console.log("UpdateSportsDetails: email:", ownerEmail);
    console.log("UpdateSportsDetails: sportData:", sportData);
    console.log("UpdateSportsDetails: venueData:", venueData);
    console.log("UpdateSportsDetails: venueData.id:", venueData?.id);

    // Check authentication (following MyVenue pattern)
    if (!token || !ownerEmail) {
      setError("Authentication required. Please log in again.");
      // Clear invalid authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authToken");
      localStorage.removeItem("jwt");
      localStorage.removeItem("email");
      window.location.href = "/login";
      return;
    }

    // Fetch venue details if venue ID is available
    if (venueData?.id) {
      fetchVenueDetails(venueData.id);
    }

    if (sportData) {
      setUpdateForm({
        name: sportData.name || "",
        type: sportData.type || "Indoor",
        pricePerHour: sportData.pricePerHour || "",
        operatingHours: sportData.operatingHours || "",
      });
    } else {
      setError("Sport data not found. Please try again.");
      navigate(-1);
    }
  }, [sportData, venueData, ownerEmail, token, navigate, fetchVenueDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(
        "UpdateSportsDetails API call: token:",
        token ? "exists" : "missing"
      );
      console.log("UpdateSportsDetails API call: sportData.id:", sportData.id);

      const response = await fetch(
        `${BASE_URL}/api/sports/${sportData.id}/venue`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
          body: JSON.stringify({
            name: updateForm.name,
            type: updateForm.type,
            pricePerHour: parseFloat(updateForm.pricePerHour),
            operatingHours: updateForm.operatingHours,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to update sport details";

        if (response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
          // Clear invalid authentication data
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("authToken");
          localStorage.removeItem("jwt");
          localStorage.removeItem("email");
          alert(errorMessage);
          window.location.href = "/login";
          return;
        } else if (response.status === 403) {
          errorMessage =
            "Permission denied. You don't have access to update sports.";
        } else if (response.status === 404) {
          errorMessage = "Sport not found.";
        } else if (response.status === 400) {
          // Try to get specific error message from response
          try {
            const errorData = await response.json();
            errorMessage =
              errorData.message || errorData.error || "Invalid request data.";
          } catch {
            errorMessage = "Invalid request data.";
          }
        } else {
          errorMessage = `Failed to update sport. Server error: ${response.status}`;
        }

        alert(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Sport updated successfully:", result);

      // Update the local sport data to reflect changes immediately
      const updatedSportData = {
        ...sportData,
        name: updateForm.name,
        type: updateForm.type,
        pricePerHour: parseFloat(updateForm.pricePerHour),
        operatingHours: updateForm.operatingHours,
      };

      // Update the sport data state to show changes immediately on the page
      setSportData(updatedSportData);
      console.log("Updated sport data in state:", updatedSportData);

      // Show success alert
      alert("Sport details updated successfully!");
    } catch (err) {
      let errorMessage = err.message || "Failed to update sport details";

      // Handle specific network errors
      if (
        err.message?.includes("CORS") ||
        err.message?.includes("ERR_FAILED")
      ) {
        errorMessage =
          "Network error: Unable to connect to server. Please check if the backend server is running and CORS is properly configured.";
      } else if (err.message?.includes("Failed to fetch")) {
        errorMessage =
          "Connection error: Unable to reach the server. Please check your network connection and try again.";
      }

      setError(errorMessage);
      alert(errorMessage);
      console.error("Update sport error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSportIcon = (sportName) => {
    const icons = {
      badminton: "🏸",
      tennis: "🎾",
      soccer: "⚽",
      football: "🏈",
      basketball: "🏀",
      volleyball: "🏐",
      cricket: "🏏",
      squash: "🎾",
      "table tennis": "🏓",
      default: "🏃",
    };
    return icons[sportName?.toLowerCase()] || icons.default;
  };

  if (!sportData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>No Sport Data Found</h2>
          <p>Please go back and select a sport to update.</p>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={dashboardStyles.dashboard}>
      <Navbar />

      {/* Header Section */}
      <header
        className={dashboardStyles.dashboardHeader}
        style={{
          marginTop: "100px", // Increased from 80px to prevent overlap
          paddingTop: "2rem",
        }}
      >
        <div className={dashboardStyles.headerContent}>
          <div className={dashboardStyles.welcomeSection}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(72, 166, 167, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(72, 166, 167, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(72, 166, 167, 0.3)";
              }}
            >
              <ArrowLeft size={16} />
              Back to Sports
            </button>
            <h1 className={dashboardStyles.welcomeTitle}>
              <span style={{ fontSize: "2rem", marginRight: "0.5rem" }}>
                {getSportIcon(sportData.name)}
              </span>
              Update {sportData.name}
            </h1>
            <p className={dashboardStyles.welcomeSubtitle}>
              <MapPin
                size={16}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              {venueDetails?.name || venueData?.name || "Venue"} -{" "}
              {venueDetails?.address ||
                venueData?.address ||
                "Address not available"}
              {venueLoading && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.8rem",
                    opacity: 0.7,
                  }}
                >
                  (Loading venue details...)
                </span>
              )}
            </p>
          </div>
          <div className={dashboardStyles.headerActions}>
            <div
              className={dashboardStyles.timeDisplay}
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-2), var(--accent-3))",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Save size={20} />
              Edit Mode
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        style={{ padding: "0 2rem 2rem", maxWidth: "1400px", margin: "0 auto" }}
      >
        {/* Venue Information Debug Panel */}
        {(venueData || venueDetails) && (
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              color: "white",
            }}
          >
            <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
              📍 Venue Information {venueLoading && "(Loading...)"}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <strong>Venue ID:</strong>{" "}
                {venueDetails?.id || venueData?.id || "Not available"}
              </div>
              <div>
                <strong>Name:</strong>{" "}
                {venueDetails?.name || venueData?.name || "Not available"}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {venueDetails?.address || venueData?.address || "Not available"}
              </div>
              <div>
                <strong>Description:</strong>{" "}
                {venueDetails?.description ||
                  venueData?.description ||
                  "Not available"}
              </div>
              <div>
                <strong>Rating:</strong>{" "}
                {venueDetails?.rating
                  ? `${venueDetails.rating}/5 stars`
                  : "Not available"}
              </div>
              <div>
                <strong>Amenities:</strong>{" "}
                {venueDetails?.amenities
                  ? venueDetails.amenities.join(", ")
                  : "Not available"}
              </div>
            </div>
          </div>
        )}

        {/* Current Sport Info Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className={dashboardStyles.kpiCard}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className={dashboardStyles.kpiHeader}>
              <div
                className={dashboardStyles.kpiIcon}
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Clock size={24} color="white" />
              </div>
            </div>
            <div className={dashboardStyles.kpiContent}>
              <h3
                className={dashboardStyles.kpiValue}
                style={{ color: "white" }}
              >
                {sportData.operatingHours}
              </h3>
              <p
                className={dashboardStyles.kpiTitle}
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Operating Hours
              </p>
            </div>
          </div>

          <div
            className={dashboardStyles.kpiCard}
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <div className={dashboardStyles.kpiHeader}>
              <div
                className={dashboardStyles.kpiIcon}
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <DollarSign size={24} color="white" />
              </div>
            </div>
            <div className={dashboardStyles.kpiContent}>
              <h3
                className={dashboardStyles.kpiValue}
                style={{ color: "white" }}
              >
                ₹{sportData.pricePerHour}
              </h3>
              <p
                className={dashboardStyles.kpiTitle}
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Per Hour
              </p>
            </div>
          </div>

          <div
            className={dashboardStyles.kpiCard}
            style={{
              background:
                sportData.type?.toLowerCase() === "indoor"
                  ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            }}
          >
            <div className={dashboardStyles.kpiHeader}>
              <div
                className={dashboardStyles.kpiIcon}
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <MapPin size={24} color="white" />
              </div>
            </div>
            <div className={dashboardStyles.kpiContent}>
              <h3
                className={dashboardStyles.kpiValue}
                style={{ color: "white" }}
              >
                {sportData.type}
              </h3>
              <p
                className={dashboardStyles.kpiTitle}
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Sport Type
              </p>
            </div>
          </div>
        </div>

        {/* Update Form Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "2.5rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "2.5rem",
              paddingBottom: "2rem",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                background:
                  "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {getSportIcon(sportData.name)}
            </div>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
                background:
                  "linear-gradient(135deg, var(--accent-2), var(--accent-3))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Update Sport Information
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                fontWeight: "400",
              }}
            >
              Modify the sport details below to keep your information up to date
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
                  color: "white",
                  padding: "1.2rem",
                  borderRadius: "12px",
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                }}
              >
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                marginBottom: "2.5rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sport Name *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updateForm.name}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      border: "2px solid #e8ecef",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fafbfc",
                      fontFamily: "inherit",
                      fontWeight: "500",
                    }}
                    placeholder="Enter sport name"
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-2)";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(72, 166, 167, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8ecef";
                      e.target.style.background = "#fafbfc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                    }}
                  >
                    🏃
                  </div>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label
                  htmlFor="type"
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sport Type *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    id="type"
                    name="type"
                    value={updateForm.type}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      border: "2px solid #e8ecef",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fafbfc",
                      fontFamily: "inherit",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-2)";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(72, 166, 167, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8ecef";
                      e.target.style.background = "#fafbfc";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <option value="Indoor">🏢 Indoor</option>
                    <option value="Outdoor">🌤️ Outdoor</option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                    }}
                  >
                    📍
                  </div>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label
                  htmlFor="pricePerHour"
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Price Per Hour (₹) *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    id="pricePerHour"
                    name="pricePerHour"
                    value={updateForm.pricePerHour}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      border: "2px solid #e8ecef",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fafbfc",
                      fontFamily: "inherit",
                      fontWeight: "500",
                    }}
                    placeholder="Enter price per hour"
                    min="0"
                    step="0.01"
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-2)";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(72, 166, 167, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8ecef";
                      e.target.style.background = "#fafbfc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                    }}
                  >
                    💰
                  </div>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <label
                  htmlFor="operatingHours"
                  style={{
                    display: "block",
                    marginBottom: "0.8rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Operating Hours *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    id="operatingHours"
                    name="operatingHours"
                    value={updateForm.operatingHours}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "1rem 1rem 1rem 3rem",
                      border: "2px solid #e8ecef",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "#fafbfc",
                      fontFamily: "inherit",
                      fontWeight: "500",
                    }}
                    placeholder="e.g., 09:00 - 22:00"
                    required
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-2)";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(72, 166, 167, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8ecef";
                      e.target.style.background = "#fafbfc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                    }}
                  >
                    🕒
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                justifyContent: "center",
                paddingTop: "2rem",
                borderTop: "2px solid #f0f0f0",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                style={{
                  padding: "1rem 2rem",
                  border: "2px solid #e8ecef",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "140px",
                  background: "white",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#e8ecef";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <X size={18} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "1rem 2rem",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "160px",
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 4px 15px rgba(72, 166, 167, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(72, 166, 167, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(72, 166, 167, 0.3)";
                  }
                }}
              >
                <Save size={18} />
                {loading ? "Updating..." : "Update Sport"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSportsDetails;
