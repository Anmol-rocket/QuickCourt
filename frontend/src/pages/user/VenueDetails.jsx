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

// Format date and time
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
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

// API function to fetch comments for a venue
const fetchVenueComments = async (venueId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/comments/sport/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return [] // No comments found
      }
      throw new Error('Failed to fetch comments')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw error
  }
}

// API function to fetch overall rating for a venue
const fetchVenueRating = async (venueId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/comments/getRating/${venueId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return 0 // No rating found
      }
      throw new Error('Failed to fetch venue rating')
    }
    
    const rating = await response.json()
    return typeof rating === 'number' ? rating : 0
  } catch (error) {
    console.error('Error fetching venue rating:', error)
    return 0 // Return 0 as fallback
  }
}

// API function to fetch sport details by venue and sport ID
const fetchSportDetails = async (venueId, sportId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/venues/${venueId}/sports/${sportId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch sport details')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching sport details:', error)
    return { name: `Sport ${sportId}` } // Fallback name
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
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentsError, setCommentsError] = useState(null)
  const [sportsData, setSportsData] = useState({})
  const [overallRating, setOverallRating] = useState(0)
  const [loadingRating, setLoadingRating] = useState(false)
  
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
        
        // Load comments and overall rating after venue data is loaded
        loadComments(id)
        loadOverallRating(id)
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

  // Function to load overall rating
  const loadOverallRating = async (venueId) => {
    setLoadingRating(true)
    
    try {
      const rating = await fetchVenueRating(venueId)
      setOverallRating(rating)
    } catch (err) {
      console.error('Error loading overall rating:', err)
      setOverallRating(0) // Fallback to 0
    } finally {
      setLoadingRating(false)
    }
  }

  // Function to load comments and associated sports data
  const loadComments = async (venueId) => {
    setLoadingComments(true)
    setCommentsError(null)
    
    try {
      const commentsData = await fetchVenueComments(venueId)
      setComments(commentsData)
      
      // Fetch sport names for all unique sport IDs in comments
      const uniqueSportIds = [...new Set(commentsData.map(comment => comment.sportId))]
      const sportsPromises = uniqueSportIds.map(async (sportId) => {
        const sportDetails = await fetchSportDetails(venueId, sportId)
        return { [sportId]: sportDetails.name }
      })
      
      const sportsResults = await Promise.all(sportsPromises)
      const sportsMap = sportsResults.reduce((acc, sport) => ({ ...acc, ...sport }), {})
      setSportsData(sportsMap)
      
    } catch (err) {
      setCommentsError('Failed to load reviews.')
      console.error('Error loading comments:', err)
    } finally {
      setLoadingComments(false)
    }
  }

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
  const renderStars = (rating, count, isLoading = false) => {
    if (isLoading) {
      return (
        <div className={styles.rating}>
          <div className={styles.stars}>
            <span className={styles.loadingText}>Loading rating...</span>
          </div>
        </div>
      )
    }

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
          {rating.toFixed(1)} {count !== undefined ? `(${count} reviews)` : '(Overall Rating)'}
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
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>QuickCourt</h1>
          </div>
          <div className={styles.breadcrumb}>
            <nav aria-label="Breadcrumb">
              <button onClick={handleDashboardClick} className={styles.breadcrumbLink}>
                Dashboard
              </button> 
              <span className={styles.breadcrumbSeparator}>/</span>
              <button onClick={() => navigate('/dashboard/venues')} className={styles.breadcrumbLink}>
                Venues
              </button> 
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{venue.name}</span>
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
        </div>
      </header>

      <div className={styles.container}>
        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button onClick={handleBackClick} className={styles.backBtn}>
            <span className={styles.backIcon}>←</span>
            Back to Venues
          </button>
        </div>

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
                          src={image || "/placeholder.svg"} 
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
            {/* Improved venue header layout with better spacing */}
            <div className={styles.venueHeader}>
              <div className={styles.titleSection}>
                <h1 className={styles.venueName}>{venue.name}</h1>
                <div className={styles.venueBadges}>
                  {venue.verified && (
                    <span className={styles.verifiedBadge}>
                      <span className={styles.badgeIcon}>✓</span>
                      Verified
                    </span>
                  )}
                  <span className={styles.typeBadge}>
                    {venue.indoor && venue.outdoor ? "Indoor/Outdoor" : venue.indoor ? "Indoor" : "Outdoor"}
                  </span>
                </div>
              </div>
            </div>

            {/* Better aligned rating and location section */}
            <div className={styles.venueMetaRow}>
              <div className={styles.ratingSection}>
                {renderStars(overallRating, comments.length, loadingRating)}
              </div>
              <div className={styles.locationInfo}>
                <span className={styles.locationIcon}>📍</span>
                <span className={styles.address}>{venue.address}</span>
              </div>
            </div>

            {/* Improved section spacing and typography */}
            <div className={styles.contentSections}>
              {/* Description */}
              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>About this venue</h3>
                <p className={styles.description}>
                  {venue.description || "No description available for this venue."}
                </p>
              </div>

              {/* Sports Available */}
              <div className={styles.sportsSection}>
                <h3 className={styles.sectionTitle}>Sports Available</h3>
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
                  <h3 className={styles.sectionTitle}>Amenities</h3>
                  <div className={styles.amenitiesList}>
                    {venue.amenities.map((amenity, index) => (
                      <div key={index} className={styles.amenityItem}>
                        <span className={styles.amenityIcon}>✓</span>
                        <span className={styles.amenityText}>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className={styles.contactSection}>
                <h3 className={styles.sectionTitle}>Contact Information</h3>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.contactText}>{venue.ownerMail}</span>
                </div>
              </div>
            </div>

            {/* Improved comments section layout */}
            <div className={styles.commentsSection}>
              <div className={styles.commentsSectionHeader}>
                <h3 className={styles.sectionTitle}>Reviews & Comments</h3>
                {comments.length > 0 && (
                  <span className={styles.commentsCount}>
                    {comments.length} review{comments.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              {loadingComments ? (
                <div className={styles.commentsLoading}>
                  <div className={styles.spinner}></div>
                  <p>Loading reviews...</p>
                </div>
              ) : commentsError ? (
                <div className={styles.commentsError}>
                  <p>{commentsError}</p>
                </div>
              ) : comments.length > 0 ? (
                <div className={styles.commentsContainer}>
                  {comments.length > 3 && (
                    <div className={styles.scrollHint}>
                      <span>Scroll to see all reviews</span>
                    </div>
                  )}
                  <div className={styles.commentsList}>
                    {comments.map((comment) => (
                      <div key={comment.id} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                          <div className={styles.commentAuthor}>
                            <div className={styles.authorAvatar}>
                              {getInitials(comment.userEmail)}
                            </div>
                            <div className={styles.authorInfo}>
                              <span className={styles.authorEmail}>{comment.userEmail}</span>
                              <span className={styles.commentDate}>
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className={styles.commentRating}>
                            <div className={styles.stars}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={i < comment.rating ? styles.starFilled : styles.starEmpty}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className={styles.ratingValue}>({comment.rating})</span>
                          </div>
                        </div>
                        <div className={styles.commentContent}>
                          <p className={styles.commentText}>{comment.text}</p>
                          {sportsData[comment.sportId] && (
                            <span className={styles.commentSportTag}>
                              {sportsData[comment.sportId]}
                            </span>
                          )}
                        </div>
                        <div className={styles.commentActions}>
                          <button className={styles.voteButton}>
                            <span className={styles.voteIcon}>👍</span>
                            <span>{comment.upvotes}</span>
                          </button>
                          <button className={styles.voteButton}>
                            <span className={styles.voteIcon}>👎</span>
                            <span>{comment.downvotes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noComments}>
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              )}
            </div>

            {/* Better aligned action buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.bookNowBtn} onClick={handleBookNow}>
                <span className={styles.bookIcon}>🎯</span>
                <span>Book Now</span>
              </button>
              <button className={styles.shareBtn}>
                <span className={styles.shareIcon}>🔗</span>
                <span>Share</span>
              </button>
              <button className={styles.favoriteBtn}>
                <span className={styles.heartIcon}>🤍</span>
                <span>Add to Favorites</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
