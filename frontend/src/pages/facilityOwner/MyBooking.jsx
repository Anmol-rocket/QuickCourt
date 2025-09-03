"use client";

import { useState, useEffect } from "react";
import { User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../../api/baseURL";
import styles from "./MyBooking.module.css";
import dashboardStyles from "./FacilityOwnerDashboard.module.css";

// Navbar styled according to FacilityOwnerDashboard.module.css, scoped to avoid disturbing MyBooking styles
const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = localStorage.getItem("fullName") || "Alex Johnson";
  const userEmail = localStorage.getItem("email") || "alex@example.com";
  const userAvatar = localStorage.getItem("avatarUrl") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
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

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <Menu size={24} color="#333" />
            </button>
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
                  <a
                    href="/facility-owner-dashboard/my-bookings/profile"
                    className={dashboardStyles.dropdownItem}
                  >
                    Profile
                  </a>
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
        </div>
      </nav>

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

            <a
              href="/facility-owner-dashboard/my-bookings/profile"
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
            </a>

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
    </>
  );
};

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venueDetails, setVenueDetails] = useState({});

  // Get facility owner email from localStorage
  const facilityOwnerEmail = localStorage.getItem("email") || "";

  const fetchVenueDetails = async (venueId) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch venue details for ID: ${venueId}`);
      }

      const venueData = await response.json();
      return venueData;
    } catch (err) {
      console.error(`Error fetching venue ${venueId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const response = await fetch(
          `${BASE_URL}/api/bookings/getByOwner?ownerEmail=${encodeURIComponent(
            facilityOwnerEmail
          )}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        // Fetch venue details for each unique venue ID
        const uniqueVenueIds = [
          ...new Set(data.map((booking) => booking.venueId)),
        ];
        const venueDetailsMap = {};

        await Promise.all(
          uniqueVenueIds.map(async (venueId) => {
            const venueData = await fetchVenueDetails(venueId);
            if (venueData) {
              venueDetailsMap[venueId] = venueData;
            }
          })
        );

        setVenueDetails(venueDetailsMap);
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [facilityOwnerEmail]);

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Bookings</h2>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div
        className={styles.header}
        style={{
          marginTop: "100px", // Increased from 80px to prevent overlap
          paddingTop: "2rem",
        }}
      >
        <h1 className={styles.title}>My Bookings</h1>
        <p className={styles.subtitle}>
          Manage and track all your venue bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3>No Bookings Found</h3>
          <p>You don't have any bookings yet. Start by booking a venue!</p>
        </div>
      ) : (
        <div className={styles.bookingsGrid}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`${styles.bookingCard} ${styles.fadeIn}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.bookingId}>Booking #{booking.id}</div>
                <div
                  className={`${styles.status} ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.venueInfo}>
                  <h3 className={styles.venueName}>
                    {venueDetails[booking.venueId]?.name ||
                      `Venue ID: ${booking.venueId}`}
                  </h3>
                  <p className={styles.sportInfo}>
                    {booking.sportName || `Sport ID: ${booking.sportId}`}
                  </p>
                </div>

                <div className={styles.customerInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Customer:</span>
                    <span className={styles.value}>{booking.userEmail}</span>
                  </div>
                </div>

                <div className={styles.slotsSection}>
                  <h4 className={styles.slotsTitle}>Time Slots</h4>
                  {booking.slots.map((slot, index) => (
                    <div key={index} className={styles.slotCard}>
                      <div className={styles.timeInfo}>
                        <div className={styles.timeSlot}>
                          <span className={styles.timeLabel}>Start:</span>
                          <span className={styles.timeValue}>
                            {formatDateTime(slot.startDateTime)}
                          </span>
                        </div>
                        <div className={styles.timeSlot}>
                          <span className={styles.timeLabel}>End:</span>
                          <span className={styles.timeValue}>
                            {formatDateTime(slot.endDateTime)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.slotPrice}>
                        ${slot.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.totalPrice}>
                    <span className={styles.totalLabel}>Total Amount:</span>
                    <span className={styles.totalValue}>
                      ${booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.bookingDate}>
                    Booked on:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                {/* <button className={styles.viewButton}>View Details</button>
                <button className={styles.contactButton}>
                  Contact Customer
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
