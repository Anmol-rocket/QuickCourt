"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./UserDashboard.module.css"
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
      
      if (sports && sports.length > 0) {
        const prices = sports.map(sport => sport.pricePerHour).filter(price => price !== null && price !== undefined)
        if (prices.length > 0) {
          lowestPrice = Math.min(...prices)
        }
      }
      
      return {
        id: venue.id,
        name: venue.name,
        image: venueImage,
        rating: venue.rating || 0, // Handle null rating
        location: venue.address || "Location not specified",
        city: extractCityFromAddress(venue.address),
        lowestPrice: lowestPrice, // Store the lowest price from sports
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

// MOCK DATA (fallback)
const mockVenues = [
  {
    id: 1,
    name: "Downtown Sports Complex",
    image: "https://i.pinimg.com/1200x/de/09/c5/de09c53b68d86a353a982c5ad300cf69.jpg",
    rating: 4.8,
    location: "Downtown",
    city: "Mumbai",
    lowestPrice: 25,
    verified: true,
  },
  {
    id: 2,
    name: "Riverside Tennis Club",
    image: "https://i.pinimg.com/1200x/ff/cb/56/ffcb56f8a6351710d04835bfb121b20a.jpg",
    rating: 4.6,
    location: "Riverside",
    city: "Delhi",
    lowestPrice: 30,
    verified: true,
  },
  {
    id: 3,
    name: "City Basketball Courts",
    image: "https://i.pinimg.com/736x/84/f5/bb/84f5bb37b480100f785362a9198c4774.jpg",
    rating: 4.7,
    location: "City Center",
    city: "Bangalore",
    lowestPrice: 20,
    verified: true,
  },
  {
    id: 4,
    name: "Elite Fitness Arena",
    image: "https://i.pinimg.com/736x/ef/e0/e5/efe0e544a223421bb8675e7a8127bcf6.jpg",
    rating: 4.9,
    location: "Uptown",
    city: "Mumbai",
    lowestPrice: 35,
    verified: true,
  },
]

const mockSports = [
  { id: 1, name: "Basketball", image: "https://i.pinimg.com/736x/90/4a/1a/904a1aa35e7996f73575caf90c98afb1.jpg" },
  { id: 2, name: "Tennis", image: "https://i.pinimg.com/736x/c9/1f/79/c91f79b5431e5154409df92d7448e824.jpg" },
  { id: 3, name: "Soccer", image: "https://i.pinimg.com/736x/c5/f7/fe/c5f7fe2c646a5f0dc466678c2d318076.jpg" },
  { id: 4, name: "Volleyball", image: "https://i.pinimg.com/736x/52/12/76/5212767f8fd7ec3d4aa5fb54d47cb86b.jpg" },
  { id: 5, name: "Badminton", image: "https://i.pinimg.com/736x/2e/8b/3d/2e8b3d634b9cd14891bfbb00d0c4e7b5.jpg" },
  { id: 6, name: "Swimming", image: "https://i.pinimg.com/1200x/71/c1/c8/71c1c82b6bd2ebcd998df85745093323.jpg" },
]

export default function UserDashboard({
  userName = "Guest",
  onBookClick = (venueId) => console.log("Book venue:", venueId),
}) {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [venues, setVenues] = useState([]) // Changed from mockVenues to dynamic venues
  const [filteredVenues, setFilteredVenues] = useState([])
  const [userCity, setUserCity] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state

  // Entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch venues from API on mount
  useEffect(() => {
    const loadVenues = async () => {
      setLoading(true)
      try {
        const fetchedVenues = await fetchVenues()
        setVenues(fetchedVenues)
        setFilteredVenues(fetchedVenues)
      } catch (error) {
        console.error('Failed to load venues:', error)
        // Fallback to mock data if API fails
        setVenues(mockVenues)
        setFilteredVenues(mockVenues)
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  // Check for stored location on mount
  useEffect(() => {
    const storedCity = LocationService.getUserCityFromStorage()
    if (storedCity) {
      setUserCity(storedCity)
    }
  }, [])

  // Filter venues based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVenues(venues)
    } else {
      const filtered = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredVenues(filtered)
    }
    // Reset carousel index when search results change
    setCarouselIndex(0)
  }, [searchQuery, venues]) // Added venues as dependency

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Search is already handled by the useEffect above
    // This function can be used for additional search actions if needed
  }

  // Carousel navigation handlers
  const handlePrevVenue = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : filteredVenues.length - 1))
  }

  const handleNextVenue = () => {
    setCarouselIndex((prev) => (prev < filteredVenues.length - 1 ? prev + 1 : 0))
  }

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ))
  }

  const handleLoginClick = () => navigate('/login');
  const handleProfileClick = () => navigate('/dashboard/profile');

  const handleBookClick = (venueId) => {
    // Navigate to the dedicated booking page with venue ID
    navigate(`/book/${venueId}`);
  };

  return (
    <div className={`${styles.dashboard} ${isVisible ? styles.fadeIn : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>QuickCourt</h1>
        </div>

        <nav className={styles.nav} role="navigation">
          <ul>
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/dashboard/venues">Venues</Link>
            </li>
            <li>
              <Link to="/dashboard/tournaments">Tournaments</Link>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>

        <div className={styles.headerRight}>
          <form className={styles.search} onSubmit={handleSearchSubmit}>
            <input 
              type="search" 
              placeholder="Search venues..." 
              aria-label="Search venues"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" aria-label="Search">🔍</button>
          </form>
          <button className={styles.loginButton} onClick={handleProfileClick} aria-label="Profile">
            <div className={styles.avatarInitials}>
              {getInitials(userName)}
            </div>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1>FIND PLAYERS & VENUES NEARBY</h1>
            <p>
              Discover and book the best sports venues in your area. Connect with players and enjoy your favorite
              sports.
            </p>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <img
                src="https://imgs.search.brave.com/AbEC_E3XoMWIpjZ6QE7wVHpI5EtLXrGxxYOogB_KKpk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y291cnRzb2Z0aGV3/b3JsZC5jb20vdXBs/b2FkL2NvdXJ0cy82/ODI5OC8xL0NPVFct/dGhlLXVuZGVybGlu/ZS0xNzMwMjM2NzQz/LmpwZw"
                alt="Featured sports venue"
              />
            </div>
          </div>
        </section>

        {/* Book Venues Section */}
        <section className={styles.venuesSection}>
          <div className={styles.sectionHeader}>
            <h2>
              {searchQuery ? `Search Results for "${searchQuery}"` : "Book Venues"}
            </h2>
            <Link to="/dashboard/venues" className={styles.seeAll}>
              See All Venues →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading venues...</p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className={styles.noResults}>
              <p>No venues found matching your search. Try different keywords.</p>
            </div>
          ) : (
            <div className={styles.venueCarousel} role="region" aria-label="Venue carousel">
              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={handlePrevVenue}
                aria-label="Previous venues"
                disabled={filteredVenues.length <= 1}
              >
                ←
              </button>

              <div className={styles.venueGrid}>
                {filteredVenues.map((venue, index) => (
                  <div
                    key={venue.id}
                    className={styles.venueCard}
                    style={{
                      transform: `translateX(-${carouselIndex * 100}%)`,
                    }}
                  >
                    <img src={venue.image || "/placeholder.svg"} alt={venue.name} className={styles.venueImage} />
                    <div className={styles.venueMeta}>
                      <h3>{venue.name}</h3>
                      <div className={styles.rating}>
                        {renderStars(venue.rating)}
                        <span>{venue.rating > 0 ? venue.rating : "No rating"}</span>
                      </div>
                      <p className={styles.location}>📍 {venue.location}</p>
                      {venue.verified && (
                        <div className={styles.verifiedBadge}>
                          ✅ Verified
                        </div>
                      )}
                      <div className={styles.venueFooter}>
                        <span className={styles.price}>
                          {venue.lowestPrice !== null && venue.lowestPrice !== undefined 
                            ? `Price starts from ₹${venue.lowestPrice}/hr`
                            : 'Price on request'
                          }
                        </span>
                        <button className={styles.bookButton} onClick={() => handleBookClick(venue.id)}>
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={handleNextVenue}
                aria-label="Next venues"
                disabled={filteredVenues.length <= 1}
              >
                →
              </button>
            </div>
          )}
        </section>

        {/* Popular Tournaments Section */}
        <section className={styles.sportsSection}>
          <h2>Join Tournaments</h2>
          <div className={styles.sportsGrid} role="list">
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/736x/90/4a/1a/904a1aa35e7996f73575caf90c98afb1.jpg" alt="Basketball Tournaments" />
              <span>Basketball Tournaments</span>
            </div>
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/736x/c9/1f/79/c91f79b5431e5154409df92d7448e824.jpg" alt="Tennis Tournaments" />
              <span>Tennis Tournaments</span>
            </div>
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/736x/c5/f7/fe/c5f7fe2c646a5f0dc466678c2d318076.jpg" alt="Soccer Tournaments" />
              <span>Soccer Tournaments</span>
            </div>
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/736x/52/12/76/5212767f8fd7ec3d4aa5fb54d47cb86b.jpg" alt="Volleyball Tournaments" />
              <span>Volleyball Tournaments</span>
            </div>
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/736x/2e/8b/3d/2e8b3d634b9cd14891bfbb00d0c4e7b5.jpg" alt="Badminton Tournaments" />
              <span>Badminton Tournaments</span>
            </div>
            <div className={styles.sportCard} role="listitem" onClick={() => navigate('/dashboard/tournaments')}>
              <img src="https://i.pinimg.com/1200x/71/c1/c8/71c1c82b6bd2ebcd998df85745093323.jpg" alt="Swimming Competitions" />
              <span>Swimming Competitions</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>QuickCourt</h3>
            <p>Your premier destination for sports venue booking.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/dashboard/venues">Find Venues</Link>
              </li>
              <li>
                <a href="#sports">Browse Sports</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>support@quickcourt.com</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 QuickCourt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
