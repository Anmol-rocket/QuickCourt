import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { 
  IndianRupee, 
  Loader2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  AlertCircle, 
  HelpCircle,
  Trash2
} from "lucide-react"
import styles from "./ProfilePage.module.css"
import BASE_URL from "../../api/baseURL"
import Receipt from "../../components/Receipt"

// Helper functions
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatTime = (timeStr) => {
  return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

// Generate initials from name
const getInitials = (name) => {
  if (!name) return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

const isPast = (dateStr, endTime) => {
  const bookingEnd = new Date(`${dateStr}T${endTime}`)
  return bookingEnd < new Date()
}

const getPageNumbers = (current, total, maxButtons = 5) => {
  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  const halfMax = Math.floor(maxButtons / 2)

  pages.push(1)

  const start = Math.max(2, current - halfMax + 1)
  const end = Math.min(total - 1, current + halfMax - 1)

  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push("...")
  if (total > 1) pages.push(total)

  return pages
}

// Mock data
const defaultUser = {
  name: "Mitchell Admin",
  email: "mitchelladmin047@gmail.com",
}

const mockBookings = [
  {
    id: 1,
    venueName: "Skyline Badminton Court",
    sport: "Badminton",
    date: "2024-06-18",
    startTime: "17:00",
    endTime: "18:00",
    location: "Rajkot, Gujarat",
    status: "Confirmed",
    indoor: true,
    price: 25,
    rating: null,
  },
  {
    id: 2,
    venueName: "Downtown Tennis Club",
    sport: "Tennis",
    date: "2024-06-20",
    startTime: "14:00",
    endTime: "15:30",
    location: "Downtown",
    status: "Confirmed",
    outdoor: true,
    price: 30,
    rating: null,
  },
  {
    id: 3,
    venueName: "City Basketball Arena",
    sport: "Basketball",
    date: "2024-05-15",
    startTime: "19:00",
    endTime: "20:00",
    location: "City Center",
    status: "Past",
    indoor: true,
    price: 20,
    rating: 4,
  },
  {
    id: 4,
    venueName: "Riverside Soccer Field",
    sport: "Soccer",
    date: "2024-05-10",
    startTime: "16:00",
    endTime: "17:30",
    location: "Riverside",
    status: "Cancelled",
    outdoor: true,
    price: 40,
    rating: null,
  },
  {
    id: 5,
    venueName: "Elite Fitness Complex",
    sport: "Volleyball",
    date: "2024-06-25",
    startTime: "18:00",
    endTime: "19:00",
    location: "Uptown",
    status: "Confirmed",
    indoor: true,
    price: 35,
    rating: null,
  },
  {
    id: 6,
    venueName: "Metro Swimming Pool",
    sport: "Swimming",
    date: "2024-05-08",
    startTime: "07:00",
    endTime: "08:00",
    location: "Metro",
    status: "Past",
    indoor: true,
    price: 28,
    rating: 5,
  },
]

export default function ProfilePage({
  user = defaultUser,
  onLogout = () => console.log("Logout"),
  onBookClick = (bookingId) => console.log("Book:", bookingId),
  pageSize = 4,
}) {
  // State management
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [activeNav, setActiveNav] = useState("bookings")
  const [currentPage, setCurrentPage] = useState(1)
  const [bookings, setBookings] = useState(mockBookings)
  const [userData, setUserData] = useState(user)
  const [showCancelModal, setShowCancelModal] = useState(null)
  const [reviewingBooking, setReviewingBooking] = useState(null)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' })
  const [showPassword, setShowPassword] = useState({ old: false, new: false })
  const [showLogoutToast, setShowLogoutToast] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' })
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
  const [userDataError, setUserDataError] = useState('')
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [bookingsError, setBookingsError] = useState('')
  const [showReceipt, setShowReceipt] = useState(null)
  const [refundStatus, setRefundStatus] = useState({}) // Store refund status for each booking
  const [loadingRefund, setLoadingRefund] = useState({}) // Track loading state for refund checks
  const [showTournamentModal, setShowTournamentModal] = useState(null) // Track which booking's tournament modal is open
  const [tournamentData, setTournamentData] = useState({
    gameName: '',
    playersRequired: ''
  })
  const [creatingTournament, setCreatingTournament] = useState(false)
  const [tournamentStatus, setTournamentStatus] = useState({}) // Track tournament status for each booking
  const [joinedTournaments, setJoinedTournaments] = useState([]) // Store joined tournaments
  const [loadingJoinedTournaments, setLoadingJoinedTournaments] = useState(true)
  const [userGameProfile, setUserGameProfile] = useState(null)
  const [deletingTournament, setDeletingTournament] = useState(null)
  const [tournamentMessage, setTournamentMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    oldPassword: "",
    newPassword: "",
  })

  // Refs
  const bookingsListRef = useRef(null)
  const modalRef = useRef(null)

  // Navigation
  const navigate = useNavigate()

  // Handler functions
  const handleBookVenueClick = () => {
    navigate('/dashboard/venues')
  }

  // Tournament creation functions
  const handleCreateTournament = (booking) => {
    setShowTournamentModal(booking.id)
    setTournamentData({
      gameName: '',
      playersRequired: ''
    })
    setTournamentMessage({ type: '', text: '' })
  }

  // Function to fetch tournament data by game ID
  const fetchTournamentData = async (gameId) => {
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
        const tournamentData = await response.json()
        const playersJoined = tournamentData.listOfUserEmailJoined ? tournamentData.listOfUserEmailJoined.length : 0
        // Add 1 for the creator who created the tournament
        const totalPlayersJoined = playersJoined + 1
        return {
          tournamentId: tournamentData.id,
          gameName: tournamentData.gameName,
          playersRequired: tournamentData.playersRequired,
          playersJoined: totalPlayersJoined,
          created: true
        }
      } else {
        console.error('Failed to fetch tournament data:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error fetching tournament data:', error)
      return null
    }
  }

  const handleTournamentSubmit = async (e) => {
    e.preventDefault()
    
    if (!tournamentData.gameName.trim() || !tournamentData.playersRequired) {
      return
    }

    const booking = bookings.find(b => b.id === showTournamentModal)
    if (!booking) return

    setCreatingTournament(true)
    setTournamentMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem("token")
      const userEmail = localStorage.getItem("email")
      
      // Prepare tournament data
      const tournamentPayload = {
        gameName: tournamentData.gameName.trim(),
        location: booking.location,
        venue: booking.venueName,
        userEmail: userEmail,
        timeDate: `${booking.date}T${booking.startTime}:00`,
        playersRequired: parseInt(tournamentData.playersRequired)
      }

      const response = await fetch(`${BASE_URL}/api/games`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tournamentPayload)
      })

      if (response.ok) {
        const responseData = await response.json()
        const tournamentId = responseData.id || responseData.gameId || Date.now()
        
        // Fetch the actual tournament data to get current player count
        const actualTournamentData = await fetchTournamentData(tournamentId)
        
        if (actualTournamentData) {
          // Store tournament status for this booking with actual data
          setTournamentStatus(prev => ({
            ...prev,
            [booking.id]: actualTournamentData
          }))
          
          // Store tournament ID in localStorage for persistence
          const existingTournaments = JSON.parse(localStorage.getItem('bookingTournaments') || '{}')
          existingTournaments[booking.id] = tournamentId
          localStorage.setItem('bookingTournaments', JSON.stringify(existingTournaments))
        } else {
          // Fallback to basic data if fetch fails - creator counts as first player
          setTournamentStatus(prev => ({
            ...prev,
            [booking.id]: {
              tournamentId: tournamentId,
              gameName: tournamentData.gameName,
              playersRequired: parseInt(tournamentData.playersRequired),
              playersJoined: 1, // Creator is automatically first player
              created: true
            }
          }))
        }
        
        // Reset form after short delay
        setTimeout(() => {
          setShowTournamentModal(null)
          setTournamentData({ gameName: '', playersRequired: '' })
        }, 2000)
      } else {
        const errorData = await response.text()
        console.error('Failed to create tournament:', errorData)
      }
    } catch (error) {
      console.error('Error creating tournament:', error)
    } finally {
      setCreatingTournament(false)
    }
  }

  const handleCloseTournamentModal = () => {
    setShowTournamentModal(null)
    setTournamentData({ gameName: '', playersRequired: '' })
    setTournamentMessage({ type: '', text: '' })
  }

  // Function to load existing tournaments for current bookings
  const loadExistingTournaments = async () => {
    try {
      const existingTournaments = JSON.parse(localStorage.getItem('bookingTournaments') || '{}')
      const tournamentStatusUpdates = {}
      
      // Fetch tournament data for each stored tournament
      for (const [bookingId, tournamentId] of Object.entries(existingTournaments)) {
        const tournamentData = await fetchTournamentData(tournamentId)
        if (tournamentData) {
          tournamentStatusUpdates[bookingId] = tournamentData
        }
      }
      
      if (Object.keys(tournamentStatusUpdates).length > 0) {
        setTournamentStatus(tournamentStatusUpdates)
      }
    } catch (error) {
      console.error('Error loading existing tournaments:', error)
    }
  }

  // Function to refresh tournament player counts
  const refreshTournamentCounts = async () => {
    try {
      const existingTournaments = JSON.parse(localStorage.getItem('bookingTournaments') || '{}')
      const updates = {}
      
      for (const [bookingId, tournamentId] of Object.entries(existingTournaments)) {
        const tournamentData = await fetchTournamentData(tournamentId)
        if (tournamentData) {
          updates[bookingId] = tournamentData
        }
      }
      
      if (Object.keys(updates).length > 0) {
        setTournamentStatus(prev => ({ ...prev, ...updates }))
      }
    } catch (error) {
      console.error('Error refreshing tournament counts:', error)
    }
  }

  // Function to fetch user game profile
  const fetchUserGameProfile = async () => {
    try {
      const userEmail = localStorage.getItem("email")
      if (!userEmail) return null

      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/user-profiles/${encodeURIComponent(userEmail)}`, {
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
        const createResponse = await fetch(`${BASE_URL}/api/user-profiles/${encodeURIComponent(userEmail)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (createResponse.ok) {
          return await createResponse.json()
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching user game profile:', error)
      return null
    }
  }

  // Function to fetch tournament details by ID
  const fetchTournamentById = async (tournamentId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/games/${tournamentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error fetching tournament details:', error)
      return null
    }
  }

  // Function to load joined tournaments
  const loadJoinedTournaments = async () => {
    setLoadingJoinedTournaments(true)
    try {
      const profile = await fetchUserGameProfile()
      setUserGameProfile(profile)
      
      if (profile && profile.idsOfGamesJoined && profile.idsOfGamesJoined.length > 0) {
        const tournamentPromises = profile.idsOfGamesJoined.map(id => fetchTournamentById(id))
        const tournaments = await Promise.all(tournamentPromises)
        const validTournaments = tournaments.filter(t => t !== null)
        setJoinedTournaments(validTournaments)
      } else {
        setJoinedTournaments([])
      }
    } catch (error) {
      console.error('Error loading joined tournaments:', error)
      setJoinedTournaments([])
    } finally {
      setLoadingJoinedTournaments(false)
    }
  }

  // Function to delete tournament
  const deleteTournament = async (bookingId, tournamentId) => {
    setDeletingTournament(bookingId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/games/${tournamentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove tournament from localStorage
        const existingTournaments = JSON.parse(localStorage.getItem('bookingTournaments') || '{}')
        delete existingTournaments[bookingId]
        localStorage.setItem('bookingTournaments', JSON.stringify(existingTournaments))
        
        // Remove tournament from state
        setTournamentStatus(prev => {
          const newStatus = { ...prev }
          delete newStatus[bookingId]
          return newStatus
        })
        
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error deleting tournament:', error)
      return false
    } finally {
      setDeletingTournament(null)
    }
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "cancelled") return booking.status === "Cancelled"
    return true
  })

  // Add computed properties to bookings
  const enrichedBookings = filteredBookings.map((booking) => ({
    ...booking,
    canCancel: booking.status === "Confirmed" && !isPast(booking.date, booking.endTime),
    canReview: booking.status === "Past" && !booking.rating,
  }))

  // Pagination
  const totalPages = Math.ceil(enrichedBookings.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentBookings = enrichedBookings.slice(startIndex, startIndex + pageSize)
  const showingStart = startIndex + 1
  const showingEnd = Math.min(startIndex + pageSize, enrichedBookings.length)

  // Fetch user data from API
  const fetchUserData = async () => {
    setIsLoadingUserData(true)
    setUserDataError('')

    try {
      const token = localStorage.getItem("token")
      
      // Get email from localStorage
      const userEmail = localStorage.getItem("email")
      
      if (!userEmail) {
        setUserDataError('No user email found. Please login again.')
        setIsLoadingUserData(false)
        return
      }
      
      const response = await fetch(`${BASE_URL}/data/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        try {
          const responseText = await response.text()
          if (responseText) {
            const userData = JSON.parse(responseText)
            
            // Update user data state
            setUserData({
              name: userData.fullName || userData.name || "Guest",
              email: userData.email,
              role: userData.role,
              verified: userData.verified
            })

            // Update form data with fetched user data
            setFormData({
              name: userData.fullName || userData.name || "",
              email: userData.email || "",
              oldPassword: "",
              newPassword: "",
            })
          } else {
            setUserDataError('Empty response from server.')
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          setUserDataError('Invalid response format from server.')
        }

      } else if (response.status === 500) {
        setUserDataError('User not found. Please check your login status.')
        console.error('User not found or server error')
      } else {
        setUserDataError('Failed to load user data. Please try again.')
        console.error('Failed to fetch user data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUserDataError('Network error. Please check your connection.')
    } finally {
      setIsLoadingUserData(false)
    }
  }

  // Helper function to fetch venue details by ID
  const fetchVenueDetails = async (venueId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/venues/${venueId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const venue = await response.json()
        return {
          name: venue.name,
          address: venue.address,
          rating: venue.rating
        }
      } else {
        console.warn(`Failed to fetch venue ${venueId}:`, response.status)
        return {
          name: `Venue ${venueId}`,
          address: "Location TBD",
          rating: null
        }
      }
    } catch (error) {
      console.warn(`Error fetching venue ${venueId}:`, error)
      return {
        name: `Venue ${venueId}`,
        address: "Location TBD",
        rating: null
      }
    }
  }

  // Helper function to fetch sport details by venueId and sportId
  const fetchSportDetails = async (venueId, sportId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sports/venue/${venueId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const sports = await response.json()
        const sport = sports.find(s => s.id === sportId)
        
        if (sport) {
          return {
            name: sport.name,
            type: sport.type,
            pricePerHour: sport.pricePerHour,
            operatingHours: sport.operatingHours,
            averageRating: sport.averageRating
          }
        } else {
          console.warn(`Sport ${sportId} not found in venue ${venueId}`)
          return {
            name: `Sport ${sportId}`,
            type: "Unknown",
            pricePerHour: 0,
            operatingHours: "N/A",
            averageRating: 0
          }
        }
      } else {
        console.warn(`Failed to fetch sports for venue ${venueId}:`, response.status)
        return {
          name: `Sport ${sportId}`,
          type: "Unknown",
          pricePerHour: 0,
          operatingHours: "N/A",
          averageRating: 0
        }
      }
    } catch (error) {
      console.warn(`Error fetching sports for venue ${venueId}:`, error)
      return {
        name: `Sport ${sportId}`,
        type: "Unknown",
        pricePerHour: 0,
        operatingHours: "N/A",
        averageRating: 0
      }
    }
  }

  // Fetch user bookings from API
  const fetchUserBookings = async () => {
    setIsLoadingBookings(true)
    setBookingsError('')

    try {
      const token = localStorage.getItem("token")
      const userEmail = localStorage.getItem("email")
      
      if (!userEmail) {
        setBookingsError('No user email found. Please login again.')
        setIsLoadingBookings(false)
        return
      }
      
      const response = await fetch(`${BASE_URL}/api/bookings/user/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const bookingsData = await response.json()
        
        // Transform API data to match the existing booking format
        const transformedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const slot = booking.slots[0] // Assuming one slot per booking for now
            const startDateTime = new Date(slot.startDateTime)
            const endDateTime = new Date(slot.endDateTime)
            
            // Fetch venue and sport details concurrently
            const [venueDetails, sportDetails] = await Promise.all([
              fetchVenueDetails(booking.venueId, token),
              fetchSportDetails(booking.venueId, booking.sportId, token)
            ])
            
            return {
              id: booking.id,
              venueId: booking.venueId,
              sportId: booking.sportId,
              venueName: venueDetails.name,
              sport: sportDetails.name,
              sportType: sportDetails.type,
              sportPricePerHour: sportDetails.pricePerHour,
              sportOperatingHours: sportDetails.operatingHours,
              sportRating: sportDetails.averageRating,
              date: startDateTime.toISOString().split('T')[0], // Format: YYYY-MM-DD
              startTime: startDateTime.toTimeString().slice(0, 5), // Format: HH:MM
              endTime: endDateTime.toTimeString().slice(0, 5), // Format: HH:MM
              location: venueDetails.address,
              status: booking.status === "CONFIRMED" ? "Confirmed" : booking.status,
              price: booking.totalPrice,
              rating: null, // Add rating logic if available
              venueRating: venueDetails.rating,
              facilityOwnerEmail: booking.facilityOwnerEmail,
              userEmail: booking.userEmail,
              createdAt: booking.createdAt,
              // Add computed properties
              canCancel: booking.status === "CONFIRMED" && new Date(slot.endDateTime) > new Date(),
              canReview: booking.status === "PAST" || (new Date(slot.endDateTime) < new Date() && booking.status === "CONFIRMED"),
            }
          })
        )
        
        setBookings(transformedBookings)
      } else if (response.status === 404) {
        // No bookings found - this is normal
        setBookings([])
      } else {
        setBookingsError('Failed to load bookings. Please try again.')
        console.error('Failed to fetch bookings:', response.status)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookingsError('Network error. Please check your connection.')
    } finally {
      setIsLoadingBookings(false)
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      bookingsListRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/bookings/cancelBooking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state to reflect cancellation
        setBookings((prev) =>
          prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking)),
        );
        setShowCancelModal(null);
        // You can add a success notification here if needed
        console.log('Booking cancelled successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to cancel booking:', errorData.message || 'Unknown error');
        // You can add error notification here if needed
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      // You can add error notification here if needed
    }
  }

  // Handle refund status check
  const handleCheckRefundStatus = async (booking) => {
    try {
      setLoadingRefund(prev => ({ ...prev, [booking.id]: true }));
      
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail') || userData.email;
      
      const apiUrl = `${BASE_URL}/api/refunds/user?userEmail=${userEmail}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const refundData = await response.json();
        
        // Handle both array and single object responses
        const refunds = Array.isArray(refundData) ? refundData : [refundData];
        
        // Find refund entry that matches this booking's amount and booking ID
        const matchingRefund = refunds.find(refund => 
          refund && 
          parseFloat(refund.amount) === parseFloat(booking.price) && 
          refund.bookingId === booking.id
        );
        
        if (matchingRefund) {
          setRefundStatus(prev => ({
            ...prev,
            [booking.id]: {
              status: matchingRefund.status,
              amount: matchingRefund.amount,
              id: matchingRefund.id
            }
          }));
        } else {
          setRefundStatus(prev => ({
            ...prev,
            [booking.id]: {
              status: 'not_found',
              amount: booking.price,
              id: null
            }
          }));
        }
      } else {
        setRefundStatus(prev => ({
          ...prev,
          [booking.id]: {
            status: 'error',
            amount: booking.price,
            id: null
          }
        }));
      }
    } catch (error) {
      setRefundStatus(prev => ({
        ...prev,
        [booking.id]: {
          status: 'error',
          amount: booking.price,
          id: null
        }
      }));
    } finally {
      setLoadingRefund(prev => ({ ...prev, [booking.id]: false }));
    }
  }

  // Handle review submission
  const handleSubmitReview = async (bookingId) => {
    if (!reviewText.trim()) {
      setReviewMessage({ type: 'error', text: 'Please enter a review comment' })
      return
    }

    setSubmittingReview(true)
    setReviewMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem("token")
      const authorEmail = localStorage.getItem("email")
      const booking = bookings.find(b => b.id === bookingId)
      
      if (!booking) {
        setReviewMessage({ type: 'error', text: 'Booking not found' })
        return
      }

      const reviewPayload = {
        text: reviewText.trim(),
        authorEmail: authorEmail,
        rating: reviewRating,
        sportId: booking.sportId // Get sportId from booking
      }

      const response = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewPayload)
      })

      if (response.ok) {
        const reviewData = await response.json()
        
        // Update booking with review data
        setBookings((prev) =>
          prev.map((booking) => 
            booking.id === bookingId 
              ? { ...booking, rating: reviewRating, reviewId: reviewData.id, reviewText: reviewText } 
              : booking
          )
        )
        
        setReviewMessage({ type: 'success', text: 'Review submitted successfully!' })
        
        // Reset review form after a short delay
        setTimeout(() => {
          setReviewingBooking(null)
          setReviewText("")
          setReviewRating(5)
          setReviewMessage({ type: '', text: '' })
        }, 2000)
        
      } else {
        const errorData = await response.text()
        console.error('Failed to submit review:', errorData)
        setReviewMessage({ type: 'error', text: 'Failed to submit review. Please try again.' })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setReviewMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSubmittingReview(false)
    }
  }

  // Handle showing receipt
  const handleShowReceipt = (booking) => {
    // Create mock payment data for the receipt
    const paymentData = {
      paymentIntent: {
        id: `pi_${booking.id}_${Date.now()}`,
        amount: booking.price * 100, // Convert to cents
        currency: 'inr',
        status: 'succeeded',
        created: new Date(booking.date).getTime()
      }
    }

    const bookingDetails = {
      venueName: booking.venueName,
      sportName: booking.sport,
      courtName: `Court ${booking.id}`,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      timeSlot: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
      duration: '1 hour',
      userName: userData.name,
      location: booking.location
    }

    setShowReceipt({ paymentData, bookingDetails })
  }

  // Handle form submission
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.includes("@")) {
      setUpdateMessage({ type: 'error', text: 'Please provide valid name and email' })
      return
    }

    setIsUpdating(true)
    setUpdateMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem("token")
      
      // Prepare the update payload
      const updatePayload = {
        email: formData.email,
        fullName: formData.name,
        avatarUrl: userData.avatarUrl || "https://via.placeholder.com/120x120/48A6A7/ffffff?text=" + formData.name.charAt(0),
        role: "ROLE_USER",
        verified: false
      }

      // Only include password if new password is provided
      if (formData.newPassword.trim()) {
        if (!formData.oldPassword.trim()) {
          setUpdateMessage({ type: 'error', text: 'Current password is required to set new password' })
          setIsUpdating(false)
          return
        }
        // In a real app, you'd validate the old password first
        updatePayload.password = formData.newPassword // Note: This should be hashed on the backend
      }

      const response = await fetch(`${BASE_URL}/updateRegistration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      })

      if (response.ok) {
        // Try to parse JSON response, but handle cases where there might be no response body
        let updatedUser = null
        try {
          const responseText = await response.text()
          if (responseText) {
            updatedUser = JSON.parse(responseText)
          }
        } catch (parseError) {
          console.log('No JSON response body, but update was successful')
        }
        
        // Update local state
        setUserData((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
        }))

        // Clear password fields
        setFormData(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: ''
        }))

        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        // Handle error responses more carefully
        let errorMessage = 'Failed to update profile. Please try again.'
        try {
          const responseText = await response.text()
          if (responseText) {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.message || errorMessage
          }
        } catch (parseError) {
          // If we can't parse the error response, use the HTTP status
          errorMessage = `Update failed with status ${response.status}. Please try again.`
        }
        
        setUpdateMessage({ 
          type: 'error', 
          text: errorMessage
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setUpdateMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutToast(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutToast(false)
    
    // Clear authentication data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("userRole")
    
    // Navigate to landing page
    navigate("/")
  }

  const handleLogoutCancel = () => {
    setShowLogoutToast(false)
  }

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch user data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchUserData()
      await fetchUserBookings()
      // Load existing tournaments after bookings are loaded
      await loadExistingTournaments()
      // Load joined tournaments
      await loadJoinedTournaments()
    }
    
    initializeData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Clear update message after 5 seconds
  useEffect(() => {
    if (updateMessage.text) {
      const timer = setTimeout(() => {
        setUpdateMessage({ type: '', text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [updateMessage])

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowCancelModal(null)
        setReviewingBooking(null)
        setShowLogoutToast(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <div className={`${styles.page} ${isVisible ? styles.fadeIn : ""}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>QuickCourt</h1>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.bookBtn} onClick={handleBookVenueClick}>
              <span>📅</span>
              Book Venue
            </button>

            <div className={styles.profileMenu}>
              <div className={styles.avatarInitials}>
                {getInitials(userData.name)}
              </div>
              <span className={styles.userName}>{userData.name}</span>
              <button onClick={handleLogoutClick} className={styles.logoutBtn} aria-label="Logout">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              {isLoadingUserData ? (
                <div className={styles.loadingProfile}>
                  <div className={styles.spinner}></div>
                  <p>Loading profile...</p>
                </div>
              ) : userDataError ? (
                <div className={styles.errorProfile}>
                  <p>❌ {userDataError}</p>
                  <button onClick={fetchUserData} className={styles.retryBtn}>
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatarInitialsLarge}>
                      {getInitials(userData.name)}
                    </div>
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>{userData.name}</h3>
                    <p className={styles.email}>{userData.email}</p>
                  </div>
                </>
              )}
            </div>

            <nav className={styles.navigation}>
              <button
                className={`${styles.navBtn} ${activeNav === "bookings" ? styles.navActive : ""}`}
                onClick={() => setActiveNav("bookings")}
              >
                <span className={styles.navIcon}>📋</span>
                My Bookings
              </button>
              <button
                className={`${styles.navBtn} ${activeNav === "tournaments" ? styles.navActive : ""}`}
                onClick={() => navigate('/dashboard/tournaments')}
              >
                <span className={styles.navIcon}>🏆</span>
                My Tournaments
              </button>
              <button
                className={`${styles.navBtn} ${activeNav === "profile" ? styles.navActive : ""}`}
                onClick={() => setActiveNav("profile")}
              >
                <span className={styles.navIcon}>👤</span>
                Edit Profile
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={styles.content}>
            {activeNav === "bookings" && (
              <div className={styles.bookingsSection}>
                <div className={styles.sectionHeader}>
                  <h2>My Bookings</h2>
                  <div className={styles.tabs}>
                    <button
                      className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Bookings
                    </button>
                    <button
                      className={`${styles.tab} ${activeTab === "cancelled" ? styles.tabActive : ""}`}
                      onClick={() => setActiveTab("cancelled")}
                    >
                      Cancelled
                    </button>
                  </div>
                </div>

                <div className={styles.bookingsList} ref={bookingsListRef}>
                  <div className={styles.bookingsHeader}>
                    <p className={styles.bookingsCount}>
                      {enrichedBookings.length} booking{enrichedBookings.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className={styles.bookingsGrid}>
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className={styles.bookingCard}>
                        <div className={styles.cardHeader}>
                          <div className={styles.venueInfo}>
                            <h4>{booking.venueName}</h4>
                            <p className={styles.sport}>{booking.sport}</p>
                          </div>
                          <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className={styles.bookingDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📅</span>
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>🕐</span>
                            <span>
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📍</span>
                            <span>{booking.location}</span>
                          </div>
                          {booking.price && (
                            <div className={styles.detailRow}>
                              <span className={styles.detailIcon}>💰</span>
                              <span className={styles.price}>₹{booking.price}</span>
                            </div>
                          )}
                        </div>

                        {(booking.indoor || booking.outdoor) && (
                          <div className={styles.tags}>
                            {booking.indoor && <span className={styles.tag}>Indoor</span>}
                            {booking.outdoor && <span className={styles.tag}>Outdoor</span>}
                          </div>
                        )}

                        <div className={styles.cardActions}>
                          {booking.canCancel && (
                            <button className={styles.cancelBtn} onClick={() => setShowCancelModal(booking.id)}>
                              Cancel
                            </button>
                          )}
                          {booking.canReview && (
                            <button className={styles.reviewBtn} onClick={() => setReviewingBooking(booking.id)}>
                              Review
                            </button>
                          )}
                          {booking.status !== "Cancelled" && !tournamentStatus[booking.id] && (
                            <button 
                              className={styles.tournamentBtn} 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleCreateTournament(booking)
                              }}
                              type="button"
                            >
                              🏆 Create Tournament
                            </button>
                          )}
                          {booking.status !== "Cancelled" && tournamentStatus[booking.id] && (
                            <div className={styles.tournamentStatus}>
                              <div className={styles.tournamentInfo}>
                                <span className={styles.tournamentName}>
                                  🏆 {tournamentStatus[booking.id].gameName}
                                </span>
                                <span className={styles.tournamentPlayers}>
                                  {tournamentStatus[booking.id].playersJoined}/{tournamentStatus[booking.id].playersRequired} players
                                </span>
                              </div>
                              <div className={styles.tournamentActions}>
                                <button 
                                  className={styles.refreshBtn}
                                  onClick={() => refreshTournamentCounts()}
                                  title="Refresh player count"
                                  disabled={deletingTournament === booking.id}
                                >
                                  🔄
                                </button>
                                <button
                                  onClick={() => {
                                    const tournament = tournamentStatus[booking.id]
                                    if (tournament) {
                                      deleteTournament(booking.id, tournament.tournamentId)
                                    }
                                  }}
                                  className={styles.deleteButton}
                                  disabled={deletingTournament === booking.id}
                                  title="Delete Tournament"
                                >
                                  {deletingTournament === booking.id ? (
                                    <div className={styles.spinner}></div>
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                          {booking.status === "Cancelled" && (
                            <button 
                              className={styles.refundBtn} 
                              onClick={() => handleCheckRefundStatus(booking)}
                              disabled={loadingRefund[booking.id]}
                            >
                              {loadingRefund[booking.id] ? (
                                <>
                                  <Loader2 size={16} className={styles.spinning} />
                                  Checking...
                                </>
                              ) : (
                                <>
                                  <IndianRupee size={16} />
                                  Check Refund
                                </>
                              )}
                            </button>
                          )}
                          <button className={styles.receiptBtn} onClick={() => handleShowReceipt(booking)}>
                            📄 Receipt
                          </button>
                          {/* <button className={styles.detailsBtn} onClick={() => onBookClick(booking.id)}>
                            Details
                          </button> */}
                        </div>

                        {/* Refund Status Display */}
                        {booking.status === "Cancelled" && refundStatus[booking.id] && (
                          <div className={styles.refundStatus}>
                            <div className={styles.refundInfo}>
                              <span className={styles.refundLabel}>Refund Status:</span>
                              <span className={`${styles.refundStatusBadge} ${styles[refundStatus[booking.id].status.toLowerCase()]}`}>
                                {refundStatus[booking.id].status === 'pending' && (
                                  <>
                                    <Clock size={14} />
                                    Pending
                                  </>
                                )}
                                {refundStatus[booking.id].status === 'approved' && (
                                  <>
                                    <CheckCircle size={14} />
                                    Approved
                                  </>
                                )}
                                {refundStatus[booking.id].status === 'rejected' && (
                                  <>
                                    <XCircle size={14} />
                                    Rejected
                                  </>
                                )}
                                {refundStatus[booking.id].status === 'processed' && (
                                  <>
                                    <CreditCard size={14} />
                                    Processed
                                  </>
                                )}
                                {refundStatus[booking.id].status === 'not_found' && (
                                  <>
                                    <HelpCircle size={14} />
                                    No Refund Request
                                  </>
                                )}
                                {refundStatus[booking.id].status === 'error' && (
                                  <>
                                    <AlertCircle size={14} />
                                    Error
                                  </>
                                )}
                              </span>
                            </div>
                            {refundStatus[booking.id].amount && (
                              <div className={styles.refundAmount}>
                                <IndianRupee size={14} />
                                Amount: ₹{refundStatus[booking.id].amount}
                              </div>
                            )}
                          </div>
                        )}

                        {reviewingBooking === booking.id && (
                          <div className={styles.reviewForm}>
                            <div className={styles.starRating}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  className={star <= reviewRating ? styles.starActive : styles.star}
                                  onClick={() => setReviewRating(star)}
                                  aria-label={`${star} stars`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Share your experience..."
                              rows="3"
                              className={styles.reviewTextarea}
                            />
                            <div className={styles.reviewActions}>
                              <button className={styles.reviewCancel} onClick={() => setReviewingBooking(null)}>
                                Cancel
                              </button>
                              <button className={styles.reviewSubmit} onClick={() => handleSubmitReview(booking.id)}>
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>

                      <div className={styles.pageNumbers}>
                        {getPageNumbers(currentPage, totalPages).map((page, index) => (
                          <button
                            key={index}
                            className={`${styles.pageBtn} ${
                              page === currentPage ? styles.pageActive : ""
                            } ${page === "..." ? styles.pageEllipsis : ""}`}
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === "..."}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeNav === "tournaments" && (
              <div className={styles.tournamentsSection}>
                <div className={styles.sectionHeader}>
                  <h2>My Tournaments</h2>
                  <button className={styles.joinMoreBtn} onClick={() => navigate('/dashboard/tournaments')}>
                    🏆 Join More Tournaments
                  </button>
                </div>

                {loadingJoinedTournaments ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading tournaments...</p>
                  </div>
                ) : joinedTournaments.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🏆</div>
                    <h3>No Tournaments Joined</h3>
                    <p>You haven't joined any tournaments yet. Browse available tournaments to get started!</p>
                    <button className={styles.browseBtn} onClick={() => navigate('/dashboard/tournaments')}>
                      Browse Tournaments
                    </button>
                  </div>
                ) : (
                  <div className={styles.tournamentsGrid}>
                    {joinedTournaments.map((tournament) => (
                      <div key={tournament.id} className={styles.tournamentCard}>
                        <div className={styles.cardHeader}>
                          <h3>{tournament.gameName}</h3>
                          <span className={styles.tournamentStatus}>
                            {tournament.listOfUserEmailJoined?.length || 0}/{tournament.playersRequired} players
                          </span>
                        </div>
                        
                        <div className={styles.cardContent}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📅</span>
                            <span>{formatDate(tournament.timeDate)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>🕐</span>
                            <span>{formatTime(tournament.timeDate)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>📍</span>
                            <span>{tournament.location}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>🏟️</span>
                            <span>{tournament.venue}</span>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          <button 
                            className={styles.refreshTournamentBtn}
                            onClick={() => loadJoinedTournaments()}
                            title="Refresh tournament data"
                          >
                            🔄 Refresh
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeNav === "profile" && (
              <div className={styles.profileSection}>
                <div className={styles.sectionHeader}>
                  <h2>Edit Profile</h2>
                </div>

                {/* User Data Error */}
                {userDataError && (
                  <div className={`${styles.updateMessage} ${styles.error}`}>
                    ❌ {userDataError}
                  </div>
                )}

                {/* Update Message */}
                {updateMessage.text && (
                  <div className={`${styles.updateMessage} ${styles[updateMessage.type]}`}>
                    {updateMessage.type === 'success' ? '✅' : '❌'} {updateMessage.text}
                  </div>
                )}

                {isLoadingUserData ? (
                  <div className={styles.loadingForm}>
                    <div className={styles.spinner}></div>
                    <p>Loading user data...</p>
                  </div>
                ) : (
                  <form className={styles.profileForm} onSubmit={handleSaveProfile}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="oldPassword">Current Password</label>
                    <div className={styles.passwordField}>
                      <input
                        id="oldPassword"
                        type={showPassword.old ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
                      >
                        {showPassword.old ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <div className={styles.passwordField}>
                      <input
                        id="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPassword.new ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.resetBtn}>
                      Reset
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <span className={styles.spinner}></span>
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Toast */}
      {showLogoutToast && (
        <div 
          className={`${styles.logoutToastBackdrop} ${showLogoutToast ? styles.visible : ''}`} 
          onClick={handleLogoutCancel}
        >
          <div 
            className={`${styles.logoutToast} ${showLogoutToast ? styles.visible : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.logoutToastHeader}>
              <span className={styles.logoutToastIcon}>🚪</span>
              Logout Confirmation
            </div>
            <div className={styles.logoutToastMessage}>
              Are you sure you want to logout from your account?
            </div>
            <div className={styles.logoutToastActions}>
              <button 
                className={`${styles.logoutToastButton} ${styles.logoutToastCancel}`}
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button 
                className={`${styles.logoutToastButton} ${styles.logoutToastConfirm}`}
                onClick={handleLogoutConfirm}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className={styles.modal} aria-modal="true" role="dialog">
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>Cancel Booking</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowCancelModal(null)}>
                Keep Booking
              </button>
              <button className={styles.modalConfirm} onClick={() => handleCancelBooking(showCancelModal)}>
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Creation Modal */}
      {showTournamentModal && (
        <div className={styles.modal} aria-modal="true" role="dialog">
          <div className={styles.modalContent} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>🏆 Create Tournament</h3>
            </div>
            <form onSubmit={handleTournamentSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="tournamentName">Tournament Name</label>
                  <input
                    type="text"
                    id="tournamentName"
                    value={tournamentData.gameName}
                    onChange={(e) => setTournamentData(prev => ({ ...prev, gameName: e.target.value }))}
                    placeholder="e.g., Weekend Basketball Championship"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="playersRequired">Total Players Needed</label>
                  <input
                    type="number"
                    id="playersRequired"
                    value={tournamentData.playersRequired}
                    onChange={(e) => setTournamentData(prev => ({ ...prev, playersRequired: e.target.value }))}
                    placeholder="Total players for tournament"
                    min="2"
                    max="50"
                    required
                  />
                  <small className={styles.helpText}>
                    You will be automatically included as player 1/{tournamentData.playersRequired || '?'}
                  </small>
                </div>
                
                {tournamentMessage.text && (
                  <div className={`${styles.message} ${styles[tournamentMessage.type]}`}>
                    {tournamentMessage.text}
                  </div>
                )}
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.modalCancel} 
                  onClick={handleCloseTournamentModal}
                  disabled={creatingTournament}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.modalConfirm}
                  disabled={creatingTournament}
                >
                  {creatingTournament ? (
                    <>
                      <Loader2 size={16} className={styles.spinning} />
                      Creating...
                    </>
                  ) : (
                    'Create Tournament'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <Receipt
          paymentData={showReceipt.paymentData}
          bookingDetails={showReceipt.bookingDetails}
          onClose={() => setShowReceipt(null)}
        />
      )}
    </div>
  )
}
