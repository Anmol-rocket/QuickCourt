"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api/baseURL";
import styles from "./MyVenue.module.css";
import dashboardStyles from "./FacilityOwnerDashboard.module.css";
import { Link } from "react-router-dom";
import { User, X, Plus, Trash2, Menu } from "lucide-react";

// Navbar using FacilityOwnerDashboard.module.css
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
                <a
                  href="/facility-owner-dashboard/my-venues/profile"
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
                backgroundColor: "#e8f4fd", // Highlight current page
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#d4edda";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#e8f4fd";
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
              href="/facility-owner-dashboard/my-venues/profile"
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
    </nav>
  );
};

const MyVenue = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSportsForm, setShowSportsForm] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  // Get owner email and token from localStorage
  const ownerEmail = localStorage.getItem("email") || "";
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt") ||
    "";

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/venues/allVenues/${ownerEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.trim()}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Clear invalid authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authToken");
            localStorage.removeItem("jwt");
            localStorage.removeItem("email");
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 403) {
            throw new Error(
              "Permission denied. You don't have access to view venues."
            );
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        setVenues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [ownerEmail, token]);

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

  const getDefaultImage = () => {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvcnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";
  };

  const handleImageError = (e, hasErrored = false) => {
    if (!hasErrored) {
      e.target.dataset.hasErrored = "true";
      e.target.src = getDefaultImage();
    }
  };

  const handleAddSport = (venueId) => {
    setSelectedVenueId(venueId);
    setShowSportsForm(true);
    setFormError(null);
  };

  const handleCloseSportsForm = () => {
    setShowSportsForm(false);
    setSelectedVenueId(null);
    setFormError(null);
  };

  const handleVenueClick = (venueId, venueName, venueAddress) => {
    navigate("/facility-owner-dashboard/venuesports", {
      state: { venueId, venueName, venueAddress },
    });
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingVenue(null);
  };

  const handleVenueUpdated = (updatedVenue) => {
    setVenues((prevVenues) =>
      prevVenues.map((venue) =>
        venue.id === updatedVenue.id ? updatedVenue : venue
      )
    );
  };

  const handleCreateVenueClick = () => {
    setShowVenueForm(true);
  };

  const handleCloseVenueForm = () => {
    setShowVenueForm(false);
  };

  const handleVenueCreated = (newVenue) => {
    setVenues((prev) => [...prev, newVenue]);
    setShowVenueForm(false);
  };

  const handleDeleteVenue = async (venue) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const ownerEmail = localStorage.getItem("email");

      if (!token) {
        alert("Authentication required. Please log in again.");
        return;
      }

      if (!ownerEmail) {
        alert("Owner email not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/venues/owners/${encodeURIComponent(
          ownerEmail
        )}/venues/${venue.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Venue deleted successfully!");
        // Refresh the venues list by removing the deleted venue
        setVenues(venues.filter((v) => v.id !== venue.id));
      } else if (response.status === 401) {
        alert("Unauthorized. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else if (response.status === 403) {
        alert("You don't have permission to delete this venue.");
      } else if (response.status === 404) {
        alert("Venue not found.");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete venue");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      alert(`Failed to delete venue: ${error.message}`);
    }
  };

  const VenueForm = ({ isOpen, onClose, onVenueCreated }) => {
    const [formData, setFormData] = useState({
      name: "",
      location: "",
      description: "",
      amenities: [],
      photos: [],
      isVerified: false,
    });

    const [photoUrl, setPhotoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const amenitiesOptions = [
      "Parking",
      "Restrooms",
      "Changing Rooms",
      "Equipment Rental",
      "Cafeteria",
      "WiFi",
      "Air Conditioning",
      "Lighting",
    ];

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addPhotoUrl = () => {
      if (photoUrl.trim()) {
        setFormData((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              id: Date.now() + Math.random(),
              url: photoUrl.trim(),
              name: "Photo from URL",
            },
          ],
        }));
        setPhotoUrl("");
      }
    };

    const handleAmenityToggle = (amenity) => {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }));
    };

    const removePhoto = (photoId) => {
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos.filter((photo) => photo.id !== photoId),
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        // Get owner email and token
        const ownerMail = localStorage.getItem("email");
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("jwt") ||
          "";
        if (!ownerMail) throw new Error("No email found. Please log in again.");
        if (!token)
          throw new Error(
            "No authentication token found. Please log in again."
          );

        // Prepare venue data
        const venueData = {
          name: formData.name,
          description: formData.description,
          address: formData.location,
          isVerified: formData.isVerified,
          photoUrls: formData.photos.map((photo) => photo.url),
          amenities: formData.amenities,
          rating: null,
          ownerMail,
          sportIds: [],
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        };
        const response = await fetch(
          `${BASE_URL}/api/venues?ownerEmail=${encodeURIComponent(ownerMail)}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(venueData),
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 403) {
            throw new Error(
              "Permission denied. You don't have access to create venues."
            );
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const newVenue = await response.json();
        onClose();
        setFormData({
          name: "",
          location: "",
          description: "",
          amenities: [],
          photos: [],
          isVerified: false,
        });
        setPhotoUrl("");
        alert("Venue created successfully!");
        // Refresh the venues list
        if (onVenueCreated) {
          onVenueCreated(newVenue);
        }
      } catch (error) {
        setError(error.message || "Failed to create venue. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div
        className={styles.modalOverlay}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000, // Higher than navbar's 1500
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Create New Venue</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.venueForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Venue Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter venue name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.formLabel}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter location"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="description" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Enter venue description"
                  rows={3}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Amenities Offered</label>
                <div className={styles.checkboxGrid}>
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxLabel}>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Add Photo URL</label>
                <div className={styles.photoUrlContainer}>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter photo URL"
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    className={styles.addPhotoButton}
                  >
                    <Plus size={20} />
                    Add Photo
                  </button>
                </div>

                {formData.photos.length > 0 && (
                  <div className={styles.photoPreviewGrid}>
                    {formData.photos.map((photo) => (
                      <div key={photo.id} className={styles.photoPreview}>
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt={photo.name}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className={styles.removePhotoBtn}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Venue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditVenueForm = ({ venue, isOpen, onClose, onVenueUpdated }) => {
    const [formData, setFormData] = useState({
      name: venue?.name || "",
      description: venue?.description || "",
      address: venue?.address || "",
      photoUrls: venue?.photoUrls || [],
      amenities: venue?.amenities || [],
    });

    const [photoUrl, setPhotoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const amenitiesOptions = [
      "Parking",
      "Restrooms",
      "Changing Rooms",
      "Equipment Rental",
      "Cafeteria",
      "WiFi",
      "Air Conditioning",
      "Lighting",
    ];

    // Update form data when venue prop changes
    useEffect(() => {
      if (venue) {
        setFormData({
          name: venue.name || "",
          description: venue.description || "",
          address: venue.address || "",
          photoUrls: venue.photoUrls || [],
          amenities: venue.amenities || [],
        });
      }
    }, [venue]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addPhotoUrl = () => {
      if (photoUrl.trim()) {
        setFormData((prev) => ({
          ...prev,
          photoUrls: [...prev.photoUrls, photoUrl.trim()],
        }));
        setPhotoUrl("");
      }
    };

    const removePhotoUrl = (index) => {
      setFormData((prev) => ({
        ...prev,
        photoUrls: prev.photoUrls.filter((_, i) => i !== index),
      }));
    };

    const handleAmenityToggle = (amenity) => {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(amenity)
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please log in again.");
        }

        const updateData = {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          photoUrls: formData.photoUrls,
          amenities: formData.amenities,
          rating: venue.rating, // Keep existing rating
        };

        const response = await fetch(`${BASE_URL}/api/venues/${venue.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 403) {
            throw new Error("You don't have permission to edit this venue.");
          } else if (response.status === 404) {
            throw new Error("Venue not found.");
          } else {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update venue");
          }
        }

        const updatedVenue = await response.json();
        alert("Venue updated successfully!");
        onVenueUpdated(updatedVenue);
        onClose();
      } catch (error) {
        console.error("Error updating venue:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div
        className={styles.modalOverlay}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000, // Higher than navbar's 1500
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Edit Venue</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.venueForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Venue Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter venue name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.formLabel}>
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="description" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Enter venue description"
                  rows={3}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Amenities</label>
                <div className={styles.checkboxGrid}>
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxLabel}>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Photo URLs</label>
                <div className={styles.photoUrlContainer}>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter photo URL"
                  />
                  <button
                    type="button"
                    onClick={addPhotoUrl}
                    className={styles.addPhotoButton}
                  >
                    <Plus size={20} />
                    Add Photo
                  </button>
                </div>

                {formData.photoUrls.length > 0 && (
                  <div className={styles.photoPreviewGrid}>
                    {formData.photoUrls.map((url, index) => (
                      <div key={index} className={styles.photoPreview}>
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={() => removePhotoUrl(index)}
                          className={styles.removePhotoBtn}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Rating (Read-only)</label>
                <input
                  type="number"
                  value={venue?.rating || 0}
                  className={styles.formInput}
                  disabled
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Venue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SportsForm = ({ venueId, onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      type: "Indoor",
      pricePerHour: "",
      operatingHours: "",
      averageRating: 0.0,
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      setFormError(null);

      try {
        const response = await fetch(
          `${BASE_URL}/api/sports/venue/${venueId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.trim()}`,
            },
            body: JSON.stringify({
              name: formData.name,
              type: formData.type,
              pricePerHour: parseFloat(formData.pricePerHour),
              operatingHours: formData.operatingHours,
              averageRating: formData.averageRating,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("authToken");
            localStorage.removeItem("jwt");
            localStorage.removeItem("email");
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 403) {
            throw new Error(
              "Permission denied. You don't have access to add sports."
            );
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const result = await response.json();
        console.log("Sport added successfully:", result);

        // Refresh venues list
        window.location.reload();

        onClose();
      } catch (err) {
        setFormError(err.message);
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Add New Sport</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
          </div>

          {formError && <div className={styles.errorMessage}>{formError}</div>}

          <form onSubmit={handleSubmit} className={styles.sportsForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Sport Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Badminton"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pricePerHour">Price Per Hour ($)</label>
              <input
                type="number"
                id="pricePerHour"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                placeholder="20.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="operatingHours">Operating Hours</label>
              <input
                type="text"
                id="operatingHours"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleInputChange}
                placeholder="08:00 - 22:00"
                required
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className={styles.submitButton}
              >
                {formLoading ? "Adding..." : "Add Sport"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Venues</h2>
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
        className={styles.mainContent}
        style={{
          marginTop: "80px", // Account for fixed navbar height
          paddingTop: "2rem",
          minHeight: "calc(100vh - 80px)", // Ensure full height minus navbar
        }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>My Venues</h1>
          <p className={styles.subtitle}>
            Manage and monitor all your sports venues
          </p>
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{venues.length}</span>
              <span className={styles.statLabel}>Total Venues</span>
            </div>
            {/* <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {venues.filter((v) => v.rating >= 4).length}
            </span>
            <span className={styles.statLabel}>High Rated</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {venues.reduce((acc, v) => acc + (v.sports?.length || 0), 0)}
            </span>
            <span className={styles.statLabel}>Total Sports</span>
          </div> */}
          </div>
        </div>

        {venues.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏟</div>
            <h3>No Venues Found</h3>
            <p>
              You haven't added any venues yet. Start by creating your first
              venue!
            </p>
            <button
              className={styles.addVenueButton}
              onClick={handleCreateVenueClick}
            >
              Add New Venue
            </button>
          </div>
        ) : (
          <div className={styles.venuesGrid}>
            {venues.map((venue) => (
              <div key={venue.id} className={styles.venueCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={venue.photoUrls?.[0] || getDefaultImage()}
                    alt={venue.name}
                    className={styles.venueImage}
                    onError={(e) => handleImageError(e)}
                    onClick={() =>
                      handleVenueClick(venue.id, venue.name, venue.address)
                    }
                    style={{ cursor: "pointer" }}
                  />
                  <div className={styles.imageOverlay}>
                    <button className={styles.viewGalleryButton}>
                      View Gallery ({venue.photoUrls?.length || 1})
                    </button>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.venueHeader}>
                    <h3
                      className={styles.venueName}
                      onClick={() =>
                        handleVenueClick(venue.id, venue.name, venue.address)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {venue.name}
                    </h3>
                    <div className={styles.venueActions}>
                      <div className={styles.venueId}>ID: {venue.id}</div>
                      <button
                        className={styles.addSportButton}
                        onClick={() => handleAddSport(venue.id)}
                        title="Add Sport"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.rating}>
                    <div className={styles.stars}>
                      {renderStars(venue.rating)}
                    </div>
                    <span className={styles.ratingText}>
                      {venue.rating}/5 ({venue.comments?.length || 0} reviews)
                    </span>
                  </div>

                  <p className={styles.description}>{venue.description}</p>

                  <div className={styles.addressSection}>
                    <div className={styles.addressIcon}>📍</div>
                    <span className={styles.address}>{venue.address}</span>
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className={styles.amenitiesSection}>
                      <h4 className={styles.amenitiesTitle}>Amenities</h4>
                      <div className={styles.amenitiesList}>
                        {venue.amenities.map((amenity, index) => (
                          <span key={index} className={styles.amenityTag}>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {venue.sports && venue.sports.length > 0 && (
                    <div className={styles.sportsSection}>
                      <h4 className={styles.sportsTitle}>Available Sports</h4>
                      <div className={styles.sportsList}>
                        {venue.sports.map((sport, index) => (
                          <span key={index} className={styles.sportTag}>
                            {sport.name || sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditVenue(venue)}
                  >
                    Edit Venue
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteVenue(venue)}
                  >
                    Delete Venue
                  </button>
                  {/* <button className={styles.viewBookingsButton}>
                  View Bookings
                </button>
                <button className={styles.manageButton}>Manage</button> */}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.floatingActionButton}>
          <button
            className={styles.addButton}
            title="Add New Venue"
            onClick={handleCreateVenueClick}
          >
            +
          </button>
        </div>

        {showSportsForm && selectedVenueId && (
          <SportsForm
            venueId={selectedVenueId}
            onClose={handleCloseSportsForm}
          />
        )}

        {showEditForm && editingVenue && (
          <EditVenueForm
            venue={editingVenue}
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setEditingVenue(null);
            }}
            onVenueUpdated={(updatedVenue) => {
              // Update the venues list with the updated venue
              setVenues((prev) =>
                prev.map((venue) =>
                  venue.id === updatedVenue.id ? updatedVenue : venue
                )
              );
            }}
          />
        )}
      </div>{" "}
      {/* Close mainContent */}
      {showVenueForm && (
        <VenueForm
          isOpen={showVenueForm}
          onClose={handleCloseVenueForm}
          onVenueCreated={handleVenueCreated}
        />
      )}
    </div>
  );
};

export default MyVenue;
