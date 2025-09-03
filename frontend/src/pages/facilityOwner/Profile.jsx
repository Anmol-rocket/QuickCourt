import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  UserCircle,
  Check,
  AlertCircle,
} from "lucide-react";
import BASE_URL from "../../api/baseURL";
import styles from "./Profile.module.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get user email from localStorage
  const userEmail = localStorage.getItem("email");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        if (!userEmail) {
          throw new Error("User email not found. Please log in again.");
        }

        const response = await fetch(
          `${BASE_URL}/data/${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Authentication failed. Redirecting to login...");
          } else if (response.status === 404) {
            throw new Error("User not found.");
          } else if (response.status === 500) {
            throw new Error("User not found or server error.");
          } else {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to fetch user data");
          }
        }

        const data = await response.json();
        setUserData(data);
        setEditData({
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
          // Note: password is excluded from editing as mentioned in requirements
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserData();
    } else {
      setError("User email not found. Please log in again.");
      setLoading(false);
    }
  }, [userEmail]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditData({
        fullName: userData.fullName,
        avatarUrl: userData.avatarUrl,
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    setSaveSuccess(false);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Prepare update payload with all required fields
      const updatePayload = {
        email: userData.email,
        password: userData.password, // Keep existing password
        fullName: editData.fullName,
        avatarUrl: editData.avatarUrl,
        role: userData.role,
        verified: userData.verified,
      };

      const response = await fetch(`${BASE_URL}/updateRegistration`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          throw new Error("Authentication failed. Redirecting to login...");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to update profile");
        }
      }

      // Update local state with new data
      setUserData((prev) => ({
        ...prev,
        fullName: editData.fullName,
        avatarUrl: editData.avatarUrl,
      }));

      setIsEditing(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: "profile", label: "Edit Profile", icon: User },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Profile</h2>
        </div>
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`${styles.sidebarItem} ${
                  activeTab === item.id ? styles.active : ""
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            {/* Header */}
            <div className={styles.profileHeader}>
              <h1>Edit Profile</h1>
              <div className={styles.headerActions}>
                {saveSuccess && (
                  <div className={styles.successMessage}>
                    <Check size={16} />
                    <span>Profile updated successfully!</span>
                  </div>
                )}
                <button
                  className={styles.editButton}
                  onClick={handleEditToggle}
                  disabled={saving}
                >
                  {isEditing ? (
                    <>
                      <X size={16} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 size={16} />
                      Edit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className={styles.profileContent}>
              {/* Avatar Section */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarContainer}>
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt="Profile"
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <UserCircle size={80} />
                    </div>
                  )}
                  {isEditing && (
                    <button className={styles.avatarEditButton}>
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                {isEditing && (
                  <div className={styles.avatarUrlInput}>
                    <label>Avatar URL</label>
                    <input
                      type="url"
                      value={editData.avatarUrl || ""}
                      onChange={(e) =>
                        handleInputChange("avatarUrl", e.target.value)
                      }
                      placeholder="Enter avatar image URL"
                    />
                  </div>
                )}
              </div>

              {/* Profile Fields */}
              <div className={styles.profileFields}>
                {/* Full Name */}
                <div className={styles.fieldGroup}>
                  <label>
                    <User size={16} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fullName || ""}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className={styles.fieldValue}>{userData.fullName}</div>
                  )}
                </div>

                {/* Email - Read Only */}
                <div className={styles.fieldGroup}>
                  <label>
                    <Mail size={16} />
                    Email
                  </label>
                  <div className={styles.fieldValue}>
                    {userData.email}
                    <span className={styles.readOnlyLabel}>Read Only</span>
                  </div>
                </div>

                {/* Role - Read Only */}
                <div className={styles.fieldGroup}>
                  <label>
                    <Shield size={16} />
                    Role
                  </label>
                  <div className={styles.fieldValue}>
                    {userData.role}
                    <span className={styles.readOnlyLabel}>Read Only</span>
                  </div>
                </div>

                {/* Verification Status - Read Only */}
                <div className={styles.fieldGroup}>
                  <label>
                    <AlertCircle size={16} />
                    Verification Status
                  </label>
                  <div className={styles.fieldValue}>
                    <span
                      className={`${styles.verificationBadge} ${
                        userData.verified ? styles.verified : styles.unverified
                      }`}
                    >
                      {userData.verified === null
                        ? "Pending"
                        : userData.verified
                        ? "Verified"
                        : "Unverified"}
                    </span>
                    <span className={styles.readOnlyLabel}>Read Only</span>
                  </div>
                </div>

                {/* Password Note */}
                <div className={styles.fieldGroup}>
                  <label>Password</label>
                  <div className={styles.fieldValue}>
                    ••••••••••••
                    <span className={styles.readOnlyLabel}>
                      Cannot be updated here
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className={styles.saveSection}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className={styles.miniSpinner}></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className={styles.settingsSection}>
            <h1>Settings</h1>
            <p>Settings functionality coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
