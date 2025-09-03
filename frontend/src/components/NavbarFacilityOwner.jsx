import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import styles from "../pages/facilityOwner/FacilityOwnerDashboard.module.css";

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userName = localStorage.getItem("fullName") || "Alex Johnson";
  const userEmail = localStorage.getItem("email") || "alex@example.com";
  const userAvatar = localStorage.getItem("avatarUrl") || "";

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarBrand}>
          <h2 className={styles.brandTitle}>QUICKCOURT</h2>
        </div>

        <div className={styles.navbarMenu}>
          <Link
            to="/facility-owner-dashboard/my-bookings"
            className={styles.navLink}
          >
            My Bookings
          </Link>
          <Link
            to="/facility-owner-dashboard/my-venues"
            className={styles.navLink}
          >
            My Venues
          </Link>
        </div>

        <div className={styles.userSection}>
          <div
            className={styles.userProfile}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className={styles.userAvatar}>
              {userAvatar ? (
                <img
                  src={userAvatar || "/placeholder.svg"}
                  alt={userName}
                  className={styles.avatarImage}
                />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userEmail}>{userEmail}</span>
            </div>
          </div>

          {userMenuOpen && (
            <div className={styles.userDropdown}>
              <a href="/profile" className={styles.dropdownItem}>
                Profile
              </a>
              <a href="/settings" className={styles.dropdownItem}>
                Settings
              </a>
              <hr className={styles.dropdownDivider} />
              <button
                className={styles.dropdownItem}
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
