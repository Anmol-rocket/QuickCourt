"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./UserDashboard.module.css"

// MOCK DATA
const mockVenues = [
  {
    id: 1,
    name: "Downtown Sports Complex",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Sports+Complex",
    rating: 4.8,
    location: "Downtown",
    pricePerHour: 25,
  },
  {
    id: 2,
    name: "Riverside Tennis Club",
    image: "https://via.placeholder.com/320x200/2973B2/ffffff?text=Tennis+Club",
    rating: 4.6,
    location: "Riverside",
    pricePerHour: 30,
  },
  {
    id: 3,
    name: "City Basketball Courts",
    image: "https://via.placeholder.com/320x200/9ACBD0/ffffff?text=Basketball",
    rating: 4.7,
    location: "City Center",
    pricePerHour: 20,
  },
  {
    id: 4,
    name: "Elite Fitness Arena",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Fitness+Arena",
    rating: 4.9,
    location: "Uptown",
    pricePerHour: 35,
  },
]

const mockSports = [
  { id: 1, name: "Basketball", image: "https://via.placeholder.com/80x80/2973B2/ffffff?text=🏀" },
  { id: 2, name: "Tennis", image: "https://via.placeholder.com/80x80/48A6A7/ffffff?text=🎾" },
  { id: 3, name: "Soccer", image: "https://via.placeholder.com/80x80/9ACBD0/ffffff?text=⚽" },
  { id: 4, name: "Volleyball", image: "https://via.placeholder.com/80x80/2973B2/ffffff?text=🏐" },
  { id: 5, name: "Badminton", image: "https://via.placeholder.com/80x80/48A6A7/ffffff?text=🏸" },
  { id: 6, name: "Swimming", image: "https://via.placeholder.com/80x80/9ACBD0/ffffff?text=🏊" },
]

export default function UserDashboard({
  userName = "Guest",
  onLoginClick = () => {},
  onBookClick = (venueId) => console.log("Book venue:", venueId),
}) {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Carousel navigation handlers
  const handlePrevVenue = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : mockVenues.length - 1))
  }

  const handleNextVenue = () => {
    setCarouselIndex((prev) => (prev < mockVenues.length - 1 ? prev + 1 : 0))
  }

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ))
  }

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
          <div className={styles.search}>
            <input type="search" placeholder="Search venues..." aria-label="Search venues" />
            <button aria-label="Search">🔍</button>
          </div>
          <button className={styles.loginButton} onClick={onLoginClick} aria-label="Login or sign up">
            {userName === "Guest" ? "Login" : userName}
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
            <button className={styles.ctaButton}>Get Started</button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <img
                src="https://via.placeholder.com/300x200/9ACBD0/ffffff?text=Sports+Venue"
                alt="Featured sports venue"
              />
            </div>
          </div>
        </section>

        {/* Book Venues Section */}
        <section className={styles.venuesSection}>
          <div className={styles.sectionHeader}>
            <h2>Book Venues</h2>
            <Link to="/venues" className={styles.seeAll}>
              See All Venues →
            </Link>
          </div>

          <div className={styles.venueCarousel} role="region" aria-label="Venue carousel">
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={handlePrevVenue}
              aria-label="Previous venues"
            >
              ←
            </button>

            <div className={styles.venueGrid}>
              {mockVenues.map((venue, index) => (
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
                      <button className={styles.bookButton} onClick={() => onBookClick(venue.id)}>
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
            >
              →
            </button>
          </div>
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
    </div>
  )
}
