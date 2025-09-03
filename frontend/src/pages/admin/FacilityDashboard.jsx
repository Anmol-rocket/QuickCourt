import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import styles from "./Dashboard.module.css"
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

const FacilityDashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [facilityStats, setFacilityStats] = useState({
    totalFacilities: 0,
    pendingApprovals: 0,
    activeFacilities: 0,
    totalCourts: 234,
  })
  const [loading, setLoading] = useState(true)
  const [facilityOwners, setFacilityOwners] = useState([])
  const [allVenues, setAllVenues] = useState([])
  const [verificationLoading, setVerificationLoading] = useState({})

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
    
    // Fetch facility data
    fetchFacilityData()
  }, [])

  const fetchFacilityData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      // Step 1: Get all users and filter facility owners
      const usersResponse = await fetch(`${BASE_URL}/getAllUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Step 2: Get all venues for facility approval
      const venuesResponse = await fetch(`${BASE_URL}/api/venues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (usersResponse.ok && venuesResponse.ok) {
        const users = await usersResponse.json()
        const venues = await venuesResponse.json()
        
        // Filter facility owners and store their emails
        const facilityOwnerEmails = users
          .filter(user => user.role === "ROLE_FACILITY_OWNER")
          .map(user => user.email)
        
        console.log("Facility Owner Emails:", facilityOwnerEmails)
        console.log("All Venues:", venues)
        
        // Set venues data
        setAllVenues(venues)
        
        // Step 3: Calculate total courts by fetching sports for each venue
        let totalCourts = 0
        let activeCourts = 0  // NEW: Only count courts from verified venues
        const venuesWithSportsCounts = []
        
        for (const venue of venues) {
          try {
            const sportsResponse = await fetch(`${BASE_URL}/api/sports/venue/${venue.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (sportsResponse.ok) {
              const sports = await sportsResponse.json()
              const sportsCount = sports.length
              totalCourts += sportsCount
              
              // Only add to active courts if venue is verified/active
              if (venue.verified) {
                activeCourts += sportsCount
              }
              
              venuesWithSportsCounts.push({
                ...venue,
                sportsCount: sportsCount,
                sports: sports
              })
              
              console.log(`Venue ${venue.name} (ID: ${venue.id}) has ${sportsCount} sports/courts - ${venue.verified ? 'ACTIVE' : 'PENDING'}`)
            } else {
              console.log(`No sports data for venue ${venue.id}`)
              venuesWithSportsCounts.push({
                ...venue,
                sportsCount: 0,
                sports: []
              })
            }
          } catch (error) {
            console.error(`Error fetching sports for venue ${venue.id}:`, error)
            venuesWithSportsCounts.push({
              ...venue,
              sportsCount: 0,
              sports: []
            })
          }
        }
        
        // Update venues with sports counts
        setAllVenues(venuesWithSportsCounts)
        
        // Calculate statistics
        const totalVenues = venues.length
        const verifiedVenues = venues.filter(venue => venue.verified).length
        const pendingVenues = venues.filter(venue => !venue.verified).length
        
        // Update facility stats with real data including total courts and active courts
        setFacilityStats(prev => ({
          ...prev,
          totalFacilities: totalVenues,
          activeFacilities: verifiedVenues,
          pendingApprovals: pendingVenues,
          totalCourts: totalCourts  // Use total courts from all venues
        }))
        
        // Create facility owners data
        const facilityOwnersData = facilityOwnerEmails.map(email => {
          const ownerData = users.find(user => user.email === email)
          const ownerVenues = venuesWithSportsCounts.filter(venue => venue.ownerMail === email)
          const ownerTotalSports = ownerVenues.reduce((sum, venue) => sum + (venue.sportsCount || 0), 0)
          const ownerActiveSports = ownerVenues
            .filter(venue => venue.verified)
            .reduce((sum, venue) => sum + (venue.sportsCount || 0), 0)
          
          return {
            email: email,
            name: ownerData?.fullName || "Unknown",
            venuesCount: ownerVenues.length,
            totalSports: ownerTotalSports,
            activeSports: ownerActiveSports,
            venues: ownerVenues
          }
        })
        
        setFacilityOwners(facilityOwnersData)
        console.log("Total Venues:", totalVenues)
        console.log("Verified Venues:", verifiedVenues)
        console.log("Pending Venues:", pendingVenues)
        console.log("Total Courts/Sports (all venues):", totalCourts)
        console.log("Active Courts (from verified venues only):", activeCourts)
        
      } else {
        console.error("Failed to fetch data:", usersResponse.status, venuesResponse.status)
        if (usersResponse.status === 401 || venuesResponse.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          localStorage.removeItem("userRole")
          navigate("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error fetching facility data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyVenue = async (venueId) => {
    try {
      setVerificationLoading(prev => ({ ...prev, [venueId]: true }))
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${BASE_URL}/api/venues/verify/${venueId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        // Update the venue in state
        const updatedVenues = allVenues.map(venue => 
          venue.id === venueId 
            ? { ...venue, verified: true }
            : venue
        )
        setAllVenues(updatedVenues)
        
        // Find the verified venue to get its sports count
        const verifiedVenue = allVenues.find(venue => venue.id === venueId)
        const venueCourtCount = verifiedVenue?.sportsCount || 0
        
        // Update facility stats - add the venue's courts to active courts
        setFacilityStats(prev => ({
          ...prev,
          activeFacilities: prev.activeFacilities + 1,
          pendingApprovals: prev.pendingApprovals - 1
          // Don't change totalCourts as it represents all courts
        }))
        
        console.log(`Venue ${venueId} verified successfully - total courts remain ${facilityStats.totalCourts}`)
      } else {
        console.error("Failed to verify venue:", response.status, response.statusText)
        if (response.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          localStorage.removeItem("userRole")
          navigate("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error verifying venue:", error)
    } finally {
      setVerificationLoading(prev => ({ ...prev, [venueId]: false }))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    localStorage.removeItem("userRole")
    localStorage.removeItem("email")
    localStorage.removeItem("fullName")
    navigate("/")
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>QuickCourt Admin</h1>
        </div>
        
        <nav className={styles.nav}>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/facility-dashboard">Facility Dashboard</Link></li>
            <li><Link to="/admin/user-management">User Management</Link></li>
          </ul>
        </nav>
        
        <div className={styles.headerRight}>
          <div className={styles.avatarInitials}>
            {userData ? getInitials(userData.fullName) : "AD"}
          </div>
          <span className={styles.userName}>
            {userData ? userData.fullName : "Admin"}
          </span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1>Facility Dashboard</h1>
            <p>Manage sports facilities, approve new registrations, and monitor facility performance.</p>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <div className={styles.welcomeContent}>
                <h3>Facility Management</h3>
                <p>Oversee all sports facilities on the platform</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Facility Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : facilityStats.totalFacilities}
                </h3>
                <p className={styles.statLabel}>Total Facilities</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏳</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{facilityStats.pendingApprovals}</h3>
                <p className={styles.statLabel}>Pending Approvals</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : facilityStats.activeFacilities}
                </h3>
                <p className={styles.statLabel}>Active Facilities</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏟️</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>{facilityStats.totalCourts}</h3>
                <p className={styles.statLabel}>Total Courts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Facility Owners Section */}
        <section className={styles.chartsSection}>
          <h2 className={styles.sectionTitle}>Facility Owners & Their Venues</h2>
          <div className={styles.chartCard}>
            {loading ? (
              <div className={styles.loading}>Loading facility data...</div>
            ) : facilityOwners.length > 0 ? (
              <div className={styles.facilityList}>
                {facilityOwners.map((owner, index) => (
                  <div key={owner.email} className={styles.facilityItem}>
                    <div className={styles.facilityInfo}>
                      <h4 className={styles.facilityName}>{owner.name}</h4>
                      <p className={styles.facilityOwner}>Email: {owner.email}</p>
                      <p className={styles.facilityCourts}>
                        {owner.venuesCount} Venues • {owner.activeSports}/{owner.totalSports} Active/Total Courts
                      </p>
                    </div>
                    <div className={styles.facilityActions}>
                      <span className={`${styles.facilityStatus} ${styles.statusApproved}`}>
                        {owner.venuesCount > 0 ? 'Active Owner' : 'No Venues'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>No facility owners found.</div>
            )}
          </div>
        </section>

        {/* Recent Facilities Section */}
        <section className={styles.chartsSection}>
          <h2 className={styles.sectionTitle}>Facility Verification Applications</h2>
          <div className={styles.chartCard}>
            {loading ? (
              <div className={styles.loading}>Loading venue applications...</div>
            ) : allVenues.length > 0 ? (
              <div className={styles.facilityList}>
                {allVenues.map((venue) => (
                  <div key={venue.id} className={styles.facilityItem}>
                    <div className={styles.facilityInfo}>
                      <h4 className={styles.facilityName}>{venue.name}</h4>
                      <p className={styles.facilityOwner}>Owner: {venue.ownerMail}</p>
                      <p className={styles.facilityAddress}>{venue.address}</p>
                      <div className={styles.facilityDetails}>
                        <span className={styles.facilityAmenities}>
                          {venue.amenities?.length || 0} amenities
                        </span>
                        <span className={styles.facilitySports}>
                          {venue.sportsCount || 0} sports/courts
                        </span>
                        {venue.rating && (
                          <span className={styles.facilityRating}>
                            ⭐ {venue.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.facilityActions}>
                      <span className={`${styles.facilityStatus} ${
                        venue.verified ? styles.statusApproved : styles.statusPending
                      }`}>
                        {venue.verified ? 'Verified' : 'Pending'}
                      </span>
                      {!venue.verified && (
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.approveButton}
                            onClick={() => handleVerifyVenue(venue.id)}
                            disabled={verificationLoading[venue.id]}
                          >
                            {verificationLoading[venue.id] ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                      )}
                      {venue.verified && (
                        <div className={styles.verifiedInfo}>
                          <span className={styles.verifiedText}>✅ Approved</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>No venue applications found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default FacilityDashboard
