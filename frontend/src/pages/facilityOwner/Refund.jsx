import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  DollarSign,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import BASE_URL from "../../api/baseURL";
import StripePaymentModal from "../../components/StripePaymentModal";
import styles from "./Refund.module.css";
import dashboardStyles from "./FacilityOwnerDashboard.module.css";

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
    </>
  );
};

const Refund = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [processingRefund, setProcessingRefund] = useState(null);
  const [bookingsCache, setBookingsCache] = useState({}); // cache bookings per userEmail
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refundToProcess, setRefundToProcess] = useState(null);

  // Get owner email from localStorage
  const ownerEmail = localStorage.getItem("email");

  // Fetch refunds on component mount
  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        const response = await fetch(
          `${BASE_URL}/api/refunds/owner?ownerMail=${encodeURIComponent(
            ownerEmail
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to view refunds.");
          } else if (response.status === 404) {
            throw new Error("No refunds found.");
          } else {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to fetch refunds");
          }
        }

        const data = await response.json();
        setRefunds(data);
      } catch (err) {
        console.error("Error fetching refunds:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (ownerEmail) {
      fetchRefunds();
    } else {
      setError("Owner email not found. Please log in again.");
      setLoading(false);
    }
  }, [ownerEmail]);

  // Refetch function for retry button
  const refetchRefunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${BASE_URL}/api/refunds/owner?ownerMail=${encodeURIComponent(
          ownerEmail
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          throw new Error("Authentication failed. Redirecting to login...");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to view refunds.");
        } else if (response.status === 404) {
          throw new Error("No refunds found.");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch refunds");
        }
      }

      const data = await response.json();
      setRefunds(data);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for a user (cache) and extract booking matching refund.bookingId
  const fetchBookingDetailsForRefund = async (refund) => {
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Authentication token not found. Please log in again.");

      const userEmail = refund.userEmail;

      let userBookings = bookingsCache[userEmail];
      if (!userBookings) {
        const resp = await fetch(
          `${BASE_URL}/api/bookings/user/${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!resp.ok) {
          if (resp.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (resp.status === 403) {
            throw new Error("You don't have permission to view bookings.");
          } else if (resp.status === 404) {
            throw new Error("No bookings found for this user.");
          } else {
            const errorText = await resp.text();
            throw new Error(errorText || "Failed to fetch bookings");
          }
        }
        userBookings = await resp.json();
        setBookingsCache((prev) => ({ ...prev, [userEmail]: userBookings }));
      }

      const booking = (userBookings || []).find(
        (b) => Number(b.id) === Number(refund.bookingId)
      );
      if (!booking) throw new Error("Booking not found for this refund.");

      // Transform booking to fit previously used fields
      const firstSlot =
        booking.slots && booking.slots.length ? booking.slots[0] : null;
      const transformed = {
        id: booking.id,
        userEmail: booking.userEmail,
        venueId: booking.venueId,
        sportId: booking.sportId,
        venueName: booking.venueName || booking.venueId || "N/A",
        sportName: booking.sportName || booking.sportId || "N/A",
        bookingDate: firstSlot ? firstSlot.startDateTime : booking.createdAt,
        timeSlot: firstSlot
          ? `${new Date(firstSlot.startDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${new Date(firstSlot.endDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "N/A",
        totalAmount: booking.totalPrice,
        status: booking.status,
        raw: booking,
      };

      setBookingDetails(transformed);
      setShowBookingModal(true);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      alert(err.message);
    }
  };

  // Initiate refund process - shows payment modal first
  const initiateRefundProcess = (refundId) => {
    const refund = refunds.find((r) => r.id === refundId);
    if (!refund) {
      alert("Refund not found in local data.");
      return;
    }
    setRefundToProcess(refund);
    setShowPaymentModal(true);
  };

  // Handle successful payment - then process refund
  const handlePaymentSuccess = async (paymentResult) => {
    if (!refundToProcess) return;

    try {
      setProcessingRefund(refundToProcess.id);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("Payment completed successfully:", paymentResult);
      console.log(
        "Now processing refund for ID:",
        refundToProcess.id,
        "Amount:",
        refundToProcess.amount
      );

      // Step 1: Update backend refund status (payment already processed via modal)
      console.log("Updating backend refund status...");
      const response = await fetch(
        `${BASE_URL}/api/refunds/process?id=${refundToProcess.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentResult.paymentIntentId,
            amount: refundToProcess.amount,
          }),
        }
      );

      console.log("Process refund response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          throw new Error("Authentication failed. Redirecting to login...");
        } else if (response.status === 403) {
          throw new Error("You don't have permission to process refunds.");
        } else if (response.status === 404) {
          throw new Error("Refund not found.");
        } else {
          const errorText = await response.text();
          console.error("API Error response:", errorText);
          throw new Error(errorText || "Failed to process refund");
        }
      }

      // Get the response data (if any)
      let responseData;
      try {
        responseData = await response.json();
        console.log("Process refund response data:", responseData);
      } catch {
        console.log("No JSON response data, probably just success status");
      }

      // Update the refund status in the local state immediately
      setRefunds((prevRefunds) =>
        prevRefunds.map((refund) =>
          refund.id === refundToProcess.id
            ? { ...refund, status: "done" }
            : refund
        )
      );

      alert(
        `Refund processed successfully! $${parseFloat(
          refundToProcess.amount
        ).toFixed(2)} has been refunded via Stripe.`
      );

      // Optionally refetch data from server to ensure consistency
      setTimeout(() => {
        refetchRefunds();
      }, 500);
    } catch (err) {
      console.error("Error processing refund:", err);
      alert(`Refund processing failed: ${err.message}`);
    } finally {
      setProcessingRefund(null);
      setRefundToProcess(null);
    }
  };

  // Handle payment error
  const handlePaymentError = (errorMessage) => {
    console.error("Payment failed:", errorMessage);
    alert(`Payment failed: ${errorMessage}`);
    setRefundToProcess(null);
  };

  // Normalize backend status values to internal canonical ones
  const normalizeStatus = (s) => {
    if (!s) return "pending";
    const v = s.toLowerCase();
    if (v === "done") return "processed"; // map backend 'done' -> processed
    return v; // pending / processed / rejected (or others fallback later)
  };

  // Get status badge component (supports raw or normalized status)
  const getStatusBadge = (rawStatus) => {
    const status = normalizeStatus(rawStatus);
    const statusConfig = {
      pending: {
        icon: AlertCircle,
        color: "#f59e0b",
        bg: "#fef3c7",
        text: "Pending",
      },
      processed: {
        icon: CheckCircle,
        color: "#10b981",
        bg: "#d1fae5",
        text: "Processed",
      },
      rejected: {
        icon: XCircle,
        color: "#ef4444",
        bg: "#fee2e2",
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div
        className={styles.statusBadge}
        style={{
          backgroundColor: config.bg,
          color: config.color,
          border: `1px solid ${config.color}40`,
        }}
      >
        <Icon size={14} />
        <span>{config.text}</span>
      </div>
    );
  };

  // Handle view booking details
  const handleViewBooking = (refund) => {
    setSelectedRefund(refund);
    fetchBookingDetailsForRefund(refund);
  };

  // Close booking modal
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRefund(null);
    setBookingDetails(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading refunds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Refunds</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={refetchRefunds}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div
        className={styles.container}
        style={{ marginTop: "100px", paddingTop: "2rem" }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Refund Management</h1>
          <p className={styles.subtitle}>
            Manage and process refund requests from customers
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{refunds.length}</span>
              <span className={styles.statLabel}>Total Refunds</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {
                  refunds.filter((r) => normalizeStatus(r.status) === "pending")
                    .length
                }
              </span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {
                  refunds.filter(
                    (r) => normalizeStatus(r.status) === "processed"
                  ).length
                }
              </span>
              <span className={styles.statLabel}>Processed</span>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        {refunds.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💰</div>
            <h3>No Refund Requests</h3>
            <p>You don't have any refund requests at the moment.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
              <table className={styles.refundsTable}>
                <thead>
                  <tr>
                    <th>Refund ID</th>
                    <th>Customer Email</th>
                    <th>Amount</th>
                    <th>Booking ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((refund) => (
                    <tr key={refund.id}>
                      <td>
                        <div className={styles.refundId}>#{refund.id}</div>
                      </td>
                      <td>
                        <div className={styles.customerInfo}>
                          <User size={16} />
                          <span>{refund.userEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.amount}>
                          <DollarSign size={16} />
                          <span>${parseFloat(refund.amount).toFixed(2)}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.bookingId}>
                          #{refund.bookingId}
                        </div>
                      </td>
                      <td>{getStatusBadge(refund.status)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={styles.viewButton}
                            onClick={() => handleViewBooking(refund)}
                            title="View Booking Details"
                          >
                            <Eye size={16} />
                            Details
                          </button>
                          {normalizeStatus(refund.status) === "pending" && (
                            <button
                              className={styles.processButton}
                              onClick={() => initiateRefundProcess(refund.id)}
                              disabled={processingRefund === refund.id}
                              title="Process Refund"
                            >
                              {processingRefund === refund.id ? (
                                <>
                                  <div className={styles.miniSpinner}></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} />
                                  Process
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showBookingModal && bookingDetails && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Booking Details</h2>
                <button
                  onClick={closeBookingModal}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.bookingDetailsGrid}>
                  <div className={styles.detailGroup}>
                    <label>Booking ID</label>
                    <span>#{bookingDetails.id}</span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Customer Email</label>
                    <span>{bookingDetails.userEmail}</span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Venue</label>
                    <span>
                      {bookingDetails.venueName ||
                        bookingDetails.venueId ||
                        "N/A"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Sport</label>
                    <span>
                      {bookingDetails.sportName ||
                        bookingDetails.sportId ||
                        "N/A"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Booking Date</label>
                    <span>
                      <Calendar size={16} />
                      {bookingDetails.bookingDate
                        ? new Date(
                            bookingDetails.bookingDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Time Slot</label>
                    <span>
                      <Clock size={16} />
                      {bookingDetails.timeSlot || "N/A"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Total Amount</label>
                    <span>
                      <DollarSign size={16} />$
                      {bookingDetails.totalAmount
                        ? parseFloat(bookingDetails.totalAmount).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Refund Amount</label>
                    <span>
                      <DollarSign size={16} />$
                      {selectedRefund
                        ? parseFloat(selectedRefund.amount).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>

                  <div className={styles.detailGroup}>
                    <label>Booking Status</label>
                    <span>{bookingDetails.status || "N/A"}</span>
                  </div>
                </div>

                {selectedRefund &&
                  normalizeStatus(selectedRefund.status) === "pending" && (
                    <div className={styles.modalActions}>
                      <button
                        className={styles.processRefundButton}
                        onClick={() => {
                          initiateRefundProcess(selectedRefund.id);
                          closeBookingModal();
                        }}
                        disabled={processingRefund === selectedRefund.id}
                      >
                        {processingRefund === selectedRefund.id ? (
                          <>
                            <div className={styles.miniSpinner}></div>
                            Processing Refund...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            Process Refund
                          </>
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Stripe Payment Modal */}
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setRefundToProcess(null);
          }}
          refundAmount={refundToProcess?.amount || "0.00"}
          refundId={refundToProcess?.id}
          customerEmail={refundToProcess?.userEmail}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    </div>
  );
};

export default Refund;
