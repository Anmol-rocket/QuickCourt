"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./ProfilePage.module.css"
import BASE_URL from "../../api/baseURL"

// Helper functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatTime = (timeStr) => {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// Generate initials from name
const getInitials = (name) => {
  if (!name) return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

const isPast = (dateStr, endTime) => {
  const bookingEnd = new Date(`${dateStr}T${endTime}`)
  return bookingEnd < new Date()
}

const getPageNumbers = (current, total, maxButtons = 5) => {
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  const halfMax = Math.floor(maxButtons / 2)

  pages.push(1)

  const start = Math.max(2, current - halfMax + 1)
  const end = Math.min(total - 1, current + halfMax - 1)

  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("...")
  if (total > 1) pages.push(total)

  return pages
}

// Mock data
const defaultUser = {
  name: "Mitchell Admin",
  email: "mitchelladmin047@gmail.com",
}

const mockBookings = [
  {
    id: 1,
    venueName: "Skyline Badminton Court",
    sport: "Badminton",
    date: "2024-06-18",
    startTime: "17:00",
    endTime: "18:00",
    location: "Rajkot, Gujarat",
    status: "Confirmed",
    indoor: true,
    price: 25,
    rating: null,
  },
  {
    id: 2,
    venueName: "Downtown Tennis Club",
    sport: "Tennis",
    date: "2024-06-20",
    startTime: "14:00",
    endTime: "15:30",
    location: "Downtown",
    status: "Confirmed",
    outdoor: true,
    price: 30,
    rating: null,
  },
  {
    id: 3,
    venueName: "City Basketball Arena",
    sport: "Basketball",
    date: "2024-05-15",
    startTime: "19:00",
    endTime: "20:00",
    location: "City Center",
    status: "Past",
    indoor: true,
    price: 20,
    rating: 4,
  },
  {
    id: 4,
    venueName: "Riverside Soccer Field",
    sport: "Soccer",
    date: "2024-05-10",
    startTime: "16:00",
    endTime: "17:30",
    location: "Riverside",
    status: "Cancelled",
    outdoor: true,
    price: 40,
    rating: null,
  },
  {
    id: 5,
    venueName: "Elite Fitness Complex",
    sport: "Volleyball",
    date: "2024-06-25",
    startTime: "18:00",
    endTime: "19:00",
    location: "Uptown",
    status: "Confirmed",
    indoor: true,
    price: 35,
    rating: null,
  },
  {
    id: 6,
    venueName: "Metro Swimming Pool",
    sport: "Swimming",
    date: "2024-05-08",
    startTime: "07:00",
    endTime: "08:00",
    location: "Metro",
    status: "Past",
    indoor: true,
    price: 28,
    rating: 5,
  },
]

export default function ProfilePage({
  user = defaultUser,
  onLogout = () => console.log("Logout"),
  onBookClick = (bookingId) => console.log("Book:", bookingId),
  pageSize = 4,
}) {
  // State management
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [activeNav, setActiveNav] = useState("bookings")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookings, setBookings] = useState(mockBookings)
  const [userData, setUserData] = useState(user)
  const [showCancelModal, setShowCancelModal] = useState(null)
  const [reviewingBooking, setReviewingBooking] = useState(null)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [showPassword, setShowPassword] = useState({ old: false, new: false })
  const [showLogoutToast, setShowLogoutToast] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' })
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [userDataError, setUserDataError] = useState('')
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    oldPassword: "",
    newPassword: "",
  })

  // Refs
  const bookingsListRef = useRef(null)
  const modalRef = useRef(null)

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "cancelled") return booking.status === "Cancelled"
    return true
  })

  // Add computed properties to bookings
  const enrichedBookings = filteredBookings.map((booking) => ({
    ...booking,
    canCancel: booking.status === "Confirmed" && !isPast(booking.date, booking.endTime),
    canReview: booking.status === "Past" && !booking.rating,
  }))

  // Pagination
  const totalPages = Math.ceil(enrichedBookings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentBookings = enrichedBookings.slice(startIndex, startIndex + pageSize)
  const showingStart = startIndex + 1
  const showingEnd = Math.min(startIndex + pageSize, enrichedBookings.length)

  // Fetch user data from API
  const fetchUserData = async () => {
    setIsLoadingUserData(true)
    setUserDataError('')

    try {
      const token = localStorage.getItem("token")
      
      // Get email from token or use a default email
      // In a real app, you'd decode the JWT token to get the email
      const userEmail = localStorage.getItem("userEmail") || "sauvirwodehras3136@gmail.com"
      
      const response = await fetch(`${BASE_URL}/data/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        try {
          const responseText = await response.text()
          if (responseText) {
            const userData = JSON.parse(responseText)
            
            // Update user data state
            setUserData({
              name: userData.fullName || userData.name || "Guest",
              email: userData.email,
              role: userData.role,
              verified: userData.verified
            })

            // Update form data with fetched user data
            setFormData({
              name: userData.fullName || userData.name || "",
              email: userData.email || "",
              oldPassword: "",
              newPassword: "",
            })
          } else {
            setUserDataError('Empty response from server.')
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          setUserDataError('Invalid response format from server.')
        }

      } else if (response.status === 500) {
        setUserDataError('User not found. Please check your login status.')
        console.error('User not found or server error')
      } else {
        setUserDataError('Failed to load user data. Please try again.')
        console.error('Failed to fetch user data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserDataError('Network error. Please check your connection.')
    } finally {
      setIsLoadingUserData(false)
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      bookingsListRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking)),
    )
    setShowCancelModal(null)
  }

  // Handle review submission
  const handleSubmitReview = (bookingId) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, rating: reviewRating } : booking)),
    )
    setReviewingBooking(null)
    setReviewText("")
    setReviewRating(5)
  }

  // Handle form submission
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.includes("@")) {
      setUpdateMessage({ type: 'error', text: 'Please provide valid name and email' })
      return
    }

    setIsUpdating(true)
    setUpdateMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem("token")
      
      // Prepare the update payload
      const updatePayload = {
        email: formData.email,
        fullName: formData.name,
        avatarUrl: userData.avatarUrl || "https://via.placeholder.com/120x120/48A6A7/ffffff?text=" + formData.name.charAt(0),
        role: "ROLE_USER",
        verified: false
      }

      // Only include password if new password is provided
      if (formData.newPassword.trim()) {
        if (!formData.oldPassword.trim()) {
          setUpdateMessage({ type: 'error', text: 'Current password is required to set new password' })
          setIsUpdating(false)
          return
        }
        // In a real app, you'd validate the old password first
        updatePayload.password = formData.newPassword // Note: This should be hashed on the backend
      }

      const response = await fetch(`${BASE_URL}/updateRegistration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      })

      if (response.ok) {
        // Try to parse JSON response, but handle cases where there might be no response body
        let updatedUser = null
        try {
          const responseText = await response.text()
          if (responseText) {
            updatedUser = JSON.parse(responseText)
          }
        } catch (parseError) {
          console.log('No JSON response body, but update was successful')
        }
        
        // Update local state
        setUserData((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
        }))

        // Clear password fields
        setFormData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: ''
        }))

        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        // Handle error responses more carefully
        let errorMessage = 'Failed to update profile. Please try again.'
        try {
          const responseText = await response.text()
          if (responseText) {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorMessage
          }
        } catch (parseError) {
          // If we can't parse the error response, use the HTTP status
          errorMessage = `Update failed with status ${response.status}. Please try again.`
        }
        
        setUpdateMessage({ 
          type: 'error', 
          text: errorMessage
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setUpdateMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutToast(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutToast(false)
    onLogout()
  }

  const handleLogoutCancel = () => {
    setShowLogoutToast(false)
  }

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Clear update message after 5 seconds
  useEffect(() => {
    if (updateMessage.text) {
      const timer = setTimeout(() => {
        setUpdateMessage({ type: '', text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [updateMessage])

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowCancelModal(null)
        setReviewingBooking(null)
        setShowLogoutToast(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <div className={`${styles.page} ${isVisible ? styles.fadeIn : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>QuickCourt</h1>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.bookBtn}>
              <span>📅</span>
              Book Venue
            </button>

            <div className={styles.profileMenu}>
              <div className={styles.avatarInitials}>
                {getInitials(userData.name)}
              </div>
              <span className={styles.userName}>{userData.name}</span>
              <button onClick={handleLogoutClick} className={styles.logoutBtn} aria-label="Logout">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              {isLoadingUserData ? (
                <div className={styles.loadingProfile}>
                  <div className={styles.spinner}></div>
                  <p>Loading profile...</p>
                </div>
              ) : userDataError ? (
                <div className={styles.errorProfile}>
                  <p>❌ {userDataError}</p>
                  <button onClick={fetchUserData} className={styles.retryBtn}>
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatarInitialsLarge}>
                      {getInitials(userData.name)}
                    </div>
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>{userData.name}</h3>
                    <p className={styles.email}>{userData.email}</p>
                  </div>
                </>
              )}
            </div>

            <nav className={styles.navigation}>
              <button
                className={`${styles.navBtn} ${activeNav === "bookings" ? styles.navActive : ""}`}
                onClick={() => setActiveNav("bookings")}
              >
                <span className={styles.navIcon}>📋</span>
                My Bookings
              </button>
              <button
                className={`${styles.navBtn} ${activeNav === "profile" ? styles.navActive : ""}`}
                onClick={() => setActiveNav("profile")}
              >
                <span className={styles.navIcon}>👤</span>
                Edit Profile
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={styles.content}>
            {activeNav === "bookings" && (
              <div className={styles.bookingsSection}>
                <div className={styles.sectionHeader}>
                  <h2>My Bookings</h2>
                  <div className={styles.tabs}>
                    <button
                      className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Bookings
                    </button>
                    <button
                      className={`${styles.tab} ${activeTab === "cancelled" ? styles.tabActive : ""}`}
                      onClick={() => setActiveTab("cancelled")}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                <div className={styles.bookingsList} ref={bookingsListRef}>
                  <div className={styles.bookingsHeader}>
                    <p className={styles.bookingsCount}>
                      {enrichedBookings.length} booking{enrichedBookings.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className={styles.bookingsGrid}>
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className={styles.bookingCard}>
                        <div className={styles.cardHeader}>
                          <div className={styles.venueInfo}>
                            <h4>{booking.venueName}</h4>
                            <p className={styles.sport}>{booking.sport}</p>
                          </div>
                          <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className={styles.bookingDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📅</span>
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>🕐</span>
                            <span>
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📍</span>
                            <span>{booking.location}</span>
                          </div>
                          {booking.price && (
                            <div className={styles.detailRow}>
                              <span className={styles.detailIcon}>💰</span>
                              <span className={styles.price}>${booking.price}</span>
                            </div>
                          )}
                        </div>

                        {(booking.indoor || booking.outdoor) && (
                          <div className={styles.tags}>
                            {booking.indoor && <span className={styles.tag}>Indoor</span>}
                            {booking.outdoor && <span className={styles.tag}>Outdoor</span>}
                          </div>
                        )}

                        <div className={styles.cardActions}>
                          {booking.canCancel && (
                            <button className={styles.cancelBtn} onClick={() => setShowCancelModal(booking.id)}>
                              Cancel
                            </button>
                          )}
                          {booking.canReview && (
                            <button className={styles.reviewBtn} onClick={() => setReviewingBooking(booking.id)}>
                              Review
                            </button>
                          )}
                          <button className={styles.detailsBtn} onClick={() => onBookClick(booking.id)}>
                            Details
                          </button>
                        </div>

                        {reviewingBooking === booking.id && (
                          <div className={styles.reviewForm}>
                            <div className={styles.starRating}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  className={star <= reviewRating ? styles.starActive : styles.star}
                                  onClick={() => setReviewRating(star)}
                                  aria-label={`${star} stars`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Share your experience..."
                              rows="3"
                              className={styles.reviewTextarea}
                            />
                            <div className={styles.reviewActions}>
                              <button className={styles.reviewCancel} onClick={() => setReviewingBooking(null)}>
                                Cancel
                              </button>
                              <button className={styles.reviewSubmit} onClick={() => handleSubmitReview(booking.id)}>
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>

                      <div className={styles.pageNumbers}>
                        {getPageNumbers(currentPage, totalPages).map((page, index) => (
                          <button
                            key={index}
                            className={`${styles.pageBtn} ${
                              page === currentPage ? styles.pageActive : ""
                            } ${page === "..." ? styles.pageEllipsis : ""}`}
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === "..."}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeNav === "profile" && (
              <div className={styles.profileSection}>
                <div className={styles.sectionHeader}>
                  <h2>Edit Profile</h2>
                </div>

                {/* User Data Error */}
                {userDataError && (
                  <div className={`${styles.updateMessage} ${styles.error}`}>
                    ❌ {userDataError}
                  </div>
                )}

                {/* Update Message */}
                {updateMessage.text && (
                  <div className={`${styles.updateMessage} ${styles[updateMessage.type]}`}>
                    {updateMessage.type === 'success' ? '✅' : '❌'} {updateMessage.text}
                  </div>
                )}

                {isLoadingUserData ? (
                  <div className={styles.loadingForm}>
                    <div className={styles.spinner}></div>
                    <p>Loading user data...</p>
                  </div>
                ) : (
                  <form className={styles.profileForm} onSubmit={handleSaveProfile}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="oldPassword">Current Password</label>
                    <div className={styles.passwordField}>
                      <input
                        id="oldPassword"
                        type={showPassword.old ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
                      >
                        {showPassword.old ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <div className={styles.passwordField}>
                      <input
                        id="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPassword.new ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.resetBtn}>
                      Reset
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <span className={styles.spinner}></span>
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Toast */}
      {showLogoutToast && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 10000,
          fontSize: '16px',
          fontWeight: '500',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          minWidth: '320px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
            🚪 Logout Confirmation
          </div>
          <div style={{ marginBottom: '20px', color: '#666', lineHeight: '1.5' }}>
            Are you sure you want to logout from your account?
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={handleLogoutCancel}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                color: '#333',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            >
              Cancel
            </button>
            <button 
              onClick={handleLogoutConfirm}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff4757',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                color: 'white',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff3742'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4757'}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout Toast Backdrop */}
      {showLogoutToast && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }} onClick={handleLogoutCancel} />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className={styles.modal} aria-modal="true" role="dialog">
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>Cancel Booking</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowCancelModal(null)}>
                Keep Booking
              </button>
              <button className={styles.modalConfirm} onClick={() => handleCancelBooking(showCancelModal)}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
