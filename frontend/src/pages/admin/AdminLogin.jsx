import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "./AdminLogin.module.css";
import BASE_URL from "../../api/baseURL";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        email: email,
        password: password
      });
      
      const url = `${BASE_URL}/login?${params.toString()}`;
      console.log('Making admin login request to:', url);
      
      const response = await fetch(url, { 
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error("Wrong credentials or authentication error");
      }
      
      // Check if response is JSON or plain text
      const contentType = response.headers.get("content-type");
      let token;
      
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        token = data.token;
      } else {
        // If it's plain text, the response body is the token itself
        token = await response.text();
      }
      
      // Save token and email in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      
      // Show success toast
      toast.success("Admin login successful!");
      
      // Fetch user data to verify admin role
      await fetchUserDataAndNavigate(email);
      
    } catch (err) {
      console.error('Admin login error:', err);
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDataAndNavigate = async (emailId) => {
    try {
      const userDataUrl = `${BASE_URL}/data/${encodeURIComponent(emailId)}`;
      console.log('Fetching admin data from:', userDataUrl);
      
      const response = await fetch(userDataUrl, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await response.json();
      console.log('Admin data:', userData);
      
      // Check if user has admin role
      if (userData.role !== "ROLE_ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }
      
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("fullName", userData.fullName);
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Error fetching admin data:', err);
      
      // If access denied, clear localStorage and show error
      if (err.message.includes("Access denied")) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        localStorage.removeItem("fullName");
        toast.error("Access denied. Only administrators can access this area.");
        setError("Access denied. Only administrators can access this area.");
      } else {
        toast.error("Failed to fetch admin data. Please try again.");
        setError("Failed to fetch admin data. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles["rc-page"]}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <div className={styles["rc-shell"]}>
        {/* Left panel (hero section) */}
        <aside className={styles["rc-left"]} role="img" aria-label="Admin portal hero image">
          <div className={styles["rc-left-inner"]}>
            <div className={styles["rc-hero"]}>
              <img 
                src="https://i.pinimg.com/736x/d9/b0/6f/d9b06f40361b448f09fb282864e7fb4d.jpg" 
                alt="QuickCourt Admin Portal" 
                className={styles["hero-image"]}
              />
            </div>
          </div>
        </aside>

        {/* Right panel (login form) */}
        <main className={styles["rc-right"]} aria-labelledby="login-heading">
          <div className={styles["rc-card"]}>
            <h1 id="login-heading" className={styles["brand"]}>
              QuickCourt
            </h1>
            <p className={styles["subtitle"]}>Admin Portal - Please sign in with your administrator credentials.</p>

            <form className={styles["rc-form"]} onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label htmlFor="email" className={styles["label"]}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@quickcourt.com"
                  className={styles["input"]}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={styles["form-group"]}>
                <label htmlFor="password" className={styles["label"]}>
                  Password
                </label>
                <div className={styles["input-with-icon"]}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your admin password"
                    className={styles["input"]}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles["pw-icon"]}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles["btn"]} disabled={loading}>
                {loading ? "Signing In..." : "Sign In as Admin"}
              </button>
            </form>

            {error && <div className={styles["error-message"]}>{error}</div>}

            <div className={styles["links"]}>
              <p className={styles["signup-text"]}>
                Not an admin? <a href="/login" className={styles["link"]}>User Login</a>
              </p>
              <a href="/facility-owner/login" className={styles["forgot-link"]}>
                Facility Owner Login →
              </a>
            </div>

            <div className={styles["demo-info"]}>
              <h3>Admin Access</h3>
              <p>This portal is restricted to system administrators only. If you need access, please contact your system administrator.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
