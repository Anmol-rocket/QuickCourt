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

const Dashboard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDoughnutModal, setShowDoughnutModal] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFacilityOwners: 0,
    totalBookings: 3456, // Mock data for now
    totalActiveCourts: 0,
  })

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
    
    // Fetch real stats
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      // Fetch users
      const usersResponse = await fetch(`${BASE_URL}/getAllUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Fetch venues
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
        
        // Count users by role
        const totalUsers = users.filter(user => user.role !== "ROLE_ADMIN").length
        const facilityOwners = users.filter(user => user.role === "ROLE_FACILITY_OWNER").length
        
        // Calculate active courts (only from verified venues)
        let activeCourts = 0
        const verifiedVenues = venues.filter(venue => venue.verified)
        
        for (const venue of verifiedVenues) {
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
              activeCourts += sports.length
            }
          } catch (error) {
            console.error(`Error fetching sports for venue ${venue.id}:`, error)
          }
        }
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalUsers,
          totalFacilityOwners: facilityOwners,
          totalActiveCourts: activeCourts
        }))
        
        console.log("Dashboard Stats - Active Courts:", activeCourts)
        
      } else {
        console.error("Failed to fetch dashboard data")
        if (usersResponse.status === 401 || venuesResponse.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          localStorage.removeItem("userRole")
          navigate("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
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
            <h1>Admin Dashboard</h1>
            <p>Manage your sports facility platform with comprehensive insights and controls.</p>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <div className={styles.welcomeContent}>
                <h3>Welcome back, {userData ? userData.fullName : "Admin"}!</h3>
                <p>Platform overview and management tools</p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Stats */}
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Platform Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : stats.totalUsers.toLocaleString()}
                </h3>
                <p className={styles.statLabel}>Total Users</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : stats.totalFacilityOwners}
                </h3>
                <p className={styles.statLabel}>Facility Owners</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📅</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : stats.totalBookings.toLocaleString()}
                </h3>
                <p className={styles.statLabel}>Total Bookings</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏟️</div>
              <div className={styles.statContent}>
                <h3 className={styles.statNumber}>
                  {loading ? "..." : stats.totalActiveCourts}
                </h3>
                <p className={styles.statLabel}>Active Courts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section - Removed from main content */}
        {/* Charts have been moved to footer modal */}
      </div>

      {/* Doughnut Footer Button */}
      <div className={styles.doughnutFooter}>
        <button 
          className={styles.doughnutButton}
          onClick={() => setShowDoughnutModal(true)}
          title="View User Analytics"
        >
          <span className={styles.doughnutButtonIcon}>📊</span>
        </button>
      </div>

      {/* Doughnut Modal */}
      {showDoughnutModal && (
        <div className={styles.doughnutModal} onClick={() => setShowDoughnutModal(false)}>
          <div className={styles.doughnutModalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseButton}
              onClick={() => setShowDoughnutModal(false)}
            >
              ✕
            </button>
            
            <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
              User Distribution Analytics
            </h3>
            
            <div className={styles.doughnutChart}>
              <div className={styles.doughnutContainer}>
                <svg width="220" height="220" viewBox="0 0 42 42" className={styles.donut}>
                  {/* Background circle */}
                  <circle
                    className={styles.donutHole}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#f0f0f0"
                    strokeWidth="3"
                  />
                  
                  {/* Regular Users Segment */}
                  <circle
                    className={styles.donutSegment}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray={`${loading ? 0 : Math.round(((stats.totalUsers - stats.totalFacilityOwners) / stats.totalUsers) * 100)} ${loading ? 100 : 100 - Math.round(((stats.totalUsers - stats.totalFacilityOwners) / stats.totalUsers) * 100)}`}
                    strokeDashoffset="25"
                    style={{
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.2, 0.9, 0.2, 1)',
                      animationDelay: '0.5s'
                    }}
                  />
                  
                  {/* Facility Owners Segment */}
                  <circle
                    className={styles.donutSegment}
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${loading ? 0 : Math.round((stats.totalFacilityOwners / stats.totalUsers) * 100)} ${loading ? 100 : 100 - Math.round((stats.totalFacilityOwners / stats.totalUsers) * 100)}`}
                    strokeDashoffset={`${25 - (loading ? 0 : Math.round(((stats.totalUsers - stats.totalFacilityOwners) / stats.totalUsers) * 100))}`}
                    style={{
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.2, 0.9, 0.2, 1)',
                      animationDelay: '0.8s'
                    }}
                  />
                </svg>
                <div className={styles.doughnutCenter}>
                  <div className={styles.centerText}>
                    <span className={styles.centerNumber}>
                      {loading ? (
                        <span className={styles.loadingDots}>•••</span>
                      ) : (
                        <span className={styles.countUp}>
                          {stats.totalUsers.toLocaleString()}
                        </span>
                      )}
                    </span>
                    <span className={styles.centerLabel}>Total Users</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#4f46e5' }}></div>
                  <div className={styles.legendInfo}>
                    <span className={styles.legendLabel}>Regular Users</span>
                    <span className={styles.legendValue}>
                      {loading ? "..." : (stats.totalUsers - stats.totalFacilityOwners).toLocaleString()} 
                      ({loading ? "0" : Math.round(((stats.totalUsers - stats.totalFacilityOwners) / stats.totalUsers) * 100)}%)
                    </span>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
                  <div className={styles.legendInfo}>
                    <span className={styles.legendLabel}>Facility Owners</span>
                    <span className={styles.legendValue}>
                      {loading ? "..." : stats.totalFacilityOwners.toLocaleString()} 
                      ({loading ? "0" : Math.round((stats.totalFacilityOwners / stats.totalUsers) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
