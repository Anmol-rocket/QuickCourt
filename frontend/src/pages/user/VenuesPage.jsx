"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./VenuesPage.module.css"
import { LocationService } from "../../utils/locationService"
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

// API function to fetch sports for a venue
const fetchVenueSports = async (venueId) => {
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
      throw new Error('Failed to fetch sports for venue')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching sports for venue:', error)
    return []
  }
}

// API function to fetch user data by email
const fetchUserData = async (emailId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/data/${emailId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

// API function to fetch venues
const fetchVenues = async () => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/api/venues`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch venues')
    }
    const venues = await response.json()
    
    // Filter venues based on owner password and verification status
    const validVenues = []
    
    for (const venue of venues) {
      // Only process verified venues
      if (venue.verified !== true) {
        continue
      }
      
      // Check owner's password
      if (venue.ownerMail) {
        const userData = await fetchUserData(venue.ownerMail)
        // Skip venue if owner's password is "@@@@" or user data couldn't be fetched
        if (!userData || userData.password === "@@@@") {
          continue
        }
      }
      
      validVenues.push(venue)
    }
    
    // Transform API data to match our component structure and handle null ratings
    const venuesWithPricing = await Promise.all(validVenues.map(async venue => {
      // Handle image from photoUrls array
      let venueImage = "https://via.placeholder.com/320x200/48A6A7/ffffff?text=No+Image";
      if (venue.photoUrls && Array.isArray(venue.photoUrls) && venue.photoUrls.length > 0) {
        // Use the first available image URL
        venueImage = venue.photoUrls[0];
      }
      
      // Fetch sports for this venue to get pricing
      const sports = await fetchVenueSports(venue.id)
      let lowestPrice = null
      let sportsNames = []
      
      if (sports && sports.length > 0) {
        const prices = sports.map(sport => sport.pricePerHour).filter(price => price !== null && price !== undefined)
        if (prices.length > 0) {
          lowestPrice = Math.min(...prices)
        }
        sportsNames = sports.map(sport => sport.name)
      }
      
      return {
        id: venue.id,
        name: venue.name,
        image: venueImage,
        rating: venue.rating || 0, // Handle null rating
        ratingCount: Math.floor(Math.random() * 200) + 50, // Mock rating count since not in API
        location: venue.address ? venue.address.split(',')[0] : "Location not specified",
        city: extractCityFromAddress(venue.address),
        lowestPrice: lowestPrice, // Store the lowest price from sports
        indoor: Math.random() > 0.5, // Mock indoor/outdoor since not in API
        outdoor: Math.random() > 0.5,
        sports: sportsNames.length > 0 ? sportsNames : ["Basketball", "Tennis", "Volleyball", "Badminton"], // Use real sports or fallback
        description: venue.description,
        amenities: venue.amenities || [],
        verified: venue.verified || false,
        ownerMail: venue.ownerMail
      }
    }))
    
    return venuesWithPricing
  } catch (error) {
    console.error('Error fetching venues:', error)
    return mockVenues // Fallback to mock data if API fails
  }
}

// Helper function to extract city from address
const extractCityFromAddress = (address) => {
  if (!address) return "Unknown City"
  const parts = address.split(',')
  return parts.length >= 2 ? parts[parts.length - 2].trim() : "Unknown City"
}

// MOCK DATA
const mockVenues = [
  {
    id: 1,
    name: "Downtown Sports Complex",
    image: "https://i.pinimg.com/1200x/de/09/c5/de09c53b68d86a353a982c5ad300cf69.jpg",
    rating: 4.8,
    ratingCount: 124,
    location: "Sargasan",
    city: "Gandhinagar",
    lowestPrice: 25,
    indoor: true,
    outdoor: false,
    sports: ["Basketball", "Volleyball", "Badminton"],
  },
  {
    id: 2,
    name: "Riverside Tennis Club",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Tennis+Club",
    rating: 4.6,
    ratingCount: 89,
    location: "Riverside",
    city: "Delhi",
    lowestPrice: 30,
    indoor: false,
    outdoor: true,
    sports: ["Tennis"],
  },
  {
    id: 3,
    name: "City Basketball Courts",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Basketball",
    rating: 4.7,
    ratingCount: 156,
    location: "City Center",
    city: "Bangalore",
    lowestPrice: 20,
    indoor: false,
    outdoor: true,
    sports: ["Basketball"],
  },
  {
    id: 4,
    name: "Elite Fitness Arena",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Fitness+Arena",
    rating: 4.9,
    ratingCount: 203,
    location: "Uptown",
    city: "Mumbai",
    lowestPrice: 35,
    indoor: true,
    outdoor: false,
    sports: ["Basketball", "Volleyball", "Badminton", "Tennis"],
  },
  {
    id: 5,
    name: "Oceanview Soccer Fields",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Soccer+Fields",
    rating: 4.5,
    ratingCount: 78,
    location: "Oceanview",
    city: "Chennai",
    lowestPrice: 40,
    indoor: false,
    outdoor: true,
    sports: ["Soccer"],
  },
  {
    id: 6,
    name: "Metro Swimming Pool",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Swimming+Pool",
    rating: 4.3,
    ratingCount: 67,
    location: "Metro",
    city: "Delhi",
    lowestPrice: 28,
    indoor: true,
    outdoor: false,
    sports: ["Swimming"],
  },
  {
    id: 7,
    name: "Parkside Volleyball Courts",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Volleyball",
    rating: 4.4,
    ratingCount: 92,
    location: "Parkside",
    city: "Pune",
    lowestPrice: 22,
    indoor: false,
    outdoor: true,
    sports: ["Volleyball"],
  },
  {
    id: 8,
    name: "Central Badminton Hall",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Badminton",
    rating: 4.6,
    ratingCount: 134,
    location: "Central",
    city: "Hyderabad",
    lowestPrice: 18,
    indoor: true,
    outdoor: false,
    sports: ["Badminton"],
  },
  {
    id: 9,
    name: "Westside Multi-Sport Center",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Multi+Sport",
    rating: 4.7,
    ratingCount: 187,
    location: "Westside",
    city: "Mumbai",
    lowestPrice: 32,
    indoor: true,
    outdoor: true,
    sports: ["Basketball", "Tennis", "Volleyball"],
  },
  {
    id: 10,
    name: "Harbor Tennis Courts",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Harbor+Tennis",
    rating: 4.2,
    ratingCount: 56,
    location: "Harbor",
    city: "Kolkata",
    lowestPrice: 26,
    indoor: false,
    outdoor: true,
    sports: ["Tennis"],
  },
  {
    id: 11,
    name: "Northside Basketball Arena",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Basketball+Arena",
    rating: 4.8,
    ratingCount: 145,
    location: "Northside",
    city: "Bangalore",
    lowestPrice: 29,
    indoor: true,
    outdoor: false,
    sports: ["Basketball"],
  },
  {
    id: 12,
    name: "Southpark Soccer Complex",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Soccer+Complex",
    rating: 4.5,
    ratingCount: 98,
    location: "Southpark",
    city: "Chennai",
    lowestPrice: 38,
    indoor: false,
    outdoor: true,
    sports: ["Soccer"],
  },
  {
    id: 13,
    name: "Indoor Sports Hub",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Sports+Hub",
    rating: 4.6,
    ratingCount: 112,
    location: "Midtown",
    city: "Delhi",
    lowestPrice: 31,
    indoor: true,
    outdoor: false,
    sports: ["Basketball", "Volleyball", "Badminton"],
  },
  {
    id: 14,
    name: "Lakeside Recreation Center",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Recreation",
    rating: 4.4,
    ratingCount: 87,
    location: "Lakeside",
    city: "Pune",
    lowestPrice: 24,
    indoor: true,
    outdoor: true,
    sports: ["Swimming", "Tennis", "Basketball"],
  },
  {
    id: 15,
    name: "Mountain View Courts",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Mountain+View",
    rating: 4.7,
    ratingCount: 156,
    location: "Mountain View",
    city: "Gurgaon",
    lowestPrice: 27,
    indoor: false,
    outdoor: true,
    sports: ["Tennis", "Basketball"],
  },
  {
    id: 16,
    name: "Premier Fitness Complex",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Premier+Fitness",
    rating: 4.9,
    ratingCount: 234,
    location: "Premier District",
    city: "Mumbai",
    lowestPrice: 42,
    indoor: true,
    outdoor: false,
    sports: ["Basketball", "Volleyball", "Badminton", "Swimming"],
  },
  {
    id: 17,
    name: "Community Sports Park",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Community+Park",
    rating: 4.3,
    ratingCount: 76,
    location: "Community",
    city: "Noida",
    lowestPrice: 19,
    indoor: false,
    outdoor: true,
    sports: ["Soccer", "Basketball", "Volleyball"],
  },
  {
    id: 18,
    name: "Executive Sports Club",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Executive+Club",
    rating: 4.8,
    ratingCount: 167,
    location: "Executive",
    city: "Bangalore",
    lowestPrice: 45,
    indoor: true,
    outdoor: true,
    sports: ["Tennis", "Swimming", "Basketball"],
  },
  {
    id: 19,
    name: "Gujarat Sports Academy",
    image: "https://i.pinimg.com/1200x/58/fa/e2/58fae213ee11f837e3602d96950319c0.jpg",
    rating: 4.6,
    ratingCount: 89,
    location: "Sector 21",
    city: "Gujarat",
    lowestPrice: 28,
    indoor: true,
    outdoor: false,
    sports: ["Cricket", "Football", "Basketball"],
  },
  {
    id: 20,
    name: "Ahmedabad Tennis Courts",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Ahmedabad+Tennis",
    rating: 4.5,
    ratingCount: 134,
    location: "Ahmedabad",
    city: "Ahmedabad",
    lowestPrice: 35,
    indoor: false,
    outdoor: true,
    sports: ["Tennis"],
  },
]

export default function VenuesPage({
  initialPage = 1,
  pageSize = 9,
  onBookClick = (venueId) => console.log("Book venue:", venueId),
  onViewDetails = (venueId) => console.log("View details:", venueId),
  onPageChange = (page) => console.log("Page changed:", page),
  userName = "Guest",
}) {
  // Login state and navigation
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isVisible, setIsVisible] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [venues, setVenues] = useState([]) // Dynamic venues from API
  const [loading, setLoading] = useState(true) // Loading state

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [locationSearchTerm, setLocationSearchTerm] = useState("")
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [priceRange, setPriceRange] = useState([10, 1000])
  const [venueTypes, setVenueTypes] = useState({ indoor: false, outdoor: false })
  const [minRating, setMinRating] = useState(0)

  // Location states
  const [userCity, setUserCity] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [showMyCitySection, setShowMyCitySection] = useState(false)

  // Refs
  const contentRef = useRef(null)
  const filterToggleRef = useRef(null)
  const locationInputRef = useRef(null)

  // Fetch venues from API on mount
  useEffect(() => {
    const loadVenues = async () => {
      setLoading(true)
      try {
        const fetchedVenues = await fetchVenues()
        setVenues(fetchedVenues)
      } catch (error) {
        console.error('Failed to load venues:', error)
        // Fallback to mock data if API fails
        setVenues(mockVenues)
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  // Get unique sports and locations for filter dropdowns (now using dynamic venues)
  const allSports = ["All", ...new Set(venues.flatMap((venue) => venue.sports))]
  const allLocations = [...new Set(venues.map((venue) => venue.location))].sort()

  // Filter locations based on search term
  const filteredLocationSuggestions = allLocations.filter(location =>
    location.toLowerCase().includes(locationSearchTerm.toLowerCase())
  )

  // Smart location matching function
  const isVenueInUserLocation = (venue, userLocationData) => {
    if (!userLocationData) return false;
    
    // Normalize text for comparison
    const normalize = (text) => text?.toLowerCase().trim().replace(/[^\w\s]/g, '') || '';
    
    // Get all user location components
    const userLocationParts = [
      userLocationData.city,
      userLocationData.state,
      userLocationData.suburb,
      userLocationData.neighbourhood,
      userLocationData.district,
      userLocationData.region
    ].filter(Boolean).map(normalize);
    
    // Get venue location components
    const venueLocationParts = [
      venue.city,
      venue.location
    ].filter(Boolean).map(normalize);
    
    // Check for exact matches first
    for (const venuePart of venueLocationParts) {
      for (const userPart of userLocationParts) {
        // Exact match
        if (venuePart === userPart) return true;
        
        // Partial match (either contains the other)
        if (venuePart.includes(userPart) || userPart.includes(venuePart)) {
          // Ensure the match is meaningful (at least 3 characters)
          if (Math.min(venuePart.length, userPart.length) >= 3) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Get venues in user's city (enhanced matching)
  const myCityVenues = userCity ? venues.filter(venue => 
    isVenueInUserLocation(venue, userCity)
  ) : []

  // Debug function to test location matching (temporary)
  const testLocationMatching = () => {
    const testUserLocation = {
      city: "Gandhinagar",
      state: "Gujarat", 
      country: "India"
    };
    
    console.log("Testing location matching for:", testUserLocation);
    venues.forEach(venue => {
      const matches = isVenueInUserLocation(venue, testUserLocation);
      if (matches) {
        console.log(`✅ Match found: ${venue.name} (${venue.location}, ${venue.city})`);
      }
    });
  };

  // Filter venues based on current filters
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === "All" || venue.sports.includes(selectedSport)
    const matchesLocation = locationSearchTerm === "" || 
      venue.location.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
      venue.city.toLowerCase().includes(locationSearchTerm.toLowerCase())
    const matchesPrice = venue.lowestPrice !== null && venue.lowestPrice !== undefined 
      ? venue.lowestPrice >= priceRange[0] && venue.lowestPrice <= priceRange[1]
      : true // If no price available, include in results
    const matchesType =
      (!venueTypes.indoor && !venueTypes.outdoor) ||
      (venueTypes.indoor && venue.indoor) ||
      (venueTypes.outdoor && venue.outdoor)
    const matchesRating = venue.rating >= minRating

    return matchesSearch && matchesSport && matchesLocation && matchesPrice && matchesType && matchesRating
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredVenues.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentVenues = filteredVenues.slice(startIndex, endIndex)
  const showingStart = startIndex + 1
  const showingEnd = Math.min(endIndex, filteredVenues.length)

  // Smart pagination helper - shows first, last, neighbors, and ellipsis
  const getPageNumbers = (current, total, maxButtons = 7) => {
    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages = []
    const halfMax = Math.floor(maxButtons / 2)

    // Always show first page
    pages.push(1)

    const start = Math.max(2, current - halfMax + 1)
    const end = Math.min(total - 1, current + halfMax - 1)

    // Add ellipsis after first if needed
    if (start > 2) {
      pages.push("...")
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last if needed
    if (end < total - 1) {
      pages.push("...")
    }

    // Always show last page if more than 1 page
    if (total > 1) {
      pages.push(total)
    }

    return pages
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      onPageChange(page)
      // Smooth scroll to top of content
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Navigation handlers
  const handleLoginClick = () => navigate('/login');
  const handleProfileClick = () => navigate('/dashboard/profile');
  const handleDashboardClick = () => navigate('/dashboard');

  // Location access handlers
  const requestLocationAccess = async () => {
    setLocationLoading(true)
    setLocationError(null)
    
    try {
      const cityData = await LocationService.getUserCity()
      setUserCity(cityData)
      setShowMyCitySection(true)
      LocationService.saveUserCity(cityData)
    } catch (error) {
      setLocationError(error.message)
      console.error('Location access error:', error)
    } finally {
      setLocationLoading(false)
    }
  }

  const checkStoredLocation = () => {
    const storedCity = LocationService.getUserCityFromStorage()
    if (storedCity) {
      setUserCity(storedCity)
      setShowMyCitySection(true)
    }
  }

  // Location search handlers
  const handleLocationSearch = (value) => {
    setLocationSearchTerm(value)
    setShowLocationSuggestions(value.length > 0)
  }

  const handleLocationSelect = (location) => {
    setLocationSearchTerm(location)
    setShowLocationSuggestions(false)
  }

  const handleLocationInputFocus = () => {
    if (locationSearchTerm.length > 0) {
      setShowLocationSuggestions(true)
    }
  }

  const handleLocationInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowLocationSuggestions(false), 200)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSport("All")
    setSelectedLocation("All")
    setLocationSearchTerm("")
    setShowLocationSuggestions(false)
    setPriceRange([10, 1000])
    setVenueTypes({ indoor: false, outdoor: false })
    setMinRating(0)
    setCurrentPage(1)
  }

  // Handle mobile filter toggle
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen)
  }

  // Close mobile filters
  const closeMobileFilters = () => {
    setMobileFiltersOpen(false)
    filterToggleRef.current?.focus()
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
          {rating} ({count})
        </span>
      </div>
    )
  }

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Check for stored location on mount
  useEffect(() => {
    checkStoredLocation()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedSport, locationSearchTerm, priceRange, venueTypes, minRating])

  // Handle escape key for mobile filters
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && mobileFiltersOpen) {
        closeMobileFilters()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [mobileFiltersOpen])

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
            </button> / <span>Venues</span>
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

      <div className={styles.layout}>
        {/* Mobile Filter Toggle */}
        <button
          ref={filterToggleRef}
          className={styles.mobileFilterToggle}
          onClick={toggleMobileFilters}
          aria-label="Toggle filters"
        >
          🔍 Filters
        </button>

        {/* Filters Sidebar */}
        <aside className={`${styles.filters} ${mobileFiltersOpen ? styles.filtersOpen : ""}`}>
          <div className={styles.filtersHeader}>
            <h2>Filters</h2>
            <button className={styles.closeFilters} onClick={closeMobileFilters} aria-label="Close filters">
              ✕
            </button>
          </div>

          {/* Search */}
          <div className={styles.filterGroup}>
            <label htmlFor="search" className={styles.filterLabel}>
              Search
            </label>
            <input
              id="search"
              type="text"
              className={styles.filterInput}
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sport Type */}
          <div className={styles.filterGroup}>
            <label htmlFor="sport" className={styles.filterLabel}>
              Sport
            </label>
            <select
              id="sport"
              className={styles.filterInput}
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              {allSports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className={styles.filterGroup}>
            <label htmlFor="location" className={styles.filterLabel}>
              Location
            </label>
            <div className={styles.locationSearchContainer}>
              <input
                ref={locationInputRef}
                id="location"
                type="text"
                className={styles.filterInput}
                placeholder="Search by location..."
                value={locationSearchTerm}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={handleLocationInputFocus}
                onBlur={handleLocationInputBlur}
              />
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <div className={styles.locationSuggestions}>
                  {filteredLocationSuggestions.map((location) => (
                    <button
                      key={location}
                      className={styles.locationSuggestion}
                      onClick={() => handleLocationSelect(location)}
                      type="button"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className={styles.priceInputs}>
              <input
                type="range"
                min="10"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className={styles.rangeInput}
              />
              <input
                type="range"
                min="10"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className={styles.rangeInput}
              />
            </div>
          </div>

          {/* Venue Type */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Venue Type</span>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={venueTypes.indoor}
                onChange={(e) => setVenueTypes((prev) => ({ ...prev, indoor: e.target.checked }))}
              />
              Indoor
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={venueTypes.outdoor}
                onChange={(e) => setVenueTypes((prev) => ({ ...prev, outdoor: e.target.checked }))}
              />
              Outdoor
            </label>
          </div>

          {/* Rating */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Minimum Rating</span>
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setMinRating(rating)}
                />
                {rating}+ Stars
              </label>
            ))}
            <label className={styles.checkboxLabel}>
              <input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} />
              Any Rating
            </label>
          </div>

          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear Filters
          </button>
        </aside>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className={styles.overlayDrawer} onClick={closeMobileFilters} aria-modal="true" role="dialog" />
        )}

        {/* Main Content */}
        <main className={styles.content} ref={contentRef}>
          {/* Location Access Section */}
          {!userCity && (
            <div className={styles.locationPrompt}>
              <div className={styles.locationPromptContent}>
                <div className={styles.locationIcon}>📍</div>
                <h3>Find venues near you</h3>
                <p>Allow location access to see venues in your city and view your current location</p>
                <button 
                  className={styles.locationButton} 
                  onClick={requestLocationAccess}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Getting your location...' : 'Allow Location Access'}
                </button>
                {locationError && (
                  <p className={styles.locationError}>
                    {locationError}. You can still browse all venues below.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* My City Section */}
          {showMyCitySection && userCity && myCityVenues.length > 0 && (
            <div className={styles.myCitySection}>
              <div className={styles.myCityHeader}>
                <div className={styles.headerGradient}>
                  <div className={styles.headerContent}>
                    <div className={styles.titleRow}>
                      <h2 className={styles.sectionTitle}>
                        <span className={styles.titleIcon}>🏟️</span>
                        Venues near your location
                      </h2>
                      <div className={styles.venueCounter}>
                        <span className={styles.counterNumber}>{myCityVenues.length}</span>
                        <span className={styles.counterText}>venues</span>
                      </div>
                    </div>
                    <div className={styles.locationInfo}>
                      <div className={styles.currentLocation}>
                        <div className={styles.locationBadge}>
                          <span className={styles.locationIcon}>📍</span>
                          <div className={styles.locationDetails}>
                            <span className={styles.locationText}>
                              {userCity.city}, {userCity.state}
                            </span>
                            <span className={styles.locationSubtext}>{userCity.country}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.myCityGrid}>
                {myCityVenues.slice(0, 6).map((venue, index) => (
                  <div 
                    key={venue.id} 
                    className={styles.myCityCard} 
                    style={{ animationDelay: `${index * 0.1}s` }}
                    tabIndex="0"
                    onClick={() => navigate(`/venue/${venue.id}`)}
                  >
                    <div className={styles.cardImageContainer}>
                      <img src={venue.image || "/placeholder.svg"} alt={venue.name} className={styles.myCityImage} />
                      
                      {/* Enhanced Rating Badge */}
                      <div className={styles.ratingBadge}>
                        <span className={styles.starIcon}>⭐</span>
                        <span className={styles.ratingValue}>{venue.rating}</span>
                        <span className={styles.ratingCount}>({venue.ratingCount})</span>
                      </div>
                      
                      {/* Enhanced Price Badge */}
                      <div className={styles.priceBadge}>
                        <span className={styles.priceValue}>
                          {venue.lowestPrice !== null && venue.lowestPrice !== undefined 
                            ? `₹${venue.lowestPrice}`
                            : 'Price on request'
                          }
                        </span>
                        <span className={styles.priceUnit}>/hr</span>
                      </div>
                      
                      {/* Availability Indicator */}
                      <div className={styles.availabilityBadge}>
                        <div className={styles.availabilityDot}></div>
                        <span className={styles.availabilityText}>Available</span>
                      </div>
                      
                      {/* Facility Type Badge */}
                      <div className={styles.facilityTypeBadge}>
                        {venue.indoor && venue.outdoor ? (
                          <>🏢🌞 Indoor/Outdoor</>
                        ) : venue.indoor ? (
                          <>🏢 Indoor</>
                        ) : (
                          <>🌞 Outdoor</>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.myCityMeta}>
                      <div className={styles.cardHeader}>
                        <h4 className={styles.myCityTitle}>{venue.name}</h4>
                        <button 
                          className={styles.favoriteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to favorites logic
                          }}
                          aria-label="Add to favorites"
                        >
                          <span className={styles.heartIcon}>🤍</span>
                        </button>
                      </div>
                      
                      <div className={styles.venueLocation}>
                        <span className={styles.locationDot}>📍</span>
                        <span className={styles.locationName}>{venue.location}, {venue.city}</span>
                        <span className={styles.distanceTag}>1.2 km away</span>
                      </div>
                      
                      {/* Enhanced Sports Tags */}
                      <div className={styles.myCityTags}>
                        <span className={styles.locationMatchTag}>
                          <span className={styles.nearIcon}>📍</span>
                          Near you
                        </span>
                        <div className={styles.sportsContainer}>
                          {venue.sports.slice(0, 2).map((sport) => (
                            <span key={sport} className={styles.sportTag}>
                              {sport}
                            </span>
                          ))}
                          {venue.sports.length > 2 && (
                            <span className={styles.moreSportsTag}>
                              +{venue.sports.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className={styles.quickStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}>⏰</span>
                          <span className={styles.statText}>Open Now</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}>🚗</span>
                          <span className={styles.statText}>Parking</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statIcon}>📶</span>
                          <span className={styles.statText}>WiFi</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className={styles.cardActions}>
                        <button 
                          className={styles.quickBookBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book/${venue.id}`);
                          }}
                        >
                          <span className={styles.bookIcon}>🎯</span>
                          Quick Book
                        </button>
                        <button 
                          className={styles.viewDetailsBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/venue/${venue.id}`);
                          }}
                        >
                          <span className={styles.detailsIcon}>👁️</span>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {myCityVenues.length > 6 && (
                <button 
                  className={styles.viewAllCityButton}
                  onClick={() => setLocationSearchTerm(userCity.city)}
                >
                  View all {myCityVenues.length} venues in {userCity.city}
                </button>
              )}
            </div>
          )}

          {/* Location Info when no venues in user's city */}
          {userCity && myCityVenues.length === 0 && (
            <div className={styles.locationInfoSection}>
              <div className={styles.locationInfoHeader}>
                <div className={styles.currentLocation}>
                  <span className={styles.locationIcon}>📍</span>
                  <span className={styles.locationText}>
                    Your location: {userCity.city}, {userCity.state}, {userCity.country}
                  </span>
                </div>
                <p className={styles.noVenuesMessage}>
                  No venues found in {userCity.city}. Browse all available venues below.
                </p>
              </div>
            </div>
          )}

          <div className={styles.contentHeader}>
            <h1>Find Your Perfect Venue</h1>
            <p>
              Showing {showingStart}–{showingEnd} of {filteredVenues.length} venues
            </p>
            {/* Temporary test button */}
            
          </div>

          {/* Venues Grid */}
          <div className={styles.venuesGrid}>
            {currentVenues.map((venue) => (
              <div key={venue.id} className={styles.venueCard} tabIndex="0">
                <img src={venue.image || "/placeholder.svg"} alt={venue.name} className={styles.venueImage} />
                <div className={styles.venueMeta}>
                  <h3 className={styles.venueTitle}>{venue.name}</h3>
                  {renderStars(venue.rating, venue.ratingCount)}
                  <p className={styles.location}>📍 {venue.location}</p>
                  <div className={styles.venueTags}>
                    {venue.indoor && <span className={styles.tag}>Indoor</span>}
                    {venue.outdoor && <span className={styles.tag}>Outdoor</span>}
                    {venue.sports.slice(0, 2).map((sport) => (
                      <span key={sport} className={styles.sportTag}>
                        {sport}
                      </span>
                    ))}
                  </div>
                  <div className={styles.price}>
                    {venue.lowestPrice !== null && venue.lowestPrice !== undefined 
                      ? `Price starts from ₹${venue.lowestPrice}/hr`
                      : 'Price on request'
                    }
                  </div>
                  <div className={styles.ctaRow}>
                    <button className={styles.detailsBtn} onClick={() => navigate(`/venue/${venue.id}`)}>
                      View Details
                    </button>
                    <button className={styles.bookBtn} onClick={() => navigate(`/book/${venue.id}`)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className={styles.pagination} role="navigation" aria-label="Pagination">
              <button
                className={styles.pagerBtn}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                ← Prev
              </button>

              {getPageNumbers(currentPage, totalPages).map((page, index) => (
                <button
                  key={index}
                  className={`${styles.pagerBtn} ${
                    page === currentPage ? styles.pagerActive : ""
                  } ${page === "..." ? styles.pagerEllipsis : ""}`}
                  onClick={() => typeof page === "number" && handlePageChange(page)}
                  disabled={page === "..."}
                  aria-current={page === currentPage ? "page" : undefined}
                  aria-label={typeof page === "number" ? `Page ${page}` : "More pages"}
                >
                  {page}
                </button>
              ))}

              <button
                className={styles.pagerBtn}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  )
}
