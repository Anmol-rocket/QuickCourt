"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, useParams, useLocation } from "react-router-dom"
import styles from "./CourtBooking.module.css"
import BASE_URL from "../../api/baseURL"
import PaymentModal from "../../components/PaymentModal"

// Generate initials from name
const getInitials = (name) => {
  if (!name || name === "Guest") return "👤"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

// Format price with rupee symbol
const formatPrice = (amount) => {
  if (!amount || amount === 0) return "₹0.00"
  return `₹${parseFloat(amount).toFixed(2)}`
}

// Format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

// Generate hourly time slots
const generateHourlyTimeSlots = () => {
  const slots = []
  for (let hour = 6; hour <= 23; hour++) {
    const timeString = hour.toString().padStart(2, '0') + ':00'
    const displayTime = formatTime(timeString)
    slots.push({
      value: timeString,
      display: displayTime
    })
  }
  return slots
}

// Parse operating hours from string format "08:00 - 22:00"
const parseOperatingHours = (operatingHours) => {
  if (!operatingHours) return { start: '06:00', end: '23:00' }
  
  try {
    const [startTime, endTime] = operatingHours.split(' - ')
    return {
      start: startTime.trim(),
      end: endTime.trim()
    }
  } catch (error) {
    console.warn('Failed to parse operating hours:', operatingHours)
    return { start: '06:00', end: '23:00' }
  }
}

// Generate time slots based on sport's operating hours
const generateSportTimeSlots = (operatingHours) => {
  const { start, end } = parseOperatingHours(operatingHours)
  const slots = []
  
  // Convert start and end times to hour numbers
  const startHour = parseInt(start.split(':')[0])
  const endHour = parseInt(end.split(':')[0])
  
  for (let hour = startHour; hour <= endHour; hour++) {
    const timeString = hour.toString().padStart(2, '0') + ':00'
    const displayTime = formatTime(timeString)
    slots.push({
      value: timeString,
      display: displayTime
    })
  }
  
  return slots
}

// Check if a time is within operating hours
const isTimeWithinOperatingHours = (time, operatingHours) => {
  if (!time || !operatingHours) return false
  
  const { start, end } = parseOperatingHours(operatingHours)
  const timeHour = parseInt(time.split(':')[0])
  const startHour = parseInt(start.split(':')[0])
  const endHour = parseInt(end.split(':')[0])
  
  return timeHour >= startHour && timeHour <= endHour
}

// Check if a time slot is booked for the selected date
const isTimeSlotBooked = (time, selectedDate, bookedSlots) => {
  if (!time || !selectedDate || !bookedSlots.length) return false
  
  const selectedDateTime = new Date(`${selectedDate}T${time}:00`)
  
  return bookedSlots.some(slot => {
    const startTime = new Date(slot.startDateTime)
    const endTime = new Date(slot.endDateTime)
    
    // Check if the selected time falls within any booked slot
    return selectedDateTime >= startTime && selectedDateTime < endTime
  })
}

// Filter available time slots based on booked slots
const getAvailableTimeSlots = (allSlots, selectedDate, bookedSlots) => {
  if (!allSlots.length) return []
  
  return allSlots.filter(slot => !isTimeSlotBooked(slot.value, selectedDate, bookedSlots))
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// API function to fetch venue by ID
const fetchVenueById = async (venueId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch venue details')
    }
    
    const venue = await response.json()
    
    // Transform API data
    return {
      id: venue.id,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      images: venue.photoUrls || [],
      amenities: venue.amenities || [],
      rating: venue.rating || 0,
      verified: venue.verified || false,
      ownerMail: venue.ownerMail,
      sportIds: venue.sportIds || [],
      // Mock data for missing fields
      sports: ["Basketball", "Tennis", "Volleyball", "Badminton"],
      ratingCount: Math.floor(Math.random() * 200) + 50,
      location: venue.address ? venue.address.split(',')[0] : "Location not specified",
    }
  } catch (error) {
    console.error('Error fetching venue details:', error)
    throw error
  }
}

