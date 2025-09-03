"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./LandingPage.module.css"

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const heroSlides = [
    {
      title: "Book Your Perfect Court",
      subtitle: "Find and reserve local sports facilities instantly",
      image: "https://i.pinimg.com/736x/c9/1f/79/c91f79b5431e5154409df92d7448e824.jpg",
    },
    {
      title: "Join Local Matches",
      subtitle: "Connect with players in your area and join exciting games",
      image: "https://i.pinimg.com/736x/00/24/91/00249155a6543bb4c36ce49298a6c933.jpg",
    },
    {
      title: "Manage Your Venue",
      subtitle: "List your sports facility and grow your business",
      image: "https://i.pinimg.com/1200x/b8/de/fa/b8defaeb09ab897466376db1e34e84c8.jpg",
    },
  ]

  const popularVenues = [
    {
      id: 1,
      name: "Sunshine Sports Complex",
      location: "Downtown",
      rating: 4.8,
      price: "₹500/hour",
      sports: ["Badminton", "Tennis"],
      image: "https://i.pinimg.com/1200x/db/00/62/db00621311cab0ed5201fa76d7244d2b.jpg",
    },
    {
      id: 2,
      name: "Elite Fitness Arena",
      location: "City Center",
      rating: 4.6,
      price: "₹400/hour",
      sports: ["Basketball", "Volleyball"],
      image: "https://i.pinimg.com/736x/d3/b2/7f/d3b27fa12610035fe77bfb218e062d14.jpg",
    },
    {
      id: 3,
      name: "Champions Turf Ground",
      location: "Sports District",
      rating: 4.9,
      price: "₹800/hour",
      sports: ["Football", "Cricket"],
      image: "https://i.pinimg.com/736x/45/20/dd/4520ddbfed24e05f3627b14c662a5594.jpg",
    },
  ]

  const popularSports = [
    { name: "Badminton", icon: "🏸", venues: 45 },
    { name: "Tennis", icon: "🎾", venues: 32 },
    { name: "Football", icon: "⚽", venues: 28 },
    { name: "Basketball", icon: "🏀", venues: 25 },
    { name: "Cricket", icon: "🏏", venues: 22 },
    { name: "Volleyball", icon: "🏐", venues: 18 },
  ]

  const features = [
    {
      icon: "🔍",
      title: "Easy Search & Discovery",
      description: "Find the perfect sports venue near you with advanced filters and real-time availability.",
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Book your favorite court in seconds with our streamlined booking process.",
    },
    {
      icon: "👥",
      title: "Community Matching",
      description: "Connect with local players and join matches that match your skill level.",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      description: "See upfront pricing with no hidden fees. Pay securely online or at the venue.",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className={styles.starFilled}>
          ★
        </span>,
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className={styles.starHalf}>
          ★
        </span>,
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={styles.starEmpty}>
          ★
        </span>,
      )
    }

    return stars
  }

  // Navigation handlers
  const handleLogin = () => navigate('/login')
  const handleSignup = (e) => {
    e.preventDefault()
    console.log('Navigating to register...')
    navigate('/register')
  }
  const handleBookNow = () => navigate('/login') // Need to login first
  const handleExploreVenues = () => navigate('/login') // Redirect to login page
  const handleViewAllVenues = () => navigate('/login') // Redirect to login page
  const handleGetStarted = (e) => {
    e.preventDefault()
    console.log('Navigating to register...')
    navigate('/register')
  }
  const handleLearnMore = () => navigate('/login') // Redirect to login page
  const handleAdminLogin = () => navigate('/admin/login') // Admin login

  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>QuickCourt</h1>
          </div>
          <nav className={styles.nav}>
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
          <div className={styles.headerActions}>
            <button type="button" className={styles.loginButton} onClick={handleLogin}>Login</button>
            <button type="button" className={styles.signupButton} onClick={handleSignup}>Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero} id="home">
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>{heroSlides[currentSlide].title}</h1>
              <p className={styles.heroSubtitle}>{heroSlides[currentSlide].subtitle}</p>
              <div className={styles.heroActions}>
                <button type="button" className={styles.ctaPrimary} onClick={handleBookNow}>Book Now</button>
                <button type="button" className={styles.ctaSecondary} onClick={handleExploreVenues}>Explore Venues</button>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>500+</span>
                  <span className={styles.statLabel}>Venues</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>10K+</span>
                  <span className={styles.statLabel}>Happy Users</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>50K+</span>
                  <span className={styles.statLabel}>Bookings</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCarousel}>
              <img
                src={heroSlides[currentSlide].image || "/placeholder.svg"}
                alt={heroSlides[currentSlide].title}
                className={styles.heroImage}
              />
              <button className={styles.carouselButton} onClick={prevSlide}>
                ‹
              </button>
              <button className={`${styles.carouselButton} ${styles.carouselNext}`} onClick={nextSlide}>
                ›
              </button>
              <div className={styles.carouselDots}>
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ""}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose QuickCourt?</h2>
            <p>Experience the future of sports facility booking</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={`${styles.featureCard} ${styles.fadeIn}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues Section */}
      <section className={styles.popularVenues} id="venues">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Popular Venues</h2>
            <p>Discover top-rated sports facilities in your area</p>
          </div>
          <div className={styles.venuesGrid}>
            {popularVenues.map((venue) => (
              <div key={venue.id} className={`${styles.venueCard} ${styles.fadeIn}`}>
                <div className={styles.venueImageContainer}>
                  <img src={venue.image || "/placeholder.svg"} alt={venue.name} className={styles.venueImage} />
                  <div className={styles.venueOverlay}>
                    <button className={styles.bookNowButton} onClick={handleBookNow}>Book Now</button>
                  </div>
                </div>
                <div className={styles.venueContent}>
                  <h3 className={styles.venueName}>{venue.name}</h3>
                  <div className={styles.venueLocation}>📍 {venue.location}</div>
                  <div className={styles.venueRating}>
                    <div className={styles.stars}>{renderStars(venue.rating)}</div>
                    <span className={styles.ratingText}>{venue.rating}</span>
                  </div>
                  <div className={styles.venueSports}>
                    {venue.sports.map((sport, index) => (
                      <span key={index} className={styles.sportTag}>
                        {sport}
                      </span>
                    ))}
                  </div>
                  <div className={styles.venuePrice}>{venue.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.sectionFooter}>
            <button className={styles.viewAllButton} onClick={handleViewAllVenues}>View All Venues</button>
          </div>
        </div>
      </section>

      {/* Popular Sports Section */}
      <section className={styles.popularSports} id="sports">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Popular Sports</h2>
            <p>Find venues for your favorite sports</p>
          </div>
          <div className={styles.sportsGrid}>
            {popularSports.map((sport, index) => (
              <div key={index} className={`${styles.sportCard} ${styles.fadeIn}`}>
                <div className={styles.sportIcon}>{sport.icon}</div>
                <h3 className={styles.sportName}>{sport.name}</h3>
                <p className={styles.sportVenues}>{sport.venues} venues</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Get started in just 3 simple steps</p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Search & Discover</h3>
              <p className={styles.stepDescription}>
                Browse through hundreds of sports venues and find the perfect match for your needs.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Book Instantly</h3>
              <p className={styles.stepDescription}>
                Select your preferred time slot and book instantly with our secure payment system.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Play & Enjoy</h3>
              <p className={styles.stepDescription}>
                Show up and enjoy your game! Rate your experience and help others discover great venues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Book Your Next Game?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of sports enthusiasts who trust QuickCourt for their booking needs
            </p>
            <div className={styles.ctaActions}>
              <button type="button" className={styles.ctaPrimary} onClick={handleGetStarted}>Get Started</button>
              <button type="button" className={styles.ctaSecondary} onClick={handleLearnMore}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>QuickCourt</h3>
              <p>Your trusted partner for sports facility booking. Making sports accessible to everyone.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
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
            </div>
            <div className={styles.footerSection}>
              <h4>For Business</h4>
              <ul>
                <li>
                  <a href="#list-venue">List Your Venue</a>
                </li>
                <li>
                  <a href="#partner">Partner With Us</a>
                </li>
                <li>
                  <a href="#analytics">Analytics</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#admin" onClick={handleAdminLogin} style={{cursor: 'pointer', color: '#666'}}>Admin Portal</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
