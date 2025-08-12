"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  X,
  Trash2,
  User,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./FacilityOwnerDashboard.module.css";
import BASE_URL from "../../api/baseURL.js";
import FacilityEarningsBarGraph from "./FacilityEarningsBarGraph";

// Mock data for demonstration
const mockData = {
  kpis: {
    totalBookings: 1247,
    activeCourts: 8,
    earnings: 45680,
  },
  bookingTrends: {
    daily: [
      { date: "2024-01-01", bookings: 15 },
      { date: "2024-01-02", bookings: 22 },
      { date: "2024-01-03", bookings: 18 },
      { date: "2024-01-04", bookings: 28 },
      { date: "2024-01-05", bookings: 25 },
      { date: "2024-01-06", bookings: 32 },
      { date: "2024-01-07", bookings: 29 },
    ],
    weekly: [
      { period: "Week 1", bookings: 140 },
      { period: "Week 2", bookings: 165 },
      { period: "Week 3", bookings: 180 },
      { period: "Week 4", bookings: 195 },
    ],
    monthly: [
      { month: "Jan", bookings: 680 },
      { month: "Feb", bookings: 720 },
      { month: "Mar", bookings: 850 },
      { month: "Apr", bookings: 920 },
      { month: "May", bookings: 1100 },
      { month: "Jun", bookings: 1247 },
    ],
  },
  earnings: [{ category: "Court Rentals", amount: 45680, percentage: 100 }],
  monthlyEarnings: [
    { month: "Jan", earnings: 28500 },
    { month: "Feb", earnings: 32100 },
    { month: "Mar", earnings: 35800 },
    { month: "Apr", earnings: 38900 },
    { month: "May", earnings: 42300 },
    { month: "Jun", earnings: 45680 },
  ],
  totalRevenue: [
    { month: "Jan", total: 28500 },
    { month: "Feb", total: 60600 },
    { month: "Mar", total: 96400 },
    { month: "Apr", total: 135300 },
    { month: "May", total: 177600 },
    { month: "Jun", total: 223280 },
  ],
  peakHours: [
    { hour: "6 AM", bookings: 5 },
    { hour: "7 AM", bookings: 12 },
    { hour: "8 AM", bookings: 18 },
    { hour: "9 AM", bookings: 25 },
    { hour: "10 AM", bookings: 22 },
    { hour: "11 AM", bookings: 20 },
    { hour: "12 PM", bookings: 28 },
    { hour: "1 PM", bookings: 15 },
    { hour: "2 PM", bookings: 18 },
    { hour: "3 PM", bookings: 22 },
    { hour: "4 PM", bookings: 30 },
    { hour: "5 PM", bookings: 35 },
    { hour: "6 PM", bookings: 40 },
    { hour: "7 PM", bookings: 38 },
    { hour: "8 PM", bookings: 32 },
    { hour: "9 PM", bookings: 25 },
    { hour: "10 PM", bookings: 15 },
  ],
  upcomingBookings: [
    {
      id: 1,
      court: "Court A",
      time: "10:00 AM",
      customer: "John Doe",
      sport: "Tennis",
    },
    {
      id: 2,
      court: "Court B",
      time: "11:30 AM",
      customer: "Jane Smith",
      sport: "Badminton",
    },
    {
      id: 3,
      court: "Court C",
      time: "2:00 PM",
      customer: "Mike Johnson",
      sport: "Basketball",
    },
    {
      id: 4,
      court: "Court A",
      time: "4:00 PM",
      customer: "Sarah Wilson",
      sport: "Tennis",
    },
  ],
};

// eslint-disable-next-line no-unused-vars
const KPICard = ({ title, value, icon: Icon, trend, color }) => (
  <div className={styles.kpiCard}>
    <div className={styles.kpiHeader}>
      <div className={styles.kpiIcon} style={{ backgroundColor: color }}>
        <Icon size={24} />
      </div>
      <div className={styles.kpiTrend}>
        {trend && (
          <>
            <TrendingUp size={16} />
            <span>+{trend}%</span>
          </>
        )}
      </div>
    </div>
    <div className={styles.kpiContent}>
      <h3 className={styles.kpiValue}>{value}</h3>
      <p className={styles.kpiTitle}>{title}</p>
    </div>
  </div>
);

