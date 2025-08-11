import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styles from "./UserLogin.module.css";
import BASE_URL from "../../../api/baseURL";

export default function UserLogin() {
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
      console.log('Making request to:', url); // Debug log
      
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
      toast.success("Login successful!");
      
      // Fetch user data to determine role
      await fetchUserDataAndNavigate(email);
      
    } catch (err) {
      console.error('Login error:', err);
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
      console.log('Fetching user data from:', userDataUrl);
      
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
      console.log('User data:', userData);
      
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("fullName", userData.fullName);
      
      // Navigate based on role
      if (userData.role === "ROLE_FACILITY_OWNER") {
        navigate('/facility-owner-dashboard');
      } else if (userData.role === "ROLE_USER") {
        navigate('/dashboard');
      } else {
        // Default fallback
        navigate('/dashboard');
      }
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      toast.error("Failed to fetch user data. Redirecting to default dashboard.");
      // Fallback navigation
      navigate('/dashboard');
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
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <div className={styles["rc-shell"]}>
        {/* Left panel (hero image) */}
        <aside className={styles["rc-left"]}>
          <div className={styles["rc-left-inner"]}>
            <div className={styles["rc-hero"]}>
              <img 
                src="https://i.pinimg.com/736x/9c/d6/ce/9cd6ce5a4c51da24951e670c33b7d530.jpg" 
                alt="QuickCourt Sports Platform" 
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
            <p className={styles["subtitle"]}>Welcome back! Please sign in to your account.</p>

            <form className={styles["rc-form"]} onSubmit={handleSubmit}>
              <div className={styles["form-group"]}>
                <label htmlFor="email" className={styles["label"]}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
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

              <button
                type="submit"
                className={styles["btn"]}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <div className={styles["error-message"]}>
                {error}
              </div>
            )}

            <div className={styles["links"]}>
              <p className={styles["signup-text"]}>
                Don't have an account?{" "}
                <a href="#signup" className={styles["link"]}>
                  Create account
                </a>
              </p>
              <a href="#forgot" className={styles["forgot-link"]}>
                Forgot your password?
              </a>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