// API function to fetch sports by venue ID
const fetchSportsByVenue = async (venueId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/sports/venue/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return [] // No sports found for this venue
      }
      throw new Error('Failed to fetch sports data')
    }
    
    const sports = await response.json()
    return sports
  } catch (error) {
    console.error('Error fetching sports by venue:', error)
    return []
  }
}

// API function to create booking
const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create booking')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

// API function to fetch booked slots for a sport and venue
const fetchBookedSlots = async (venueId, sportId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/bookings/slots?venueId=${venueId}&sportId=${sportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return [] // No booked slots found
      }
      throw new Error('Failed to fetch booked slots')
    }
    
    const bookedSlots = await response.json()
    return bookedSlots
  } catch (error) {
    console.error('Error fetching booked slots:', error)
    return []
  }
}

export default function CourtBooking({ userName = "Guest" }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { venueId: routeVenueId } = useParams()
  const location = useLocation()
  
  // Get venue ID from multiple sources: URL params, search params, or location state
  const venueId = routeVenueId || searchParams.get('venue') || location.state?.venueId
  
  // State management
  const [venue, setVenue] = useState(null)
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const [sportsLoading, setSportsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Booking form state
  const [selectedSport, setSelectedSport] = useState("")
  const [selectedSportId, setSelectedSportId] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [pricePerSlot, setPricePerSlot] = useState(0.00)
  const [selectedSportOperatingHours, setSelectedSportOperatingHours] = useState("")
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [timeValidationMessage, setTimeValidationMessage] = useState("")
  const [bookedSlots, setBookedSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  
  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [pendingBookingData, setPendingBookingData] = useState(null)
  
  // Login state
  const isLoggedIn = Boolean(localStorage.getItem("token"))

  // Initialize date and time slots
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split('T')[0])
    
    // Initialize with default time slots
    setAvailableTimeSlots(generateHourlyTimeSlots())
  }, [])

  // Fetch venue details on component mount
  useEffect(() => {
    const loadVenueDetails = async () => {
      if (!venueId) {
        setError('No venue selected')
        setLoading(false)
        setSportsLoading(false)
        return
      }
      
      setLoading(true)
      setSportsLoading(true)
      setError(null)
      
      try {
        // Fetch venue details and sports data in parallel
        const [venueData, sportsData] = await Promise.all([
          fetchVenueById(venueId),
          fetchSportsByVenue(venueId)
        ])
        
        setVenue(venueData)
        setSports(sportsData)
        
        // Set default sport selection
        if (sportsData.length > 0) {
          const firstSport = sportsData[0]
          setSelectedSport(firstSport.name)
          setSelectedSportId(firstSport.id)
          setPricePerSlot(firstSport.pricePerHour)
          setSelectedSportOperatingHours(firstSport.operatingHours || "")
          
          // Generate available time slots for the first sport
          const sportTimeSlots = generateSportTimeSlots(firstSport.operatingHours)
          setAvailableTimeSlots(sportTimeSlots)
          
          // Set operating hours message
          if (firstSport.operatingHours) {
            setTimeValidationMessage(`${firstSport.name} is available from ${firstSport.operatingHours}`)
          }
        }
      } catch (err) {
        setError('Failed to load venue details. Please try again.')
        console.error('Error loading venue:', err)
      } finally {
        setLoading(false)
        setSportsLoading(false)
      }
    }

    loadVenueDetails()
  }, [venueId])

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Load booked slots when sport or date changes
  useEffect(() => {
    loadBookedSlots()
  }, [selectedSportId, selectedDate, venueId])

  // Handle date change and reload booked slots
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    // Clear time selections when date changes
    setStartTime("")
    setEndTime("")
  }

  // Navigation handlers
  const handleBackClick = () => navigate(-1)
  const handleProfileClick = () => navigate('/dashboard/profile')
  const handleDashboardClick = () => navigate('/dashboard')
  const handleLoginClick = () => navigate('/login')

  // Function to load booked slots for current sport and date
  const loadBookedSlots = async () => {
    if (!selectedSportId || !venueId || !selectedDate) return
    
    setSlotsLoading(true)
    try {
      const slots = await fetchBookedSlots(venueId, selectedSportId)
      setBookedSlots(slots)
      
      // Update available time slots based on booked slots
      const sportTimeSlots = generateSportTimeSlots(selectedSportOperatingHours)
      const filteredSlots = getAvailableTimeSlots(sportTimeSlots, selectedDate, slots)
      setAvailableTimeSlots(filteredSlots)
      
    } catch (error) {
      console.error('Error loading booked slots:', error)
      setBookedSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }

  // Handle sport selection
  const handleSportChange = (e) => {
    const sportName = e.target.value
    const selectedSportData = sports.find(sport => sport.name === sportName)
    
    setSelectedSport(sportName)
    if (selectedSportData) {
      setSelectedSportId(selectedSportData.id)
      setPricePerSlot(selectedSportData.pricePerHour)
      setSelectedSportOperatingHours(selectedSportData.operatingHours || "")
      
      // Generate available time slots for this sport
      const sportTimeSlots = generateSportTimeSlots(selectedSportData.operatingHours)
      setAvailableTimeSlots(sportTimeSlots)
      
      // Clear previous time selections and validation messages
      setStartTime("")
      setEndTime("")
      setTimeValidationMessage("")
      
      // Set validation message about operating hours
      if (selectedSportData.operatingHours) {
        setTimeValidationMessage(`${sportName} is available from ${selectedSportData.operatingHours}`)
      }
      
      // Load booked slots for this sport (will be called after state updates)
    } else {
      // Reset if no sport data found
      setSelectedSportOperatingHours("")
      setAvailableTimeSlots(generateHourlyTimeSlots())
      setTimeValidationMessage("")
      setBookedSlots([])
    }
  }

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!startTime || !endTime) return 0
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    const diffMs = end - start
    return diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const duration = calculateDuration()
    return duration * pricePerSlot
  }

  // Format time for display
  const formatTime = (time24) => {
    if (!time24) return ""
    const [hours, minutes] = time24.split(":")
    const hour12 = Number.parseInt(hours) % 12 || 12
    const ampm = Number.parseInt(hours) >= 12 ? "PM" : "AM"
    return `${hour12}:${minutes} ${ampm}`
  }

  // Handle time selection with validation
  const handleStartTimeChange = (e) => {
    const time = e.target.value
    setStartTime(time)
    
    // Check if the selected time is already booked
    if (isTimeSlotBooked(time, selectedDate, bookedSlots)) {
      setTimeValidationMessage(`This sport is reserved by someone else at this time. Please choose a different time or date.`)
      return
    }
    
    if (selectedSportOperatingHours && !isTimeWithinOperatingHours(time, selectedSportOperatingHours)) {
      setTimeValidationMessage(`Selected time is outside operating hours. ${selectedSport} is available from ${selectedSportOperatingHours}`)
    } else {
      setTimeValidationMessage(selectedSportOperatingHours ? `${selectedSport} is available from ${selectedSportOperatingHours}` : "")
    }
  }

  const handleEndTimeChange = (e) => {
    const time = e.target.value
    setEndTime(time)
    
    // Check if the selected time is already booked
    if (isTimeSlotBooked(time, selectedDate, bookedSlots)) {
      setTimeValidationMessage(`This sport is reserved by someone else at this time. Please choose a different time or date.`)
      return
    }
    
    if (selectedSportOperatingHours && !isTimeWithinOperatingHours(time, selectedSportOperatingHours)) {
      setTimeValidationMessage(`Selected time is outside operating hours. ${selectedSport} is available from ${selectedSportOperatingHours}`)
    } else {
      setTimeValidationMessage(selectedSportOperatingHours ? `${selectedSport} is available from ${selectedSportOperatingHours}` : "")
    }
  }

  // Render star rating
  const renderStars = (rating, count) => {
    return (
      <div className={styles.rating}>
        <div className={styles.stars}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
              ★
            </span>
          ))}
        </div>
        <span className={styles.ratingText}>
          {rating} ({count} reviews)
        </span>
      </div>
    )
  }

  // Handle booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedSport || !selectedDate || !startTime || !endTime || !selectedSportId) {
      alert('Please fill in all required fields')
      return
    }
    
    if (calculateDuration() <= 0) {
      alert('End time must be after start time')
      return
    }
    
    // Validate operating hours
    if (selectedSportOperatingHours) {
      if (!isTimeWithinOperatingHours(startTime, selectedSportOperatingHours)) {
        alert(`Start time is outside operating hours. ${selectedSport} is available from ${selectedSportOperatingHours}`)
        return
      }
      
      if (!isTimeWithinOperatingHours(endTime, selectedSportOperatingHours)) {
        alert(`End time is outside operating hours. ${selectedSport} is available from ${selectedSportOperatingHours}`)
        return
      }
    }
    
    // Validate against booked slots
    if (isTimeSlotBooked(startTime, selectedDate, bookedSlots)) {
      alert(`Start time ${formatTime(startTime)} is already booked. Please choose a different time.`)
      return
    }
    
    if (isTimeSlotBooked(endTime, selectedDate, bookedSlots)) {
      alert(`End time ${formatTime(endTime)} conflicts with existing booking. Please choose a different time.`)
      return
    }
    
    // Check if any time within the booking duration conflicts with existing bookings
    const bookingStart = new Date(`${selectedDate}T${startTime}:00`)
    const bookingEnd = new Date(`${selectedDate}T${endTime}:00`)
    
    const hasConflict = bookedSlots.some(slot => {
      const slotStart = new Date(slot.startDateTime)
      const slotEnd = new Date(slot.endDateTime)
      
      // Check for any overlap between booking time and existing slot
      return (bookingStart < slotEnd && bookingEnd > slotStart)
    })
    
    if (hasConflict) {
      alert(`Selected time slot conflicts with existing bookings. Please choose a different time.`)
      return
    }
    
    const userEmail = localStorage.getItem("email")
    
    if (!userEmail) {
      alert('User email not found. Please login again.')
      return
    }
    
    // Create the booking data according to API specification
    const bookingData = {
      sportId: selectedSportId, // Use the actual sport ID from API
      venueId: parseInt(venueId),
      facilityOwnerEmail: venue.ownerMail,
      userEmail: userEmail,
      slots: [
        {
          startDateTime: `${selectedDate}T${startTime}:00`,
          endDateTime: `${selectedDate}T${endTime}:00`,
          price: calculateTotalPrice()
        }
      ]
    }
    
    // Store booking data and show payment modal
    setPendingBookingData(bookingData)
    setShowPaymentModal(true)
  }

  // Payment handlers
  const handlePaymentSuccess = async (paymentResult) => {
    setPaymentLoading(true)
    
    try {
      // Create booking after successful payment
      const result = await createBooking(pendingBookingData)
      
      setSuccessMessage(`Payment successful! Booking created successfully. Payment ID: ${paymentResult.paymentIntent.id}`)
      console.log('Booking created:', result)
      console.log('Payment result:', paymentResult)
      
      // Clear form and close modal
      setShowPaymentModal(false)
      setPendingBookingData(null)
      
      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard/profile') // Redirect to profile to see bookings
      }, 3000)
      
    } catch (err) {
      alert('Payment was successful, but booking creation failed. Please contact support.')
      console.error('Booking error after payment:', err)
      setShowPaymentModal(false)
    } finally {
      setPaymentLoading(false)
    }
  }

  const handlePaymentError = (errorMessage) => {
    alert(`Payment failed: ${errorMessage}`)
    // Keep the modal open for retry
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
    setPendingBookingData(null)
  }

  // Helper function to create booking details for payment modal
  const getBookingDetailsForPayment = () => {
    if (!pendingBookingData) return null
    
    return {
      venueName: venue?.name || 'Unknown Venue',
      sportName: selectedSport,
      date: selectedDate,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      duration: `${calculateDuration()} hour${calculateDuration() !== 1 ? 's' : ''}`
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading venue details...</p>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>😕 Unable to Load Venue</h2>
          <p>{error || 'The venue you are trying to book could not be found.'}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.page} ${isVisible ? styles.fadeIn : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>QuickCourt</h1>
        </div>
        <div className={styles.breadcrumb}>
          <nav aria-label="Breadcrumb">
            <button onClick={handleDashboardClick} className={styles.breadcrumbLink}>
              Dashboard
            </button> / 
            <button onClick={() => navigate('/dashboard/venues')} className={styles.breadcrumbLink}>
              Venues
            </button> / 
            <span>Book {venue.name}</span>
          </nav>
        </div>
        <div className={styles.headerRight}>
          {isLoggedIn ? (
            <button className={styles.loginButton} onClick={handleProfileClick} aria-label="Profile">
              <div className={styles.avatarInitials}>
                {getInitials(userName)}
              </div>
            </button>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className={styles.container}>
        {/* Back Button */}
        <button onClick={handleBackClick} className={styles.backBtn}>
          ← Back to Venues
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            ✅ {successMessage}
          </div>
        )}

        {/* Main Content */}
        <div className={styles.bookingContent}>
          {/* Venue Information */}
          <div className={styles.venueSection}>
            <div className={styles.venueCard}>
              {venue.images.length > 0 && (
                <div className={styles.venueImageContainer}>
                  <img 
                    src={venue.images[0]} 
                    alt={venue.name}
                    className={styles.venueImage}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200/48A6A7/ffffff?text=No+Image"
                    }}
                  />
                </div>
              )}
              
              <div className={styles.venueInfo}>
                <div className={styles.venueHeader}>
                  <h2 className={styles.venueName}>{venue.name}</h2>
                  <div className={styles.venueBadges}>
                    {venue.verified && (
                      <span className={styles.verifiedBadge}>✓ Verified</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.venueMetaRow}>
                  {renderStars(venue.rating, venue.ratingCount)}
                  <div className={styles.locationInfo}>
                    <span className={styles.locationIcon}>📍</span>
                    <span className={styles.address}>{venue.address}</span>
                  </div>
                </div>
                
                <p className={styles.venueDescription}>
                  {venue.description || "Premium sports facility with modern amenities."}
                </p>
                
                {venue.amenities.length > 0 && (
                  <div className={styles.amenitiesPreview}>
                    <span className={styles.amenitiesLabel}>Amenities:</span>
                    <div className={styles.amenitiesTags}>
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className={styles.amenityTag}>
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className={styles.moreAmenities}>
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className={styles.bookingSection}>
            <div className={styles.bookingCard}>
              <h3 className={styles.bookingTitle}>Book Your Slot</h3>
              
              <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
                {/* Sport Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>🏃</span>
                    Sport
                  </label>
                  {sportsLoading ? (
                    <div className={styles.loadingSelect}>
                      <span>Loading sports...</span>
                    </div>
                  ) : sports.length === 0 ? (
                    <div className={styles.noSportsMessage}>
                      <span>No sports available for this venue</span>
                    </div>
                  ) : (
                    <select
                      value={selectedSport}
                      onChange={handleSportChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select a sport</option>
                      {sports.map((sport) => (
                        <option key={sport.id} value={sport.name}>
                          {sport.name} - {formatPrice(sport.pricePerHour)}/hour ({sport.type})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Date Selection */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>📅</span>
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={styles.input}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {selectedDate && (
                    <div className={styles.dateDisplay}>
                      {formatDate(selectedDate)}
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                <div className={styles.timeRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>🕐</span>
                      Start Time
                    </label>
                    <select
                      value={startTime}
                      onChange={handleStartTimeChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select start time</option>
                      {(selectedSportOperatingHours ? generateSportTimeSlots(selectedSportOperatingHours) : generateHourlyTimeSlots()).map((slot) => {
                        const isBooked = isTimeSlotBooked(slot.value, selectedDate, bookedSlots)
                        return (
                          <option 
                            key={slot.value} 
                            value={slot.value}
                            disabled={isBooked}
                            style={isBooked ? { color: '#999', backgroundColor: '#f5f5f5' } : {}}
                          >
                            {slot.display} {isBooked ? '(Reserved)' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>🕐</span>
                      End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={handleEndTimeChange}
                      className={styles.select}
                      required
                    >
                      <option value="">Select end time</option>
                      {(selectedSportOperatingHours ? generateSportTimeSlots(selectedSportOperatingHours) : generateHourlyTimeSlots())
                        .filter(slot => {
                          if (!startTime) return true
                          const startHour = parseInt(startTime.split(':')[0])
                          const slotHour = parseInt(slot.value.split(':')[0])
                          return slotHour >= startHour + 1
                        })
                        .map((slot) => {
                          const isBooked = isTimeSlotBooked(slot.value, selectedDate, bookedSlots)
                          return (
                            <option 
                              key={slot.value} 
                              value={slot.value}
                              disabled={isBooked}
                              style={isBooked ? { color: '#999', backgroundColor: '#f5f5f5' } : {}}
                            >
                              {slot.display} {isBooked ? '(Reserved)' : ''}
                            </option>
                          )
                        })}
                    </select>
                  </div>
                </div>

                {/* Operating Hours and Availability Message */}
                {(timeValidationMessage || slotsLoading) && (
                  <div className={styles.operatingHoursMessage}>
                    <span className={styles.messageIcon}>
                      {slotsLoading ? "⏳" : "ℹ️"}
                    </span>
                    {slotsLoading ? (
                      "Checking availability..."
                    ) : (
                      timeValidationMessage
                    )}
                  </div>
                )}

                {/* Price per Hour Display */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>💰</span>
                    Price per Hour
                  </label>
                  <div className={styles.priceDisplay}>
                    {selectedSport ? (
                      <>
                        <strong>{formatPrice(pricePerSlot)}/hour</strong>
                        <span className={styles.sportTypeLabel}>
                          for {selectedSport}
                        </span>
                      </>
                    ) : (
                      <span className={styles.noPriceLabel}>
                        Select a sport to see pricing
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking Summary */}
                <div className={styles.bookingSummary}>
                  <h4 className={styles.summaryTitle}>Booking Summary</h4>
                  <div className={styles.summaryRow}>
                    <span>Sport:</span>
                    <span>{selectedSport || "Not selected"}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Date:</span>
                    <span>{selectedDate || "Not selected"}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Time:</span>
                    <span>
                      {startTime && endTime 
                        ? `${formatTime(startTime)} - ${formatTime(endTime)}`
                        : "Not selected"
                      }
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Duration:</span>
                    <span>{calculateDuration().toFixed(1)} hours</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Rate:</span>
                    <span>{formatPrice(pricePerSlot)}/hour</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total Amount:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.bookButton}
                  disabled={
                    bookingLoading || 
                    paymentLoading ||
                    !selectedSport || 
                    !selectedSportId ||
                    !selectedDate || 
                    !startTime || 
                    !endTime ||
                    sports.length === 0
                  }
                >
                  {bookingLoading || paymentLoading ? (
                    <>
                      <span className={styles.spinner}></span>
                      {paymentLoading ? 'Processing Payment...' : 'Preparing Payment...'}
                    </>
                  ) : (
                    <>
                      <span className={styles.bookIcon}>🎯</span>
                      Proceed to Payment - {formatPrice(calculateTotalPrice())}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        amount={calculateTotalPrice()}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onCancel={handlePaymentCancel}
        bookingDetails={getBookingDetailsForPayment()}
      />
    </div>
  )
}
