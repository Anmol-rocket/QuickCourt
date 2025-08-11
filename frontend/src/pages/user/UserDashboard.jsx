"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./UserDashboard.module.css"
import { LocationService } from "../../utils/locationService"

// Generate initials from name
const getInitials = (name) => {
  if (!name || name === "Guest") return "👤"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

// MOCK DATA
const mockVenues = [
  {
    id: 1,
    name: "Downtown Sports Complex",
    image: "https://i.pinimg.com/1200x/de/09/c5/de09c53b68d86a353a982c5ad300cf69.jpg",
    rating: 4.8,
    location: "Downtown",
    city: "Mumbai",
    pricePerHour: 25,
  },
  {
    id: 2,
    name: "Riverside Tennis Club",
    image: "https://i.pinimg.com/1200x/ff/cb/56/ffcb56f8a6351710d04835bfb121b20a.jpg",
    rating: 4.6,
    location: "Riverside",
    city: "Delhi",
    pricePerHour: 30,
  },
  {
    id: 3,
    name: "City Basketball Courts",
    image: "https://i.pinimg.com/736x/84/f5/bb/84f5bb37b480100f785362a9198c4774.jpg",
    rating: 4.7,
    location: "City Center",
    city: "Bangalore",
    pricePerHour: 20,
  },
  {
    id: 4,
    name: "Elite Fitness Arena",
    image: "https://i.pinimg.com/736x/ef/e0/e5/efe0e544a223421bb8675e7a8127bcf6.jpg",
    rating: 4.9,
    location: "Uptown",
    city: "Mumbai",
    pricePerHour: 35,
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
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVenues, setFilteredVenues] = useState(mockVenues)
  const [userCity, setUserCity] = useState(null)

  // Entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
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
      setFilteredVenues(mockVenues)
    } else {
      const filtered = mockVenues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredVenues(filtered)
    }
    // Reset carousel index when search results change
    setCarouselIndex(0)
  }, [searchQuery])

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
  const handleGetStarted = () => navigate('/login');
  const handleProfileClick = () => navigate('/profile');

  const handleBookClick = (venueId) => {
    if (isLoggedIn) {
      navigate('/booking', { state: { venueId } });
    } else {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 2000);
    }
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
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#venues">Venues</a>
            </li>
            <li>
              <a href="#sports">Sports</a>
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
          {isLoggedIn ? (
            <button className={styles.loginButton} onClick={handleProfileClick} aria-label="Profile">
              <div className={styles.avatarInitials}>
                {getInitials(userName)}
              </div>
            </button>
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick} aria-label="Login or sign up">
              {userName === "Guest" ? "Login" : userName}
            </button>
          )}
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
            <button className={styles.ctaButton} onClick={handleGetStarted}>Get Started</button>
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
            <Link to="/venues" className={styles.seeAll}>
              See All Venues →
            </Link>
          </div>

          {filteredVenues.length === 0 ? (
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
                        <span>{venue.rating}</span>
                      </div>
                      <p className={styles.location}>📍 {venue.location}</p>
                      <div className={styles.venueFooter}>
                        <span className={styles.price}>₹{venue.pricePerHour}/hr</span>
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

        {/* Popular Sports Section */}
        <section className={styles.sportsSection}>
          <h2>Popular Sports</h2>
          <div className={styles.sportsGrid} role="list">
            {mockSports.map((sport) => (
              <div key={sport.id} className={styles.sportCard} role="listitem">
                <img src={sport.image || "/placeholder.svg"} alt={sport.name} />
                <span>{sport.name}</span>
              </div>
            ))}
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
                <a href="#venues">Find Venues</a>
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

      {/* Toast notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ff4757',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          ⚠️ Please login to book a venue
        </div>
      )}
    </div>
  )
}
