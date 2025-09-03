"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../api/baseURL";
import styles from "./VenueSportsDetail.module.css";

const VenueSportsDetail = (props) => {
  // console.log(props);
  const location = useLocation();
  const navigate = useNavigate();
  const venueId = location.state?.venueId || props.venueId || 1;
  // Venue object from router state or props
  const venue = location.state?.venue || {
    id: props.venueId || 1,
    name: props.venueName || "",
    description: props.venueDescription || "",
    address: props.venueAddress || "",
    photoUrls: props.photoUrls || [],
  };

  const venueName = location.state?.venueName || props.venueName || "";
  const venueAddress = location.state?.venueAddress || "";

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("jwt") ||
          "";
        console.log("VenueSportsDetail.jsx: venueId:", venueId);
        console.log("VenueSportsDetail.jsx: token:", token);
        const response = await fetch(
          `${BASE_URL}/api/sports/venue/${venueId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.trim()}`,
            },
          }
        );
        console.log("VenueSportsDetail.jsx: response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("VenueSportsDetail.jsx: API error:", errorText);
          if (response.status === 404) {
            throw new Error("Venue not found");
          }
          throw new Error(`Failed to fetch sports data: ${errorText}`);
        }
        const data = await response.json();
        console.log("VenueSportsDetail.jsx: sports data:", data);
        setSports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, [venueId]);

  const renderStars = (rating) => {
    const stars = [];
    const maxRating = 5;

    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      );
    }
    return stars;
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
    return icons[sportName.toLowerCase()] || icons.default;
  };

  const getTypeColor = (type) => {
    return type.toLowerCase() === "indoor"
      ? styles.typeIndoor
      : styles.typeOutdoor;
  };

  const handleBookNow = (sport) => {
    setSelectedSport(sport);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedSport(null);
  };

  const getFilteredSports = () => {
    if (activeFilter === "indoor") {
      return sports.filter((s) => s.type.toLowerCase() === "indoor");
    }
    if (activeFilter === "outdoor") {
      return sports.filter((s) => s.type.toLowerCase() === "outdoor");
    }
    if (activeFilter === "under25") {
      return sports.filter((s) => s.pricePerHour <= 25);
    }
    return sports;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading sports information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Sports</h2>
          <p>{error}</p>
          <pre
            style={{
              color: "red",
              background: "#fffbe6",
              padding: "1em",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {error}
          </pre>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Add validation for venue data
  if (!venueId || (!venueName && !location.state?.venueName)) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/facility-owner-dashboard/my-venues")}
          >
            ← Back to Venues
          </button>
          <div className={styles.venueInfo}>
            <h1 className={styles.venueName}>Venue Not Found</h1>
            <p className={styles.venueAddress}>
              Please select a venue from the My Venues page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          ← Back to Venues
        </button>
        <div className={styles.venueInfo}>
          <h1 className={styles.venueName}>{venueName}</h1>
          <p className={styles.venueAddress}>📍 {venueAddress}</p>
          {venue.description && (
            <p className={styles.venueDescription}>{venue.description}</p>
          )}
          {venue.photoUrls && venue.photoUrls.length > 0 && (
            <img
              src={venue.photoUrls[0]}
              alt={venue.name}
              className={styles.venueImage}
            />
          )}
          <div className={styles.venueStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{sports.length}</span>
              <span className={styles.statLabel}>Sports Available</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {sports.filter((s) => s.type === "Indoor").length}
              </span>
              <span className={styles.statLabel}>Indoor Sports</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {sports.filter((s) => s.type === "Outdoor").length}
              </span>
              <span className={styles.statLabel}>Outdoor Sports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Section */}
      {sports.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏃</div>
          <h3>No Sports Available</h3>
          <p>This venue doesn't have any sports configured yet.</p>
        </div>
      ) : (
        <div className={styles.sportsSection}>
          <div className={styles.sectionHeader}>
            <h2>Available Sports</h2>
            <p>
              Choose from our variety of sports and book your preferred time
              slot
            </p>
          </div>

          <div className={styles.sportsGrid}>
            {getFilteredSports().map((sport) => (
              <div
                key={sport.id}
                className={`${styles.sportCard} ${styles.fadeIn}`}
              >
                <div className={styles.sportHeader}>
                  <div className={styles.sportIcon}>
                    {getSportIcon(sport.name)}
                  </div>
                  <div className={styles.sportTitleSection}>
                    <h3 className={styles.sportName}>{sport.name}</h3>
                    <span
                      className={`${styles.sportType} ${getTypeColor(
                        sport.type
                      )}`}
                    >
                      {sport.type}
                    </span>
                  </div>
                  <div className={styles.sportPrice}>
                    <span className={styles.priceAmount}>
                      ₹{sport.pricePerHour}
                    </span>
                    <span className={styles.priceUnit}>/hour</span>
                  </div>
                </div>

                <div className={styles.sportDetails}>
                  <div className={styles.detailRow}>
                    <div className={styles.detailIcon}>🕒</div>
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>
                        Operating Hours
                      </span>
                      <span className={styles.detailValue}>
                        {sport.operatingHours}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <div className={styles.detailIcon}>⭐</div>
                    <div className={styles.detailContent}>
                      <span className={styles.detailLabel}>Rating</span>
                      <div className={styles.ratingSection}>
                        <div className={styles.stars}>
                          {renderStars(Math.round(sport.averageRating))}
                        </div>
                        <span className={styles.ratingText}>
                          {sport.averageRating > 0
                            ? sport.averageRating.toFixed(1)
                            : "No ratings yet"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {sport.comments && sport.comments.length > 0 && (
                    <div className={styles.detailRow}>
                      <div className={styles.detailIcon}>💬</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Reviews</span>
                        <span className={styles.detailValue}>
                          {sport.comments.length} reviews
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.sportActions}>
                  <button
                    className={styles.viewDetailsButton}
                    onClick={() => {
                      navigate(
                        "/facility-owner-dashboard/my-venues/update-sports",
                        {
                          state: {
                            sport: sport,
                            venue: {
                              id: venueId,
                              name: venueName,
                              address: venueAddress,
                              ...venue,
                            },
                          },
                        }
                      );
                    }}
                  >
                    Edit Details
                  </button>
                  {/* <button
                    className={styles.bookNowButton}
                    onClick={() => handleBookNow(sport)}
                  >
                    Book Now
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div className={styles.filtersSection}>
        <h3>Filter by Type</h3>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "all" ? styles.filterActive : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All Sports
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "indoor" ? styles.filterActive : ""
            }`}
            onClick={() => setActiveFilter("indoor")}
          >
            Indoor Only
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "outdoor" ? styles.filterActive : ""
            }`}
            onClick={() => setActiveFilter("outdoor")}
          >
            Outdoor Only
          </button>
          <button
            className={`${styles.filterButton} ${
              activeFilter === "under25" ? styles.filterActive : ""
            }`}
            onClick={() => setActiveFilter("under25")}
          >
            Under ₹25/hr
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedSport && (
        <div className={styles.modalOverlay} onClick={closeBookingModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Book {selectedSport.name}</h3>
              <button
                className={styles.closeButton}
                onClick={closeBookingModal}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.bookingSummary}>
                <div className={styles.summaryRow}>
                  <span>Sport:</span>
                  <span>{selectedSport.name}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Type:</span>
                  <span>{selectedSport.type}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Price:</span>
                  <span>₹{selectedSport.pricePerHour}/hour</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Operating Hours:</span>
                  <span>{selectedSport.operatingHours}</span>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelButton}
                  onClick={closeBookingModal}
                >
                  Cancel
                </button>
                <button className={styles.proceedButton}>
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className={styles.contactSection}>
        <div className={styles.contactCard}>
          <h3>Need Help?</h3>
          <p>
            Contact the venue directly for special requests or group bookings.
          </p>
          <div className={styles.contactActions}>
            <button className={styles.callButton}>📞 Call Venue</button>
            <button className={styles.messageButton}>💬 Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSportsDetail;