const LineChart = ({ data, title }) => {
  const values = Array.isArray(data) ? data : [];
  const maxValue = Math.max(1, ...values.map((d) => Number(d.bookings) || 0));
  const width = 520;
  const height = 220;
  const padding = { top: 20, right: 16, bottom: 40, left: 32 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const n = Math.max(1, values.length);

  const xFor = (i) => padding.left + (chartW * i) / (n - 1);
  const yFor = (v) => padding.top + chartH - (chartH * v) / maxValue;

  const points = values.map((d, i) => ({
    x: xFor(i),
    y: yFor(Number(d.bookings) || 0),
    v: Number(d.bookings) || 0,
    label: d.month || d.period || d.date,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const yGrid = 4; // 5 horizontal lines (0..4)

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.revenueLineChart}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[...Array(yGrid + 1)].map((_, i) => {
            const y = padding.top + (chartH * i) / yGrid;
            return (
              <line
                key={i}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            );
          })}

          {/* Line path */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="3"
            />
          )}

          {/* Points and values */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="var(--accent-3)"
                stroke="white"
                strokeWidth="2"
              />
              {/* Value label above point */}
              <text
                x={p.x}
                y={p.y - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#556"
              >
                {p.v}
              </text>
            </g>
          ))}

          {/* X-axis month labels */}
          {points.map((p, i) => (
            <text
              key={`lbl-${i}`}
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#667"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

const DoughnutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.doughnutChart}>
        <div className={styles.doughnutCenter}>
          <span className={styles.totalAmount}>${total.toLocaleString()}</span>
          <span className={styles.totalLabel}>Total</span>
        </div>
        <div className={styles.doughnutLegend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{
                  backgroundColor: `hsl(${180 + index * 60}, 60%, 50%)`,
                }}
              />
              <span className={styles.legendText}>{item.category}</span>
              <span className={styles.legendValue}>
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChart = ({
  data,
  title,
  valueKey = "earnings",
  color = "var(--accent-2)",
}) => {
  const maxValue = Math.max(...data.map((d) => d[valueKey]));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.verticalBarChart}>
        <div className={styles.chartYAxis}>
          <div className={styles.yAxisLabels}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={styles.yLabel}>
                ${Math.round((maxValue * (4 - i)) / 4 / 1000)}k
              </span>
            ))}
          </div>
        </div>
        <div className={styles.chartBarsContainer}>
          <div className={styles.chartGridLines}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.gridLine} />
            ))}
          </div>
          <div className={styles.chartBarsVertical}>
            {data.map((item, index) => (
              <div key={index} className={styles.chartBarVertical}>
                <div
                  className={styles.barFillVertical}
                  style={{
                    height: `${(item[valueKey] / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                />
                <div className={styles.barValueLabel}>
                  ${(item[valueKey] / 1000).toFixed(0)}k
                </div>
                <span className={styles.barLabelVertical}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RevenueLineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map((d) => d.total));
  const minValue = Math.min(...data.map((d) => d.total));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.revenueLineChart}>
        <div className={styles.lineChartContainer}>
          <svg viewBox="0 0 400 200" className={styles.lineSvg}>
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="var(--accent-1)" />
                <stop offset="100%" stopColor="var(--accent-3)" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={40 + i * 32}
                x2="400"
                y2={40 + i * 32}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            ))}

            {/* Line path */}
            <path
              d={`M ${data
                .map(
                  (item, index) =>
                    `${(index * 400) / (data.length - 1)},${
                      200 -
                      ((item.total - minValue) / (maxValue - minValue)) * 160 -
                      20
                    }`
                )
                .join(" L ")}`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data points */}
            {data.map((item, index) => (
              <circle
                key={index}
                cx={(index * 400) / (data.length - 1)}
                cy={
                  200 -
                  ((item.total - minValue) / (maxValue - minValue)) * 160 -
                  20
                }
                r="4"
                fill="var(--accent-3)"
                stroke="var(--white)"
                strokeWidth="2"
              />
            ))}
          </svg>

          <div className={styles.lineChartLabels}>
            {data.map((item, index) => (
              <div key={index} className={styles.lineLabel}>
                <span className={styles.labelMonth}>{item.month}</span>
                <span className={styles.labelValue}>
                  ${item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeatmapChart = ({ data, title }) => {
  const maxBookings = Math.max(...data.map((d) => d.bookings));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.heatmapChart}>
        {data.map((item, index) => (
          <div
            key={index}
            className={styles.heatmapCell}
            style={{
              backgroundColor: `rgba(72, 166, 167, ${
                item.bookings / maxBookings
              })`,
              color:
                item.bookings / maxBookings > 0.5
                  ? "white"
                  : "var(--text-primary)",
            }}
          >
            <span className={styles.cellHour}>{item.hour}</span>
            <span className={styles.cellValue}>{item.bookings}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookingCalendar = ({ bookedDateKeys = new Set() }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <h3 className={styles.calendarTitle}>Booking Calendar</h3>
        <div className={styles.calendarNav}>
          <button
            onClick={() => navigateMonth(-1)}
            className={styles.navButton}
          >
            <ChevronLeft size={20} />
          </button>
          <span className={styles.currentMonth}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={() => navigateMonth(1)} className={styles.navButton}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.weekdays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {days.map((day, index) => {
            const key = day
              ? `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
                  2,
                  "0"
                )}-${String(day.getDate()).padStart(2, "0")}`
              : null;
            const isSelected =
              day && day.toDateString() === selectedDate.toDateString();
            const hasBooking = day && bookedDateKeys?.has?.(key);

            // Always apply hasBooking if booked, even when selected
            let classNames = [styles.calendarDay];
            if (!day) classNames.push(styles.empty);
            if (hasBooking) classNames.push(styles.hasBooking);
            if (isSelected) classNames.push(styles.selected);

            return (
              <div
                key={index}
                className={classNames.join(" ")}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VenueForm = ({ isOpen, onClose }) => {
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
        throw new Error("No authentication token found. Please log in again.");

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
      await response.json();
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
    } catch (error) {
      setError(error.message || "Failed to create venue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
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

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userName = localStorage.getItem("fullName") || "User";
  const userEmail = localStorage.getItem("email") || "user@example.com";
  const userAvatar = localStorage.getItem("avatarUrl") || "";

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
        className={styles.navbar}
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
        <div className={styles.navbarContent}>
          <div className={styles.navbarBrand}>
            <h2
              className={styles.brandTitle}
              style={{ fontSize: "1.8rem", fontWeight: "700" }}
            >
              QUICKCOURT
            </h2>
          </div>

          {/* Desktop Menu */}
          {!isMobile && (
            <div className={styles.navbarMenu}>
              <Link
                to="/facility-owner-dashboard/my-bookings"
                className={styles.navLink}
                style={{ fontSize: "1.1rem", fontWeight: "600" }}
              >
                My Bookings
              </Link>
              <Link
                to="/facility-owner-dashboard/my-venues"
                className={styles.navLink}
                style={{ fontSize: "1.1rem", fontWeight: "600" }}
              >
                My Venues
              </Link>
              <Link
                to="/facility-owner-dashboard/refund"
                className={styles.navLink}
                style={{ fontSize: "1.1rem", fontWeight: "600" }}
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
            <div className={styles.userSection}>
              <div
                className={styles.userProfile}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className={styles.userAvatar}>
                  {userAvatar ? (
                    <img
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span
                    className={styles.userName}
                    style={{ fontSize: "1.1rem", fontWeight: "600" }}
                  >
                    {userName}
                  </span>
                  <span
                    className={styles.userEmail}
                    style={{ fontSize: "1rem" }}
                  >
                    {userEmail}
                  </span>
                </div>
              </div>

              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <a
                    href="/facility-owner-dashboard/profile"
                    className={styles.dropdownItem}
                  >
                    Profile
                  </a>
                  <hr className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
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
                    fontSize: "1.2rem",
                    color: "#333",
                  }}
                >
                  {userName}
                </div>
                <div style={{ fontSize: "1rem", color: "#666" }}>
                  {userEmail}
                </div>
              </div>
            </div>

            <a
              href="/facility-owner-dashboard/profile"
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

export default function FacilityOwnerDashboard() {
  const [yearlyEarnings, setYearlyEarnings] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState(null);
  const [sportNames, setSportNames] = useState({});
  const [peakDate, setPeakDate] = useState(null);
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [venueNames, setVenueNames] = useState({});
  // Fetch bookings and find most frequent createdAt date
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (!token || !email) return;
    fetch(
      `${BASE_URL}/api/bookings/getByOwner?ownerEmail=${encodeURIComponent(
        email
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        // Find peak booking date
        const freq = {};
        const todayStr = "2025-08-12";
        const todays = [];
        if (Array.isArray(data)) {
          data.forEach((booking) => {
            if (booking.createdAt) {
              const dateStr = booking.createdAt.slice(0, 10); // YYYY-MM-DD
              freq[dateStr] = (freq[dateStr] || 0) + 1;
              if (dateStr === todayStr) {
                todays.push(booking);
              }
            }
          });
        }
        // Find most frequent date
        let peak = null;
        let max = 0;
        Object.entries(freq).forEach(([date, count]) => {
          if (count > max) {
            peak = date;
            max = count;
          }
        });
        setPeakDate(peak);
        setTodaysBookings(todays);

        // Fetch sport names for today's bookings
        (async () => {
          const sportIdSet = new Set(
            todays.map((b) => b.sportId).filter(Boolean)
          );
          const sportNameMap = {};
          await Promise.all(
            Array.from(sportIdSet).map(async (sportId) => {
              try {
                const res = await fetch(`${BASE_URL}/api/sports/${sportId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
                if (res.ok) {
                  const name = await res.text();
                  sportNameMap[sportId] = name;
                }
              } catch {}
            })
          );
          setSportNames(sportNameMap);

          // Fetch venue names for today's bookings
          const venueIdSet = new Set(
            todays.map((b) => b.venueId).filter(Boolean)
          );
          const venueNameMap = {};
          await Promise.all(
            Array.from(venueIdSet).map(async (venueId) => {
              try {
                const res = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                });
                if (res.ok) {
                  const venue = await res.json();
                  venueNameMap[venueId] = venue.name || venueId;
                }
              } catch {}
            })
          );
          setVenueNames(venueNameMap);
        })();
      })
      .catch(() => {
        setPeakDate(null);
        setTodaysBookings([]);
        setSportNames({});
      });
  }, []);

  // Fetch facility owner's monthly earnings and calculate yearly earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      setEarningsLoading(true);
      setEarningsError(null);
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        if (!email || !token) throw new Error("Missing credentials");
        const response = await fetch(
          `${BASE_URL}/api/earnings/${email}/monthly`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch earnings");
        const data = await response.json();
        // data is array of 12 numbers
        const cumulative = Array.isArray(data)
          ? data.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
          : 0;
        setYearlyEarnings(cumulative);
      } catch {
        setEarningsError("Error loading earnings");
        setYearlyEarnings(null);
      } finally {
        setEarningsLoading(false);
      }
    };
    fetchEarnings();
  }, []);
  const [trendPeriod, setTrendPeriod] = useState("monthly");
  const [monthlyTrendsData, setMonthlyTrendsData] = useState([]);
  const [monthlyTrendsLoading, setMonthlyTrendsLoading] = useState(true);
  const [monthlyTrendsError, setMonthlyTrendsError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVenueFormOpen, setIsVenueFormOpen] = useState(false);
  const [facilityOwnerEmail, setFacilityOwnerEmail] = useState("");
  const [totalBookings, setTotalBookings] = useState(null);
  const [bookedDateKeys, setBookedDateKeys] = useState(new Set());
  // Deprecated: sports state removed in favor of venues count
  const [venuesCount, setVenuesCount] = useState(null);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState(null);

  // Get user name from localStorage for welcome message
  const fullName = localStorage.getItem("fullName") || "User";
  const userName = fullName.split(" ")[0]; // Get first name only for welcome message

  useEffect(() => {
    setFacilityOwnerEmail(localStorage.getItem("email") || "");
  }, []);

  // Fetch monthly booking trends for the facility owner
  useEffect(() => {
    const fetchMonthlyTrends = async () => {
      setMonthlyTrendsLoading(true);
      setMonthlyTrendsError(null);
      try {
        const ownerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        if (!ownerEmail) throw new Error("Missing owner email");
        const res = await fetch(
          `${BASE_URL}/api/bookings/monthlyTrends?ownerEmail=${encodeURIComponent(
            ownerEmail
          )}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`Failed to fetch trends: ${res.status}`);
        const values = await res.json();
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const normalized = Array.isArray(values) ? values.slice(0, 12) : [];
        while (normalized.length < 12) normalized.push(0);
        const chartData = months.map((m, i) => ({
          month: m,
          bookings: Number(normalized[i]) || 0,
        }));
        setMonthlyTrendsData(chartData);
      } catch {
        setMonthlyTrendsError("Could not load monthly trends");
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        setMonthlyTrendsData(months.map((m) => ({ month: m, bookings: 0 })));
      } finally {
        setMonthlyTrendsLoading(false);
      }
    };
    fetchMonthlyTrends();
  }, []);

  // Removed sports fetch effect

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!facilityOwnerEmail || !token) return;
    fetch(
      `${BASE_URL}/api/bookings/getByOwner?ownerEmail=${encodeURIComponent(
        facilityOwnerEmail
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings: " + res.status);
        return res.json();
      })
      .then((data) => {
        // Total bookings count
        setTotalBookings(Array.isArray(data) ? data.length : 0);

        // Compute booked dates (YYYY-MM-DD) from slots
        try {
          const dates = new Set();
          if (Array.isArray(data)) {
            data.forEach((booking) => {
              if (Array.isArray(booking.slots)) {
                booking.slots.forEach((slot) => {
                  const start = slot?.startDateTime
                    ? new Date(slot.startDateTime)
                    : null;
                  const end = slot?.endDateTime
                    ? new Date(slot.endDateTime)
                    : null;
                  if (start && !isNaN(start)) {
                    // If end exists and goes beyond start day, mark range inclusive; else just start day
                    const startDay = new Date(
                      start.getFullYear(),
                      start.getMonth(),
                      start.getDate()
                    );
                    const endDay =
                      end && !isNaN(end)
                        ? new Date(
                            end.getFullYear(),
                            end.getMonth(),
                            end.getDate()
                          )
                        : new Date(startDay);
                    for (
                      let cur = new Date(startDay);
                      cur <= endDay;
                      cur.setDate(cur.getDate() + 1)
                    ) {
                      const key = `${cur.getFullYear()}-${String(
                        cur.getMonth() + 1
                      ).padStart(2, "0")}-${String(cur.getDate()).padStart(
                        2,
                        "0"
                      )}`;
                      dates.add(key);
                    }
                  }
                });
              }
            });
          }
          setBookedDateKeys(dates);
        } catch {
          setBookedDateKeys(new Set());
        }
      })
      .catch(() => {
        setTotalBookings(null);
        setBookedDateKeys(new Set());
      });
  }, [facilityOwnerEmail]);

  // Fetch total venues like MyVenue page and show under Active Courts
  useEffect(() => {
    const ownerEmail = localStorage.getItem("email") || "";
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt") ||
      "";
    if (!ownerEmail) {
      setVenuesError("Missing owner email");
      setVenuesCount(null);
      setVenuesLoading(false);
      return;
    }
    setVenuesLoading(true);
    setVenuesError(null);
    fetch(`${BASE_URL}/api/venues/allVenues/${ownerEmail}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token.trim()}` : undefined,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((arr) => {
        setVenuesCount(Array.isArray(arr) ? arr.length : 0);
      })
      .catch(() => {
        setVenuesError("Failed to load venues");
        setVenuesCount(null);
      })
      .finally(() => setVenuesLoading(false));
  }, []);

  // Check authentication before opening venue form
  const handleCreateVenueClick = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      alert("Please log in to create a venue.");
      window.location.href = "/login";
      return;
    }

    setIsVenueFormOpen(true);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboard}>
      <Navbar />
      {/* Floating Plus Button */}
      <button
        className={styles.floatingPlusBtn}
        onClick={handleCreateVenueClick}
        title="Create New Venue"
      >
        <Plus size={24} />
      </button>

      {/* Venue Form Modal */}
      <VenueForm
        isOpen={isVenueFormOpen}
        onClose={() => setIsVenueFormOpen(false)}
      />

      {/* Header */}
      <header
        className={styles.dashboardHeader}
        style={{ marginTop: "100px", paddingTop: "2rem" }}
      >
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>Welcome back, {userName}!</h1>
            <p className={styles.welcomeSubtitle}>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.timeDisplay}>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section className={styles.kpiSection}>
        <div className={styles.kpiGrid}>
          <KPICard
            title="Total Bookings"
            value={totalBookings !== null ? totalBookings : "..."}
            icon={Calendar}
            trend={mockData.kpis.bookingGrowth}
            color="var(--accent-1)"
          />
          <KPICard
            title="Active Courts"
            value={
              venuesLoading
                ? "Loading..."
                : venuesError
                ? venuesError
                : venuesCount
            }
            icon={MapPin}
            color="var(--accent-2)"
          />
          <KPICard
            title="Yearly Earnings"
            value={
              earningsLoading
                ? "Loading..."
                : earningsError
                ? earningsError
                : `₹${yearlyEarnings?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
            }
            icon={DollarSign}
            // trend={8.2}
            color="var(--accent-3)"
          />
          <KPICard
            title="Peak Booking Date"
            value={peakDate ? peakDate : "-"}
            icon={Clock}
            color="#48a6a7"
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className={styles.chartsSection}>
        <div className={styles.chartsGrid}>
          {/* Booking Trends */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartControls}>
              <div className={styles.periodSelector}>
                {["monthly"].map((period) => (
                  <button
                    key={period}
                    className={`${styles.periodButton} ${
                      trendPeriod === period ? styles.active : ""
                    }`}
                    onClick={() => setTrendPeriod(period)}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <LineChart
              data={monthlyTrendsData}
              title={
                monthlyTrendsLoading
                  ? "Loading Monthly Booking Trends"
                  : monthlyTrendsError
                  ? "Monthly Booking Trends (unavailable)"
                  : "Monthly Booking Trends"
              }
            />
          </div>

          {/* Earnings Summary */}
          {/* <div className={styles.chartWrapper}>
            <DoughnutChart data={mockData.earnings} title="Earnings Summary" />
          </div> */}

          {/* Monthly Earnings Bar Chart */}
          <div className={styles.chartWrapper}>
            {/* Facility Owner Earnings Bar Graph (API integrated) */}
            <FacilityEarningsBarGraph
              facilityOwnerEmail={localStorage.getItem("email") || ""}
            />
          </div>

          {/* Total Revenue Line Chart */}
          {/* <div className={styles.chartWrapper}>
            <RevenueLineChart
              data={mockData.totalRevenue}
              title="Cumulative Revenue Growth"
            />
          </div> */}

          {/* Peak Booking Hours */}
          {/* <div className={`${styles.chartWrapper} ${styles.fullWidth}`}>
            <HeatmapChart
              data={mockData.peakHours}
              title="Peak Booking Hours"
            />
          </div> */}
        </div>
      </section>

      {/* Calendar and Upcoming Bookings */}
      <section className={styles.bottomSection}>
        <div className={styles.bottomGrid}>
          <div className={styles.calendarWrapper}>
            <BookingCalendar bookedDateKeys={bookedDateKeys} />
          </div>

          <div className={styles.upcomingBookings}>
            <h3 className={styles.sectionTitle}>Today's Bookings</h3>
            <div className={styles.bookingsList}>
              {todaysBookings.length === 0 ? (
                <div className={styles.bookingItem}>
                  No bookings created today.
                </div>
              ) : (
                todaysBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingItem}>
                    <div className={styles.bookingTime}>
                      {booking.slots && booking.slots.length > 0
                        ? `${new Date(
                            booking.slots[0].startDateTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(
                            booking.slots[0].endDateTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "-"}
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingCourt}>
                        Venue: {venueNames[booking.venueId] || booking.venueId}
                      </div>
                      <div className={styles.bookingCustomer}>
                        User: {booking.userEmail}
                      </div>
                      <div className={styles.bookingSport}>
                        Sport: {sportNames[booking.sportId] || booking.sportId}
                      </div>
                      <div className={styles.bookingSport}>
                        Status: {booking.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
