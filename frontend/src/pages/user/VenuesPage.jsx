"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./VenuesPage.module.css"

// MOCK DATA
const mockVenues = [
  {
    id: 1,
    name: "Downtown Sports Complex",
    image: "https://via.placeholder.com/320x200/48A6A7/ffffff?text=Sports+Complex",
    rating: 4.8,
    ratingCount: 124,
    location: "Downtown",
    pricePerHour: 25,
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
    pricePerHour: 30,
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
    pricePerHour: 20,
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
    pricePerHour: 35,
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
    pricePerHour: 40,
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
    pricePerHour: 28,
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
    pricePerHour: 22,
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
    pricePerHour: 18,
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
    pricePerHour: 32,
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
    pricePerHour: 26,
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
    pricePerHour: 29,
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
    pricePerHour: 38,
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
    pricePerHour: 31,
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
    pricePerHour: 24,
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
    pricePerHour: 27,
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
    pricePerHour: 42,
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
    pricePerHour: 19,
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
    pricePerHour: 45,
    indoor: true,
    outdoor: true,
    sports: ["Tennis", "Swimming", "Basketball"],
  },
]

export default function VenuesPage({
  initialPage = 1,
  pageSize = 9,
  onBookClick = (venueId) => console.log("Book venue:", venueId),
  onViewDetails = (venueId) => console.log("View details:", venueId),
  onPageChange = (page) => console.log("Page changed:", page),
}) {
  // State management
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isVisible, setIsVisible] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("All")
  const [priceRange, setPriceRange] = useState([15, 50])
  const [venueTypes, setVenueTypes] = useState({ indoor: false, outdoor: false })
  const [minRating, setMinRating] = useState(0)

  // Refs
  const contentRef = useRef(null)
  const filterToggleRef = useRef(null)

  // Get unique sports for filter dropdown
  const allSports = ["All", ...new Set(mockVenues.flatMap((venue) => venue.sports))]

  // Filter venues based on current filters
  const filteredVenues = mockVenues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === "All" || venue.sports.includes(selectedSport)
    const matchesPrice = venue.pricePerHour >= priceRange[0] && venue.pricePerHour <= priceRange[1]
    const matchesType =
      (!venueTypes.indoor && !venueTypes.outdoor) ||
      (venueTypes.indoor && venue.indoor) ||
      (venueTypes.outdoor && venue.outdoor)
    const matchesRating = venue.rating >= minRating

    return matchesSearch && matchesSport && matchesPrice && matchesType && matchesRating
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSport("All")
    setPriceRange([15, 50])
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedSport, priceRange, venueTypes, minRating])

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
            <a href="/">Home</a> / <span>Venues</span>
          </nav>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.loginButton}>Login</button>
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

          {/* Price Range */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <div className={styles.priceInputs}>
              <input
                type="range"
                min="15"
                max="50"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className={styles.rangeInput}
              />
              <input
                type="range"
                min="15"
                max="50"
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
          <div className={styles.contentHeader}>
            <h1>Find Your Perfect Venue</h1>
            <p>
              Showing {showingStart}–{showingEnd} of {filteredVenues.length} venues
            </p>
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
                  <div className={styles.price}>₹{venue.pricePerHour}/hr</div>
                  <div className={styles.ctaRow}>
                    <button className={styles.detailsBtn} onClick={() => onViewDetails(venue.id)}>
                      View Details
                    </button>
                    <button className={styles.bookBtn} onClick={() => onBookClick(venue.id)}>
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
