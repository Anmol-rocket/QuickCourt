"use client"

import { useState } from "react"
import styles from "./FacilityApproval.module.css"

const FacilityApproval = () => {
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [comment, setComment] = useState("")

  // Mock data for pending facilities
  const pendingFacilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      owner: "John Smith",
      location: "Downtown, City Center",
      submittedDate: "2024-01-15",
      sports: ["Basketball", "Tennis", "Swimming"],
      photos: ["/modern-sports-facility.png"],
      description: "Modern sports complex with state-of-the-art facilities",
      status: "pending",
    },
    {
      id: 2,
      name: "Community Recreation Center",
      owner: "Sarah Johnson",
      location: "Suburb Area, North District",
      submittedDate: "2024-01-12",
      sports: ["Football", "Cricket", "Badminton"],
      photos: ["/community-sports-center.png"],
      description: "Family-friendly recreation center serving the local community",
      status: "pending",
    },
    {
      id: 3,
      name: "Premium Tennis Club",
      owner: "Mike Wilson",
      location: "Uptown, Business District",
      submittedDate: "2024-01-10",
      sports: ["Tennis"],
      photos: ["/placeholder-m0f9b.png"],
      description: "Exclusive tennis club with professional-grade courts",
      status: "pending",
    },
  ]

  const handleApprove = (facilityId) => {
    console.log(`Approved facility ${facilityId} with comment: ${comment}`)
    setComment("")
    setSelectedFacility(null)
  }

  const handleReject = (facilityId) => {
    console.log(`Rejected facility ${facilityId} with comment: ${comment}`)
    setComment("")
    setSelectedFacility(null)
  }

  return (
    <div className={styles.facilityApproval}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Facility Approval</h1>
          <p className={styles.subtitle}>Review and approve pending facility registrations</p>
        </header>

        <div className={styles.facilitiesGrid}>
          {pendingFacilities.map((facility) => (
            <div key={facility.id} className={styles.facilityCard}>
              <div className={styles.facilityImage}>
                <img src={facility.photos[0] || "/placeholder.svg"} alt={facility.name} />
                <div className={styles.statusBadge}>
                  <span className={styles.pendingStatus}>Pending</span>
                </div>
              </div>

              <div className={styles.facilityContent}>
                <h3 className={styles.facilityName}>{facility.name}</h3>
                <p className={styles.facilityOwner}>Owner: {facility.owner}</p>
                <p className={styles.facilityLocation}>📍 {facility.location}</p>
                <p className={styles.facilityDate}>Submitted: {facility.submittedDate}</p>

                <div className={styles.sportsContainer}>
                  <span className={styles.sportsLabel}>Sports:</span>
                  <div className={styles.sportsTags}>
                    {facility.sports.map((sport, index) => (
                      <span key={index} className={styles.sportTag}>
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                <p className={styles.facilityDescription}>{facility.description}</p>

                <div className={styles.facilityActions}>
                  <button className={styles.viewDetailsBtn} onClick={() => setSelectedFacility(facility)}>
                    View Details
                  </button>
                  <button className={styles.approveBtn} onClick={() => handleApprove(facility.id)}>
                    ✓ Approve
                  </button>
                  <button className={styles.rejectBtn} onClick={() => handleReject(facility.id)}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for facility details */}
        {selectedFacility && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{selectedFacility.name}</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedFacility(null)}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.facilityDetails}>
                  <img src={selectedFacility.photos[0] || "/placeholder.svg"} alt={selectedFacility.name} />
                  <div className={styles.detailsInfo}>
                    <p>
                      <strong>Owner:</strong> {selectedFacility.owner}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedFacility.location}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {selectedFacility.submittedDate}
                    </p>
                    <p>
                      <strong>Description:</strong> {selectedFacility.description}
                    </p>
                  </div>
                </div>

                <div className={styles.commentSection}>
                  <label htmlFor="comment">Add Comment (Optional):</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comments here..."
                    className={styles.commentTextarea}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.approveBtn} onClick={() => handleApprove(selectedFacility.id)}>
                    ✓ Approve Facility
                  </button>
                  <button className={styles.rejectBtn} onClick={() => handleReject(selectedFacility.id)}>
                    ✗ Reject Facility
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FacilityApproval
