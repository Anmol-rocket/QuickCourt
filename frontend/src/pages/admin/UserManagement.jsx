"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import styles from "./UserManagement.module.css"
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

const UserManagement = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [userBookings, setUserBookings] = useState([])
  const [venueDetails, setVenueDetails] = useState(null)
  const [venueSports, setVenueSports] = useState([])
  const [venueCache, setVenueCache] = useState({}) // Cache for venue data by ID
  const [sportCache, setSportCache] = useState({}) // Cache for sport data by ID
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [venueLoading, setVenueLoading] = useState(false)
  const [sportsLoading, setSportsLoading] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
    
    // Fetch users data
    fetchUsers()
  }, [])

  // Helper function to get venue name by ID with caching
  const getVenueNameById = async (venueId) => {
    if (venueCache[venueId]) {
      return venueCache[venueId].name
    }
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const venue = await response.json()
        setVenueCache(prev => ({ ...prev, [venueId]: venue }))
        return venue.name
      }
    } catch (error) {
      console.error(`Error fetching venue ${venueId}:`, error)
    }
    return `Venue #${venueId}`
  }

  // Helper function to get sport name by ID with caching
  const getSportNameById = async (sportId) => {
    if (sportCache[sportId]) {
      return sportCache[sportId].name
    }
    
    try {
      const token = localStorage.getItem("token")
      // We'll need to find which venue has this sport, for now we'll cache when we fetch venue sports
      return `Sport #${sportId}`
    } catch (error) {
      console.error(`Error fetching sport ${sportId}:`, error)
    }
    return `Sport #${sportId}`
  }

  // Helper function to get sport name by venue and sport ID using the sports API
  const getSportNameByVenueAndId = async (venueId, sportId) => {
    try {
      // Check if we have this venue's sports cached
      const cacheKey = `venue_${venueId}`
      if (venueCache[cacheKey] && venueCache[cacheKey].sports) {
        const sport = venueCache[cacheKey].sports.find(s => s.id === sportId)
        if (sport) {
          return sport.name
        }
      }

      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/sports/venue/${venueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const sports = await response.json()
        
        // Cache the sports for this venue
        setVenueCache(prev => ({
          ...prev,
          [cacheKey]: { ...prev[cacheKey], sports }
        }))
        
        // Cache individual sports
        const sportCacheUpdate = {}
        sports.forEach(sport => {
          sportCacheUpdate[sport.id] = sport
        })
        setSportCache(prev => ({ ...prev, ...sportCacheUpdate }))
        
        // Find and return the specific sport name
        const sport = sports.find(s => s.id === sportId)
        if (sport) {
          console.log(`Found sport: ${sport.name} for venue ${venueId}`)
          return sport.name
        }
      }
    } catch (error) {
      console.error(`Error fetching sports for venue ${venueId}:`, error)
    }
    return `Sport #${sportId}`
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${BASE_URL}/getAllUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const usersData = await response.json()
        
        // Transform the API data to match our component structure
        // Filter out admin users - only show regular users and facility owners
        const transformedUsers = usersData
          .filter(userData => userData.role !== "ROLE_ADMIN") // Exclude admin users
          .map((userData, index) => ({
            id: userData.email, // Using email as unique ID
            email: userData.email,
            name: userData.fullName,
            role: userData.role === "ROLE_USER" ? "user" : 
                  userData.role === "ROLE_FACILITY_OWNER" ? "facility_owner" : "user",
            status: userData.password === "@@@@" ? "banned" : "active", // Check for banned pattern
            joinDate: new Date().toLocaleDateString(), // Use current date as join date
            totalBookings: 0, // Will be updated when we fetch bookings for users
            avatar: getInitials(userData.fullName),
            fullData: userData
          }))
        
        setUsers(transformedUsers)
        
        // Fetch booking counts only for regular users, not facility owners
        const regularUsers = transformedUsers.filter(user => user.role === "user")
        await Promise.all(
          regularUsers.map(async (user) => {
            try {
              const bookingsResponse = await fetch(`${BASE_URL}/api/bookings/user/${user.email}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              })
              if (bookingsResponse.ok) {
                const bookings = await bookingsResponse.json()
                setUsers(prevUsers => 
                  prevUsers.map(u => 
                    u.email === user.email 
                      ? { ...u, totalBookings: bookings.length }
                      : u
                  )
                )
              }
            } catch (error) {
              console.error(`Error fetching bookings for user ${user.email}:`, error)
            }
          })
        )
      } else {
        console.error("Failed to fetch users:", response.status, response.statusText)
        if (response.status === 401) {
          // Token might be expired, redirect to login
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          localStorage.removeItem("userRole")
          navigate("/admin/login")
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserBookings = async (userEmail) => {
    try {
      setBookingsLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${BASE_URL}/api/bookings/user/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const bookings = await response.json()
        
        // Enhance bookings with venue and sport names
        const enhancedBookings = await Promise.all(
          bookings.map(async (booking) => {
            console.log(`🔍 Processing booking ${booking.id}:`, booking)
            let venueName = 'Unknown Venue'
            let sportName = 'Unknown Sport'
            
            // Get venue name first
            if (booking.venueId) {
              venueName = await getVenueNameById(booking.venueId)
              
              // Now call the List Sports By Venue API to get all sports for this venue
              try {
                const token = localStorage.getItem("token")
                const sportsResponse = await fetch(`${BASE_URL}/api/sports/venue/${booking.venueId}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                })
                
                if (sportsResponse.ok) {
                  const venueSports = await sportsResponse.json()
                  console.log(`Sports for venue ${booking.venueId}:`, venueSports)
                  
                  // Find the sport name using the sport ID from the booking slot
                  if (booking.slots && booking.slots.length > 0) {
                    // Check if sportId exists in the slot
                    const slot = booking.slots[0]
                    console.log(`Booking ${booking.id} slot data:`, slot)
                    
                    if (slot.sportId) {
                      const sportId = slot.sportId
                      const foundSport = venueSports.find(sport => sport.id === sportId)
                      
                      if (foundSport) {
                        sportName = foundSport.name
                        console.log(`✅ Found sport: ${foundSport.name} for booking ${booking.id}`)
                        
                        // Cache the sport for future use
                        setSportCache(prev => ({
                          ...prev,
                          [sportId]: foundSport
                        }))
                      } else {
                        console.log(`❌ Sport with ID ${sportId} not found in venue ${booking.venueId} sports:`, venueSports.map(s => `${s.id}:${s.name}`))
                        sportName = `Sport #${sportId}`
                      }
                    } else {
                      console.log(`❌ No sportId found in booking ${booking.id} slot:`, slot)
                      // Try to get sport from booking directly if it exists
                      if (booking.sportId) {
                        const foundSport = venueSports.find(sport => sport.id === booking.sportId)
                        if (foundSport) {
                          sportName = foundSport.name
                          console.log(`✅ Found sport from booking.sportId: ${foundSport.name}`)
                        } else {
                          sportName = `Sport #${booking.sportId}`
                        }
                      } else {
                        sportName = 'Sport Info Missing'
                      }
                    }
                  } else {
                    console.log(`❌ No slots found for booking ${booking.id}:`, booking)
                    // Try to get sport from booking directly if it exists
                    if (booking.sportId) {
                      const foundSport = venueSports.find(sport => sport.id === booking.sportId)
                      if (foundSport) {
                        sportName = foundSport.name
                        console.log(`✅ Found sport from booking.sportId: ${foundSport.name}`)
                      } else {
                        sportName = `Sport #${booking.sportId}`
                      }
                    } else {
                      sportName = 'No Sport Data'
                    }
                  }
                } else {
                  console.error(`Failed to fetch sports for venue ${booking.venueId}:`, sportsResponse.status)
                  // Fallback to sport ID if API call fails
                  if (booking.slots && booking.slots.length > 0 && booking.slots[0].sportId) {
                    sportName = `Sport #${booking.slots[0].sportId}`
                  }
                }
              } catch (error) {
                console.error(`Error fetching sports for venue ${booking.venueId}:`, error)
                // Fallback to sport ID if API call fails
                if (booking.slots && booking.slots.length > 0 && booking.slots[0].sportId) {
                  sportName = `Sport #${booking.slots[0].sportId}`
                }
              }
            }
            
            console.log(`📊 Final result for booking ${booking.id}: Venue="${venueName}", Sport="${sportName}"`)
            return {
              ...booking,
              venueName,
              sportName
            }
          })
        )
        
        setUserBookings(enhancedBookings)
        
        // Update user's total bookings count
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.email === userEmail 
              ? { ...user, totalBookings: bookings.length }
              : user
          )
        )
      } else {
        console.error("Failed to fetch user bookings:", response.status, response.statusText)
        if (response.status === 401) {
          // Token might be expired, redirect to login
          localStorage.removeItem("token")
          localStorage.removeItem("userData")
          localStorage.removeItem("userRole")
          navigate("/admin/login")
        }
        setUserBookings([])
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error)
      setUserBookings([])
    } finally {
      setBookingsLoading(false)
    }
  }

  const fetchVenueDetails = async (ownerEmail) => {
    try {
      setVenueLoading(true)
      const token = localStorage.getItem("token")
      
      // Use the correct API endpoint to get all venues for the owner
      const response = await fetch(`${BASE_URL}/api/venues/allVenues/${ownerEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const venues = await response.json()
        
        if (venues && venues.length > 0) {
          // Display the first venue (you can modify this to show all venues)
          const venue = venues[0]
          
          // First, get detailed venue information using venue ID
          await fetchVenueById(venue.id)
        } else {
          setVenueDetails(null)
          setVenueSports([])
          console.log(`No venues found for owner ${ownerEmail}`)
        }
      } else if (response.status === 401) {
        // Handle authentication error
        localStorage.removeItem("token")
        localStorage.removeItem("userData")
        localStorage.removeItem("userRole")
        navigate("/admin/login")
      } else {
        console.error("Failed to fetch venues:", response.status, response.statusText)
        setVenueDetails(null)
        setVenueSports([])
      }
    } catch (error) {
      console.error("Error fetching venue details:", error)
      setVenueDetails(null)
      setVenueSports([])
    } finally {
      setVenueLoading(false)
    }
  }

  const fetchVenueById = async (venueId) => {
    try {
      const token = localStorage.getItem("token")
      
      // Get venue details by ID
      const venueResponse = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (venueResponse.ok) {
        const venueData = await venueResponse.json()
        setVenueDetails(venueData)
        console.log(`Venue details fetched for venue ${venueId}:`, venueData.name)
        
        // After getting venue details, fetch sports for this venue
        await fetchVenueSports(venueId)
      } else {
        console.error("Failed to fetch venue by ID:", venueResponse.status, venueResponse.statusText)
        setVenueDetails(null)
        setVenueSports([])
      }
    } catch (error) {
      console.error("Error fetching venue by ID:", error)
      setVenueDetails(null)
      setVenueSports([])
    }
  }

  const fetchVenueSports = async (venueId) => {
    try {
      setSportsLoading(true)
      const token = localStorage.getItem("token")
      
      // Get sports for this venue
      const sportsResponse = await fetch(`${BASE_URL}/api/sports/venue/${venueId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (sportsResponse.ok) {
        const sportsData = await sportsResponse.json()
        setVenueSports(sportsData)
        
        // Cache sport data for future use
        const sportCacheUpdate = {}
        sportsData.forEach(sport => {
          sportCacheUpdate[sport.id] = sport
        })
        setSportCache(prev => ({ ...prev, ...sportCacheUpdate }))
        
        console.log(`Sports fetched for venue ${venueId}:`, sportsData.map(sport => sport.name).join(', '))
      } else {
        console.error("Failed to fetch venue sports:", sportsResponse.status, sportsResponse.statusText)
        setVenueSports([])
      }
    } catch (error) {
      console.error("Error fetching venue sports:", error)
      setVenueSports([])
    } finally {
      setSportsLoading(false)
    }
  }

  const handleUserClick = async (user) => {
    setSelectedUser(user)
    setVenueDetails(null) // Reset venue details
    setVenueSports([]) // Reset venue sports
    setUserBookings([]) // Reset user bookings
    
    if (user.role === "user") {
      // Only fetch bookings for regular users, not facility owners
      await fetchUserBookings(user.email)
    } else if (user.role === "facility_owner") {
      // For facility owners, fetch venue details using their email
      await fetchVenueDetails(user.email)
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

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleBanUser = async (userId) => {
    try {
      console.log(`Banning user ${userId}`)
      const token = localStorage.getItem("token")
      
      // Find the user to get their email
      const user = users.find(u => u.id === userId)
      if (!user) {
        console.error('User not found')
        return
      }
      
      const response = await fetch(`${BASE_URL}/ban?username=${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        console.log(`Successfully banned user ${user.email}`)
        // Update the user status in the local state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId 
              ? { ...u, status: "banned" }
              : u
          )
        )
        
        // Update selected user if it's the same user
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(prev => ({ ...prev, status: "banned" }))
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to ban user:', response.status, errorText)
        alert('Failed to ban user. Please try again.')
      }
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Error banning user. Please check your connection and try again.')
    }
  }

  const handleUnbanUser = async (userId) => {
    try {
      console.log(`Unbanning user ${userId}`)
      // For now, we'll implement unban as a local state change
      // If there's a specific unban API endpoint, it can be added here
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: "active" }
            : user
        )
      )
      
      // Update selected user if it's the same user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => ({ ...prev, status: "active" }))
      }
      
      console.log(`User ${userId} unbanned successfully`)
    } catch (error) {
      console.error('Error unbanning user:', error)
      alert('Error unbanning user. Please try again.')
    }
  }

  const getRoleDisplay = (role) => {
    return role === "facility_owner" ? "Facility Owner" : "User"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return styles.activeStatus
      case "banned":
        return styles.bannedStatus
      default:
        return styles.activeStatus
    }
  }

  return (
    <div className={styles.userManagement}>
      {/* Header */}
      <header className={styles.headerNav}>
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

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage users and facility owners</p>
        </header>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className={styles.filterSelect}>
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="facility_owner">Facility Owners</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.loading}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatarInitials}>
                          {user.avatar}
                        </div>
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                  <td>
                    <span className={styles.roleTag}>{getRoleDisplay(user.role)}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusTag} ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    {user.role === "facility_owner" ? (
                      <span>Facility Owner</span>
                    ) : (
                      <span>{user.totalBookings} bookings</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.viewBtn} onClick={() => handleUserClick(user)}>
                        View
                      </button>
                      {user.status === "banned" ? (
                        <span className={styles.bannedLabel}>Banned</span>
                      ) : (
                        <button className={styles.banBtn} onClick={() => {
                          if (window.confirm(`Are you sure you want to ban ${user.name}? This action will prevent them from accessing the platform.`)) {
                            handleBanUser(user.id)
                          }
                        }}>
                          Ban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noBookings}>
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>User Details</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.userProfile}>
                  <div className={styles.profileAvatarInitials}>
                    {selectedUser.avatar}
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>{selectedUser.name}</h3>
                    <p>{selectedUser.email}</p>
                    <div className={styles.profileTags}>
                      <span className={styles.roleTag}>{getRoleDisplay(selectedUser.role)}</span>
                      <span className={`${styles.statusTag} ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                    <div className={styles.profileStats}>
                      <div className={styles.profileRow}>
                        <span className={styles.profileLabel}>Email:</span>
                        <span className={styles.profileValue}>{selectedUser.email}</span>
                      </div>
                      <div className={styles.profileRow}>
                        <span className={styles.profileLabel}>Full Name:</span>
                        <span className={styles.profileValue}>{selectedUser.name}</span>
                      </div>
                      <div className={styles.profileRow}>
                        <span className={styles.profileLabel}>Status:</span>
                        <span className={`${styles.profileValue} ${
                          selectedUser.status === "active" ? styles.verified : styles.banned
                        }`}>
                          {selectedUser.status === "active" ? "Active" : "Banned"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser.role === "user" && (
                  <div className={styles.bookingHistory}>
                    <h4>Booking History</h4>
                    {bookingsLoading ? (
                      <div className={styles.loading}>Loading bookings...</div>
                    ) : userBookings.length > 0 ? (
                      <div className={styles.bookingList}>
                        {userBookings.map((booking) => (
                          <div key={booking.id} className={styles.bookingItem}>
                            <div className={styles.bookingInfo}>
                              <div className={styles.bookingHeader}>
                                <h5 className={styles.venueName}>{booking.venueName || `Venue #${booking.venueId}`}</h5>
                                <span className={styles.sportName}>{booking.sportName || 'Unknown Sport'}</span>
                              </div>
                              <div className={styles.bookingDetails}>
                                <span className={styles.bookingPrice}>Total: ₹{booking.totalPrice}</span>
                                <span className={styles.bookingId}>Booking #{booking.id}</span>
                              </div>
                              <div className={styles.slotInfo}>
                                <strong>Time Slots:</strong>
                                <div className={styles.slotsContainer}>
                                  {booking.slots.map((slot, index) => (
                                    <div key={index} className={styles.slotCard}>
                                      <div className={styles.slotDate}>
                                        {new Date(slot.startDateTime).toLocaleDateString()}
                                      </div>
                                      <div className={styles.slotTime}>
                                        {new Date(slot.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                        {new Date(slot.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                      <div className={styles.slotPrice}>₹{slot.price}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className={styles.bookingMeta}>
                                <small>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</small>
                              </div>
                            </div>
                            <span className={`${styles.bookingStatus} ${
                              booking.status === "CONFIRMED" ? styles.completed : 
                              booking.status === "CANCELLED" ? styles.cancelled : styles.pending
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noBookings}>No bookings found for this user.</div>
                    )}
                  </div>
                )}

                {selectedUser.role === "facility_owner" && (
                  <div className={styles.facilityOwnerInfo}>
                    <h4>Facility Owner Details</h4>
                    <div className={styles.ownerEmailInfo}>
                      <p><strong>Searching venues for:</strong> {selectedUser.email}</p>
                    </div>
                    {venueLoading ? (
                      <div className={styles.loading}>Loading venue details...</div>
                    ) : venueDetails ? (
                      <div className={styles.venueDetails}>
                        <div className={styles.venueCard}>
                          <div className={styles.venueHeader}>
                            <h5 className={styles.venueName}>{venueDetails.name}</h5>
                            <div className={styles.venueStatus}>
                              <span className={`${styles.statusBadge} ${
                                venueDetails.verified ? styles.verifiedBadge : styles.pendingBadge
                              }`}>
                                {venueDetails.verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </div>
                          
                          <div className={styles.venueInfo}>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Venue ID:</span>
                              <span className={styles.venueValue}>#{venueDetails.id}</span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Owner Email:</span>
                              <span className={styles.venueValue}>{venueDetails.ownerMail}</span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Verification Status:</span>
                              <span className={`${styles.venueValue} ${
                                venueDetails.verified ? styles.verified : styles.unverified
                              }`}>
                                {venueDetails.verified ? "✅ Verified" : "⏳ Pending Verification"}
                              </span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Description:</span>
                              <span className={styles.venueValue}>{venueDetails.description}</span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Address:</span>
                              <span className={styles.venueValue}>{venueDetails.address}</span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Rating:</span>
                              <span className={styles.venueValue}>
                                {venueDetails.rating ? (
                                  <span>⭐ {venueDetails.rating}/5</span>
                                ) : (
                                  <span className={styles.noRating}>No rating yet</span>
                                )}
                              </span>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Sports Offered:</span>
                              <div className={styles.sportsSection}>
                                {sportsLoading ? (
                                  <div className={styles.loadingSports}>
                                    <div className={styles.loadingSpinner}></div>
                                    <span>Loading sports...</span>
                                  </div>
                                ) : venueSports && venueSports.length > 0 ? (
                                  <div className={styles.sportsGrid}>
                                    {venueSports.map((sport, index) => (
                                      <div key={sport.id} className={styles.sportCard}>
                                        <div className={styles.sportCardHeader}>
                                          <div className={styles.sportTitleRow}>
                                            <h6 className={styles.sportName}>{sport.name}</h6>
                                            <span className={`${styles.sportTypeTag} ${
                                              sport.type === 'Indoor' ? styles.indoorType : styles.outdoorType
                                            }`}>
                                              {sport.type}
                                            </span>
                                          </div>
                                        </div>
                                        <div className={styles.sportCardBody}>
                                          <div className={styles.sportInfoGrid}>
                                            <div className={styles.sportInfoItem}>
                                              <span className={styles.sportInfoLabel}>Price</span>
                                              <span className={styles.sportInfoValue}>₹{sport.pricePerHour}/hr</span>
                                            </div>
                                            <div className={styles.sportInfoItem}>
                                              <span className={styles.sportInfoLabel}>Hours</span>
                                              <span className={styles.sportInfoValue}>{sport.operatingHours}</span>
                                            </div>
                                            {sport.averageRating > 0 && (
                                              <div className={styles.sportInfoItem}>
                                                <span className={styles.sportInfoLabel}>Rating</span>
                                                <span className={styles.sportInfoValue}>
                                                  <span className={styles.ratingStars}>⭐</span>
                                                  {sport.averageRating.toFixed(1)}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className={styles.noSportsMessage}>
                                    <div className={styles.noSportsIcon}>🏟️</div>
                                    <span>No sports configured yet</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={styles.venueRow}>
                              <span className={styles.venueLabel}>Amenities:</span>
                              <div className={styles.amenitiesList}>
                                {venueDetails.amenities && venueDetails.amenities.length > 0 ? (
                                  venueDetails.amenities.map((amenity, index) => (
                                    <span key={index} className={styles.amenityTag}>
                                      {amenity}
                                    </span>
                                  ))
                                ) : (
                                  <span className={styles.noAmenities}>No amenities listed</span>
                                )}
                              </div>
                            </div>
                            {venueDetails.photoUrls && venueDetails.photoUrls.length > 0 && (
                              <div className={styles.venueRow}>
                                <span className={styles.venueLabel}>Photos ({venueDetails.photoUrls.length}):</span>
                                <div className={styles.photoGallery}>
                                  {venueDetails.photoUrls.map((photoUrl, index) => (
                                    <img 
                                      key={index} 
                                      src={photoUrl} 
                                      alt={`${venueDetails.name} photo ${index + 1}`}
                                      className={styles.venuePhoto}
                                      onError={(e) => {
                                        e.target.style.display = 'none'
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.noVenueData}>
                        <p>No venue details found for <strong>{selectedUser.email}</strong></p>
                        <p><small>This facility owner may not have any registered venues yet, or venue data is not linked to their email address.</small></p>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.modalActions}>
                  {selectedUser.status === "banned" ? (
                    <span className={styles.bannedLabel}>User is Banned</span>
                  ) : (
                    <button className={styles.banBtn} onClick={() => {
                      if (window.confirm(`Are you sure you want to ban ${selectedUser.name}? This action will prevent them from accessing the platform.`)) {
                        handleBanUser(selectedUser.id)
                      }
                    }}>
                      Ban User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
