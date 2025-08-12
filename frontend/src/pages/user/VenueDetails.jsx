"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import styles from "./VenueDetails.module.css"
import BASE_URL from "../../api/baseURL"

// Generate initials from name
const getInitials = (name) => {
  if (!name || name === "Guest") return "👤"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
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
    
    // Transform API data to match our component structure
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
      pricePerHour: Math.floor(Math.random() * 50) + 20,
      indoor: Math.random() > 0.5,
      outdoor: Math.random() > 0.5,
      sports: ["Basketball", "Tennis", "Volleyball", "Badminton"],
      ratingCount: Math.floor(Math.random() * 200) + 50,
      location: venue.address ? venue.address.split(',')[0] : "Location not specified",
    }
  } catch (error) {
    console.error('Error fetching venue details:', error)
    throw error
  }
}

export default function VenueDetails({ userName = "Guest" }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  
  // Carousel refs
  const carouselRef = useRef(null)
  
  // Login state
  const isLoggedIn = Boolean(localStorage.getItem("token"))

  // Fetch venue details on component mount
  useEffect(() => {
    const loadVenueDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const venueData = await fetchVenueById(id)
        setVenue(venueData)
      } catch (err) {
        setError('Failed to load venue details. Please try again.')
        console.error('Error loading venue:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadVenueDetails()
    }
  }, [id])

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Navigation handlers
  const handleBackClick = () => navigate(-1)
  const handleProfileClick = () => navigate('/dashboard/profile')
  const handleDashboardClick = () => navigate('/dashboard')
  const handleLoginClick = () => navigate('/login')
  const handleBookNow = () => navigate(`/dashboard/booking?venue=${id}`)

  // Carousel handlers
  const nextImage = () => {
    if (venue?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
    }
  }

  const prevImage = () => {
    if (venue?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
    }
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
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
          <h2>😕 Venue Not Found</h2>
          <p>{error || 'The venue you are looking for could not be found.'}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  const hasImages = venue.images && venue.images.length > 0

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
            <span>{venue.name}</span>
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

        {/* Main Content */}
        <div className={styles.venueContent}>
          {/* Image Carousel Section */}
          <div className={styles.imageSection}>
            {hasImages ? (
              <div className={styles.carousel} ref={carouselRef}>
                <div className={styles.carouselContainer}>
                  <div 
                    className={styles.carouselTrack}
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {venue.images.map((image, index) => (
                      <div key={index} className={styles.carouselSlide}>
                        <img 
                          src={image} 
                          alt={`${venue.name} - Image ${index + 1}`}
                          className={styles.carouselImage}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x400/48A6A7/ffffff?text=Image+Not+Available"
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {venue.images.length > 1 && (
                    <>
                      <button 
                        className={`${styles.carouselBtn} ${styles.prevBtn}`}
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button 
                        className={`${styles.carouselBtn} ${styles.nextBtn}`}
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className={styles.imageCounter}>
                    {currentImageIndex + 1} / {venue.images.length}
                  </div>
                </div>

                {/* Dots Indicator */}
                {venue.images.length > 1 && (
                  <div className={styles.carouselDots}>
                    {venue.images.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                        onClick={() => goToImage(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.noImageContainer}>
                <img 
                  src="https://via.placeholder.com/800x400/48A6A7/ffffff?text=No+Images+Available"
                  alt={venue.name}
                  className={styles.placeholderImage}
                />
              </div>
            )}
          </div>

          {/* Venue Information */}
          <div className={styles.venueInfo}>
            <div className={styles.venueHeader}>
              <div className={styles.titleSection}>
                <h1 className={styles.venueName}>{venue.name}</h1>
                <div className={styles.venuebadges}>
                  {venue.verified && (
                    <span className={styles.verifiedBadge}>
                      ✓ Verified
                    </span>
                  )}
                  <span className={styles.typeBadge}>
                    {venue.indoor && venue.outdoor ? "Indoor/Outdoor" : venue.indoor ? "Indoor" : "Outdoor"}
                  </span>
                </div>
              </div>
              
              <div className={styles.priceSection}>
                <span className={styles.price}>₹{venue.pricePerHour}</span>
                <span className={styles.priceUnit}>/hour</span>
              </div>
            </div>

            {/* Rating and Location */}
            <div className={styles.venueMetaRow}>
              {renderStars(venue.rating, venue.ratingCount)}
              <div className={styles.locationInfo}>
                <span className={styles.locationIcon}>📍</span>
                <span className={styles.address}>{venue.address}</span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.descriptionSection}>
              <h3>About this venue</h3>
              <p className={styles.description}>
                {venue.description || "No description available for this venue."}
              </p>
            </div>

            {/* Sports Available */}
            <div className={styles.sportsSection}>
              <h3>Sports Available</h3>
              <div className={styles.sportsTags}>
                {venue.sports.map((sport, index) => (
                  <span key={index} className={styles.sportTag}>
                    {sport}
                  </span>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {venue.amenities.length > 0 && (
              <div className={styles.amenitiesSection}>
                <h3>Amenities</h3>
                <div className={styles.amenitiesList}>
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className={styles.amenityItem}>
                      <span className={styles.amenityIcon}>✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className={styles.contactSection}>
              <h3>Contact Information</h3>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>{venue.ownerMail}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.bookNowBtn} onClick={handleBookNow}>
                <span className={styles.bookIcon}>🎯</span>
                Book Now
              </button>
              <button className={styles.shareBtn}>
                <span className={styles.shareIcon}>🔗</span>
                Share
              </button>
              <button className={styles.favoriteBtn}>
                <span className={styles.heartIcon}>🤍</span>
                Add to Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
