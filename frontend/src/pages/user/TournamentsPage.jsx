"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Calendar, MapPin, Clock, Trophy, UserPlus, UserMinus, Loader2 } from "lucide-react"
import styles from "./TournamentsPage.module.css"
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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function TournamentsPage({
  userName = "Guest",
  pageSize = 6,
}) {
  const navigate = useNavigate()
  
  // State management
  const [isVisible, setIsVisible] = useState(false)
  const [tournaments, setTournaments] = useState([])
  const [filteredTournaments, setFilteredTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [userEmail, setUserEmail] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [joiningTournament, setJoiningTournament] = useState(null)
  const [leavingTournament, setLeavingTournament] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Tournament Profile states
  const [activeTab, setActiveTab] = useState("available") // "available" or "profile"
  const [joinedTournaments, setJoinedTournaments] = useState([])
  const [joinedGameIds, setJoinedGameIds] = useState([])
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileStats, setProfileStats] = useState({
    totalJoined: 0,
    upcomingGames: 0,
    completedGames: 0,
    favoriteVenue: '',
    favoriteSport: ''
  })

  // Entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Get user email on mount
  useEffect(() => {
    const email = localStorage.getItem("email")
    if (email) {
      setUserEmail(email)
    }
  }, [])

  // API Functions
  const fetchAllTournaments = async () => {
    try {
      const token = localStorage.getItem("token")
      const currentUserEmail = localStorage.getItem("email")
      
      const response = await fetch(`${BASE_URL}/api/games`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Process tournaments to handle owner participation
        const processedTournaments = data.map(tournament => {
          // If the current user is the owner and not in the joined list, add them
          if (tournament.ownerMail === currentUserEmail) {
            if (!tournament.listOfUserEmailJoined?.includes(currentUserEmail)) {
              return {
                ...tournament,
                listOfUserEmailJoined: [currentUserEmail, ...(tournament.listOfUserEmailJoined || [])]
              }
            }
          }
          // For all tournaments (including non-owned), ensure owner is in participants list
          else if (tournament.ownerMail && !tournament.listOfUserEmailJoined?.includes(tournament.ownerMail)) {
            return {
              ...tournament,
              listOfUserEmailJoined: [tournament.ownerMail, ...(tournament.listOfUserEmailJoined || [])]
            }
          }
          return tournament
        })
        
        // Filter out tournaments where current user is already joined (unless they are the owner)
        const othersTournaments = processedTournaments.filter(tournament => 
          !tournament.listOfUserEmailJoined?.includes(currentUserEmail) || 
          tournament.ownerMail === currentUserEmail ||
          tournament.listOfUserEmailJoined?.length > 1
        )
        
        return othersTournaments
      } else {
        console.error('Failed to fetch tournaments:', response.status)
        return []
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error)
      return []
    }
  }

  const fetchUserProfile = async () => {
    if (!userEmail) return null
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/user-profiles/${userEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        return await response.json()
      } else if (response.status === 404) {
        // Create profile if it doesn't exist
        return await createUserProfile()
      } else {
        console.error('Failed to fetch user profile:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const createUserProfile = async () => {
    if (!userEmail) return null
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/user-profiles/${userEmail}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to create user profile:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  // Fetch joined game IDs for the user
  const fetchJoinedGameIds = async () => {
    if (!userEmail) return []
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/user-profiles/${userEmail}/game-ids`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to fetch joined game IDs:', response.status)
        return []
      }
    } catch (error) {
      console.error('Error fetching joined game IDs:', error)
      return []
    }
  }

  // Fetch specific game by ID
  const fetchGameById = async (gameId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/games/${gameId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const game = await response.json()
        
        // Ensure owner is always in the participants list
        if (game.ownerMail && !game.listOfUserEmailJoined?.includes(game.ownerMail)) {
          return {
            ...game,
            listOfUserEmailJoined: [game.ownerMail, ...(game.listOfUserEmailJoined || [])]
          }
        }
        
        return game
      } else {
        console.error(`Failed to fetch game ${gameId}:`, response.status)
        return null
      }
    } catch (error) {
      console.error(`Error fetching game ${gameId}:`, error)
      return null
    }
  }

  // Fetch all joined tournaments with details (including owned tournaments)
  const fetchJoinedTournamentsDetails = async () => {
    setProfileLoading(true)
    try {
      // Fetch joined game IDs from user profile
      const gameIds = await fetchJoinedGameIds()
      setJoinedGameIds(gameIds)
      
      // Fetch all tournaments to find owned tournaments
      const allTournaments = await fetchAllTournaments()
      const ownedTournaments = allTournaments.filter(tournament => tournament.ownerMail === userEmail)
      
      // Get IDs of owned tournaments
      const ownedGameIds = ownedTournaments.map(tournament => tournament.id)
      
      // Combine joined and owned game IDs (remove duplicates)
      const allGameIds = [...new Set([...gameIds, ...ownedGameIds])]
      
      if (allGameIds.length === 0) {
        setJoinedTournaments([])
        setProfileStats({
          totalJoined: 0,
          upcomingGames: 0,
          completedGames: 0,
          favoriteVenue: '',
          favoriteSport: ''
        })
        return
      }
      
      // Fetch details for each game
      const gamePromises = allGameIds.map(id => fetchGameById(id))
      const games = await Promise.all(gamePromises)
      const validGames = games.filter(game => game !== null)
      
      // Add ownership flag to each tournament and ensure owner is in participants list
      const gamesWithOwnership = validGames.map(game => {
        const isOwned = game.ownerMail === userEmail
        let participantsList = game.listOfUserEmailJoined || []
        
        // If user owns the tournament but isn't in the participants list, add them
        if (isOwned && !participantsList.includes(userEmail)) {
          participantsList = [userEmail, ...participantsList]
        }
        
        return {
          ...game,
          isOwned,
          listOfUserEmailJoined: participantsList
        }
      })
      
      setJoinedTournaments(gamesWithOwnership)
      
      // Calculate stats
      const now = new Date()
      const upcoming = gamesWithOwnership.filter(game => new Date(game.timeDate) > now)
      const completed = gamesWithOwnership.filter(game => new Date(game.timeDate) <= now)
      
      // Find favorite venue and sport
      const venueCount = {}
      const sportCount = {}
      
      gamesWithOwnership.forEach(game => {
        venueCount[game.venue] = (venueCount[game.venue] || 0) + 1
        sportCount[game.gameName] = (sportCount[game.gameName] || 0) + 1
      })
      
      const favoriteVenue = Object.keys(venueCount).length ? Object.keys(venueCount).reduce((a, b) => 
        venueCount[a] > venueCount[b] ? a : b) : 'N/A'
      const favoriteSport = Object.keys(sportCount).length ? Object.keys(sportCount).reduce((a, b) => 
        sportCount[a] > sportCount[b] ? a : b) : 'N/A'
      
      setProfileStats({
        totalJoined: gamesWithOwnership.length,
        upcomingGames: upcoming.length,
        completedGames: completed.length,
        favoriteVenue: favoriteVenue || 'N/A',
        favoriteSport: favoriteSport || 'N/A'
      })
      
    } catch (error) {
      console.error('Error fetching joined tournaments:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const joinTournament = async (tournamentId) => {
    if (!userEmail) return false
    
    setJoiningTournament(tournamentId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/games/${tournamentId}/join?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const updatedTournament = await response.json()
        
        // Update tournaments list
        setTournaments(prev => prev.map(t => 
          t.id === tournamentId ? updatedTournament : t
        ))
        setFilteredTournaments(prev => prev.map(t => 
          t.id === tournamentId ? updatedTournament : t
        ))
        
        // Refresh user profile
        const profile = await fetchUserProfile()
        setUserProfile(profile)
        
        setMessage({ type: 'success', text: 'Successfully joined tournament!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        
        return true
      } else {
        const errorText = await response.text()
        setMessage({ type: 'error', text: errorText || 'Failed to join tournament' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        return false
      }
    } catch (error) {
      console.error('Error joining tournament:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return false
    } finally {
      setJoiningTournament(null)
    }
  }

  const leaveTournament = async (tournamentId) => {
    if (!userEmail) return false
    
    setLeavingTournament(tournamentId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/games/${tournamentId}/leave?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const updatedTournament = await response.json()
        
        // Update tournaments list
        setTournaments(prev => prev.map(t => 
          t.id === tournamentId ? updatedTournament : t
        ))
        setFilteredTournaments(prev => prev.map(t => 
          t.id === tournamentId ? updatedTournament : t
        ))
        
        // Refresh user profile
        const profile = await fetchUserProfile()
        setUserProfile(profile)
        
        setMessage({ type: 'success', text: 'Successfully left tournament!' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        
        return true
      } else {
        const errorText = await response.text()
        setMessage({ type: 'error', text: errorText || 'Failed to leave tournament' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        return false
      }
    } catch (error) {
      console.error('Error leaving tournament:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return false
    } finally {
      setLeavingTournament(null)
    }
  }

  // Function to automatically join tournaments where user is the owner
  const autoJoinOwnedTournaments = async (tournaments) => {
    const currentUserEmail = localStorage.getItem("email")
    if (!currentUserEmail) return tournaments
    
    const updatedTournaments = []
    
    for (const tournament of tournaments) {
      if (tournament.ownerMail === currentUserEmail && 
          !tournament.listOfUserEmailJoined?.includes(currentUserEmail)) {
        
        // Automatically join this tournament
        try {
          const success = await joinTournament(tournament.id)
          if (success) {
            // Tournament will be updated in the state by joinTournament function
            updatedTournaments.push({
              ...tournament,
              listOfUserEmailJoined: [currentUserEmail, ...(tournament.listOfUserEmailJoined || [])]
            })
          } else {
            updatedTournaments.push(tournament)
          }
        } catch (error) {
          console.error(`Failed to auto-join tournament ${tournament.id}:`, error)
          updatedTournaments.push(tournament)
        }
      } else {
        updatedTournaments.push(tournament)
      }
    }
    
    return updatedTournaments
  }

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tournamentsData, profileData] = await Promise.all([
          fetchAllTournaments(),
          fetchUserProfile()
        ])
        
        // Auto-join tournaments where user is the owner
        const processedTournaments = await autoJoinOwnedTournaments(tournamentsData)
        
        setTournaments(processedTournaments)
        setFilteredTournaments(processedTournaments)
        setUserProfile(profileData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userEmail) {
      loadData()
    }
  }, [userEmail])

  // Load profile data when profile tab is selected
  useEffect(() => {
    if (activeTab === "profile" && userEmail) {
      fetchJoinedTournamentsDetails()
    }
  }, [activeTab, userEmail])

  // Filter tournaments based on search and sport
  useEffect(() => {
    let filtered = tournaments

    if (searchQuery.trim()) {
      filtered = filtered.filter(tournament =>
        (tournament.gameName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tournament.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tournament.venue || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredTournaments(filtered)
    setCurrentPage(1)
  }, [searchQuery, tournaments])

  // Check if user has joined a tournament
  const hasUserJoined = (tournament) => {
    return tournament.listOfUserEmailJoined?.includes(userEmail)
  }

  // Check if user is the owner of a tournament
  const isUserOwner = (tournament) => {
    return tournament.ownerMail === userEmail
  }

  // Check if tournament is full
  const isTournamentFull = (tournament) => {
    return (tournament.listOfUserEmailJoined?.length || 0) >= (tournament.playersRequired || Infinity)
  }

  // Pagination
  const totalPages = Math.ceil(filteredTournaments.length / pageSize) || 1
  const startIndex = (currentPage - 1) * pageSize
  const currentTournaments = filteredTournaments.slice(startIndex, startIndex + pageSize)

  const handleProfileClick = () => navigate('/dashboard/profile')

  return (
    <div className={`${styles.page} ${isVisible ? styles.fadeIn : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>QuickCourt</h1>
          </div>

          <nav className={styles.nav}>
            <ul>
              <li><a href="/dashboard">Home</a></li>
              <li><a href="/dashboard/venues">Venues</a></li>
              <li><a href="/dashboard/tournaments" className={styles.active}>Tournaments</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

          <div className={styles.headerActions}>
            <div className={styles.search}>
              <input
                type="search"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button">🔍</button>
            </div>
            <button className={styles.profileBtn} onClick={handleProfileClick}>
              <div className={styles.avatarInitials}>
                {getInitials(userName)}
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Join Exciting Tournaments</h1>
            <p>
              Discover and participate in sports tournaments happening near you. 
              Connect with fellow athletes and compete in your favorite sports.
            </p>
          </div>
        </section>

        {/* Message Display */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Tournaments Section */}
        <section className={styles.tournamentsSection}>
          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            <button 
              className={`${styles.tabButton} ${activeTab === "available" ? styles.active : ""}`}
              onClick={() => setActiveTab("available")}
            >
              Available Tournaments
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              My Tournament Profile
            </button>
          </div>

          {activeTab === "available" ? (
            <>
              <div className={styles.sectionHeader}>
                <h2>Available Tournaments</h2>
                <p>{filteredTournaments.length} tournaments found</p>
              </div>

              {loading ? (
                <div className={styles.loadingContainer}>
                  <Loader2 size={40} className={styles.spinning} />
                  <p>Loading tournaments...</p>
                </div>
              ) : filteredTournaments.length === 0 ? (
                <div className={styles.noResults}>
                  <Trophy size={48} />
                  <h3>No tournaments found</h3>
                  <p>Check back later for new tournaments or try different search terms.</p>
                </div>
              ) : (
                <>
                  <div className={styles.tournamentsGrid}>
                    {currentTournaments.map((tournament) => (
                      <div key={tournament.id} className={styles.tournamentCard}>
                        <div className={styles.cardHeader}>
                          <h3>{tournament.gameName}</h3>
                          <span className={styles.sportBadge}>{tournament.gameName}</span>
                        </div>
                        
                        <div className={styles.cardBody}>
                          <div className={styles.detailRow}>
                            <MapPin size={16} />
                            <span>{tournament.location}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span>📍</span>
                            <span>{tournament.venue}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <Calendar size={16} />
                            <span>{formatDate(tournament.timeDate)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <Clock size={16} />
                            <span>{formatTime(tournament.timeDate)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <Users size={16} />
                            <span>
                              {tournament.listOfUserEmailJoined?.length || 0}/{tournament.playersRequired} players
                            </span>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          {hasUserJoined(tournament) ? (
                            <button 
                              className={styles.leaveBtn}
                              onClick={() => leaveTournament(tournament.id)}
                              disabled={leavingTournament === tournament.id || isUserOwner(tournament)}
                            >
                              {leavingTournament === tournament.id ? (
                                <>
                                  <Loader2 size={16} className={styles.spinning} />
                                  Leaving...
                                </>
                              ) : isUserOwner(tournament) ? (
                                <>
                                  <Trophy size={16} />
                                  Owner
                                </>
                              ) : (
                                <>
                                  <UserMinus size={16} />
                                  Leave
                                </>
                              )}
                            </button>
                          ) : (
                            <button 
                              className={styles.joinBtn}
                              onClick={() => joinTournament(tournament.id)}
                              disabled={joiningTournament === tournament.id || isTournamentFull(tournament)}
                            >
                              {joiningTournament === tournament.id ? (
                                <>
                                  <Loader2 size={16} className={styles.spinning} />
                                  Joining...
                                </>
                              ) : (
                                <>
                                  <UserPlus size={16} />
                                  {isTournamentFull(tournament) ? 'Full' : 'Join'}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span>{currentPage} of {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Tournament Profile Tab */
            <>
              <div className={styles.sectionHeader}>
                <h2>My Tournament Profile</h2>
                <p>Your tournament statistics, joined games, and owned tournaments</p>
              </div>

              {profileLoading ? (
                <div className={styles.loadingContainer}>
                  <Loader2 size={40} className={styles.spinning} />
                  <p>Loading profile data...</p>
                </div>
              ) : (
                <>
                  {/* Profile Stats */}
                  <div className={styles.profileStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Trophy size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>{profileStats.totalJoined}</h3>
                        <p>Total Joined</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Calendar size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>{profileStats.upcomingGames}</h3>
                        <p>Upcoming</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Users size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>{profileStats.completedGames}</h3>
                        <p>Completed</p>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <MapPin size={24} />
                      </div>
                      <div className={styles.statInfo}>
                        <h3>{profileStats.favoriteVenue}</h3>
                        <p>Favorite Venue</p>
                      </div>
                    </div>
                  </div>

                  {/* Joined Tournaments */}
                  <div className={styles.joinedTournaments}>
                    <h3>My Tournaments ({joinedTournaments.length})</h3>
                    
                    {joinedTournaments.length === 0 ? (
                      <div className={styles.noResults}>
                        <Trophy size={48} />
                        <h3>No tournaments joined yet</h3>
                        <p>Start joining tournaments to build your profile!</p>
                      </div>
                    ) : (
                      <div className={styles.tournamentsGrid}>
                        {joinedTournaments.map((tournament) => {
                          const isUpcoming = new Date(tournament.timeDate) > new Date()
                          return (
                            <div key={tournament.id} className={`${styles.tournamentCard} ${styles.joinedCard}`}>
                              <div className={styles.cardHeader}>
                                <h3>{tournament.gameName}</h3>
                                <div className={styles.badgeContainer}>
                                  {tournament.isOwned && (
                                    <span className={`${styles.sportBadge} ${styles.ownerBadge}`}>
                                      <Trophy size={12} />
                                      Owner
                                    </span>
                                  )}
                                  <span className={`${styles.sportBadge} ${isUpcoming ? styles.upcoming : styles.completed}`}>
                                    {isUpcoming ? 'Upcoming' : 'Completed'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className={styles.cardBody}>
                                <div className={styles.detailRow}>
                                  <MapPin size={16} />
                                  <span>{tournament.location}</span>
                                </div>
                                <div className={styles.detailRow}>
                                  <span>📍</span>
                                  <span>{tournament.venue}</span>
                                </div>
                                <div className={styles.detailRow}>
                                  <Calendar size={16} />
                                  <span>{formatDate(tournament.timeDate)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                  <Clock size={16} />
                                  <span>{formatTime(tournament.timeDate)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                  <Users size={16} />
                                  <span>
                                    {tournament.listOfUserEmailJoined?.length || 0}/{tournament.playersRequired} players
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>QuickCourt</h3>
            <p>Your premier destination for sports tournaments and venue booking.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/dashboard/venues">Find Venues</a></li>
              <li><a href="/dashboard/tournaments">Join Tournaments</a></li>
              <li><a href="#about">About Us</a></li>
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
