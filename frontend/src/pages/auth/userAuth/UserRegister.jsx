"use client";

import React, { useState } from "react";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building,
} from "lucide-react";
import BASE_URL from "../../../api/baseURL";

// Mock emailjs for demo
const emailjs = {
  send: async (serviceId, templateId, params, _userId) => {
    // Mock implementation
    console.log("Sending email with OTP:", params.otp);
    return Promise.resolve();
  },
};

function generateOTP(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export default function RegisterPage() {
  const [role, setRole] = useState("ROLE_USER");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);

  function updateAvatarUrl(value) {
    setAvatarUrl(value);
    try {
      new URL(value);
      setPreview(value);
    } catch {
      setPreview(null);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!otpSent && !awaitingOtp) {
      // Step 1: Generate and send OTP
      const generatedOtp = generateOTP();
      setOtp(generatedOtp);
      try {
        await emailjs.send(
          "service_o3z2hkh",
          "template_1eh167f",
          {
            email: form.email,
            otp: generatedOtp,
          },
          "yOx36hZ-PSDK8ahbD"
        );
        setOtpSent(true);
        setAwaitingOtp(true);
        setSuccess("OTP sent to your email. Please check your inbox.");
      } catch {
        setError("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (awaitingOtp && userOtp !== otp) {
      setError("Invalid OTP. Please check your email and try again.");
      setLoading(false);
      return;
    }

    // Step 2: Register user after OTP is verified
    try {
      const url = `${BASE_URL}/register`;
      const payload = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        avatarUrl: avatarUrl.trim() || "",
        role,
        verified: true,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email already exists");
        }
        const errText = await response.text().catch(() => null);
        throw new Error(errText || "Registration failed");
      }

      await response.json();
      setSuccess("Registration successful!");
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
      setAvatarUrl("");
      setPreview(null);
      setOtpSent(false);
      setOtp("");
      setUserOtp("");
      setAwaitingOtp(false);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Hero */}
        <aside className="register-hero">
          <div className="hero-content">
            <div className="hero-card">
              <img
                src="/sports-venue-booking-hero.png"
                alt="QuickCourt Platform"
              />
            </div>
            <div className="hero-text">
              <h2>Join QuickCourt</h2>
              <p>
                Book your favorite sports venues with ease. Connect with players
                and facility owners in your area.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side - Form */}
        <main className="register-form-section">
          <div className="register-card">
            <div className="brand-header">
              <h1 className="brand-title">QUICKCOURT</h1>
              <p className="form-subtitle">Create your account</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              {/* Profile Section */}
              <div className="profile-section">
                <div className="avatar-section">
                  <div className="avatar-container">
                    {preview ? (
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Profile preview"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="avatarUrl" className="input-label">
                      Profile Picture URL (Optional)
                    </label>
                    <input
                      id="avatarUrl"
                      name="avatarUrl"
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                      value={avatarUrl}
                      onChange={(e) => updateAvatarUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="role-section">
                  <label htmlFor="role" className="input-label">
                    Account Type
                  </label>
                  <div className="role-options">
                    <button
                      type="button"
                      className={`role-option ${
                        role === "ROLE_USER" ? "active" : ""
                      }`}
                      onClick={() => setRole("ROLE_USER")}
                    >
                      <UserCheck size={20} />
                      <span>Player</span>
                    </button>
                    <button
                      type="button"
                      className={`role-option ${
                        role === "ROLE_FACILITY_OWNER" ? "active" : ""
                      }`}
                      onClick={() => setRole("ROLE_FACILITY_OWNER")}
                    >
                      <Building size={20} />
                      <span>Facility Owner</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="input-group">
                <label htmlFor="fullName" className="input-label">
                  Full Name
                </label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="form-input with-icon"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="form-input with-icon"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* OTP Section */}
              {awaitingOtp && (
                <div className="input-group otp-section">
                  <label htmlFor="userOtp" className="input-label">
                    Verification Code
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      id="userOtp"
                      name="userOtp"
                      value={userOtp}
                      onChange={(e) => setUserOtp(e.target.value)}
                      className="form-input with-icon"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="otp-hint">
                    Check your email for the verification code
                  </p>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className="form-input with-icon with-action"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-input with-icon with-action"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? <div className="loading-spinner" /> : null}
                {loading
                  ? awaitingOtp
                    ? "Verifying..."
                    : "Sending Code..."
                  : awaitingOtp
                  ? "Verify & Register"
                  : "Create Account"}
              </button>
            </form>

            {/* Messages */}
            {error && <div className="message error-message">{error}</div>}
            {success && (
              <div className="message success-message">{success}</div>
            )}

            <p className="login-link">
              Already have an account?{" "}
              <a href="/login" className="link">
                Sign in
              </a>
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        .register-page {
          --bg: #f2efe7;
          --accent-1: #9acbd0;
          --accent-2: #48a6a7;
          --accent-3: #2973b2;
          --muted: rgba(0, 0, 0, 0.55);
          --card-bg: rgba(255, 255, 255, 0.08);
          --text-primary: #1a1a1a;
          --text-secondary: #666;
          --white: #ffffff;
          --shadow: rgba(0, 0, 0, 0.1);
          --anim-fast: 180ms ease-out;
          --anim-medium: 360ms cubic-bezier(0.2, 0.9, 0.2, 1);

          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background-color: var(--bg);
          min-height: 100vh;
          color: var(--text-primary);
          line-height: 1.6;
        }

        .register-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        /* Hero Section */
        .register-hero {
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .register-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("/placeholder-2cyyp.png") repeat;
          opacity: 0.1;
        }

        .hero-content {
          text-align: center;
          z-index: 1;
          max-width: 500px;
          width: 100%;
        }

        .hero-card {
          background: var(--white);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px var(--shadow);
          transform: rotate(-2deg);
          transition: transform var(--anim-medium);
          margin-bottom: 2rem;
          width: 100%;
          max-width: 450px;
        }

        .hero-card:hover {
          transform: rotate(0deg) scale(1.02);
        }

        .hero-card img {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 12px;
        }

        .hero-text h2 {
          color: var(--white);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .hero-text p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.125rem;
        }

        /* Form Section */
        .register-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--white);
        }

        .register-card {
          width: 100%;
          max-width: 480px;
          animation: fadeInUp 360ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
        }

        .brand-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .brand-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-3);
          margin: 0 0 0.5rem 0;
          letter-spacing: 2px;
        }

        .form-subtitle {
          color: var(--text-secondary);
          font-size: 1.125rem;
          margin: 0;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Profile Section */
        .profile-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--accent-1);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          color: var(--text-secondary);
        }

        .role-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .role-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .role-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: var(--white);
          cursor: pointer;
          transition: all var(--anim-fast);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .role-option:hover {
          border-color: var(--accent-1);
          background: rgba(154, 203, 208, 0.1);
        }

        .role-option.active {
          border-color: var(--accent-2);
          background: rgba(72, 166, 167, 0.1);
          color: var(--accent-3);
        }

        /* Input Groups */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.875rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all var(--anim-fast);
          background: var(--white);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-2);
          box-shadow: 0 0 0 3px rgba(72, 166, 167, 0.1);
        }

        .form-input.with-icon {
          padding-left: 2.75rem;
        }

        .form-input.with-action {
          padding-right: 2.75rem;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-secondary);
          pointer-events: none;
        }

        .input-action {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: color var(--anim-fast);
        }

        .input-action:hover {
          color: var(--accent-3);
        }

        /* OTP Section */
        .otp-section {
          background: rgba(154, 203, 208, 0.1);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--accent-1);
        }

        .otp-hint {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0.5rem 0 0 0;
        }

        /* Submit Button */
        .submit-button {
          background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
          color: var(--white);
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--anim-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(41, 115, 178, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0) scale(0.995);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid var(--white);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Messages */
        .message {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 1rem;
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .success-message {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          border: 1px solid rgba(40, 167, 69, 0.2);
        }

        /* Login Link */
        .login-link {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--text-secondary);
        }

        .link {
          color: var(--accent-3);
          text-decoration: none;
          font-weight: 600;
          transition: color var(--anim-fast);
        }

        .link:hover {
          color: var(--accent-2);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .register-container {
            grid-template-columns: 1fr;
          }

          .register-hero {
            min-height: 40vh;
            padding: 1.5rem;
          }

          .hero-text h2 {
            font-size: 1.75rem;
          }

          .profile-section {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero-card img {
            height: 250px;
          }

          .hero-content {
            max-width: 100%;
          }

          .hero-card {
            max-width: 350px;
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-card img {
            height: 200px;
          }

          .hero-card {
            max-width: 300px;
          }

          .register-form-section {
            padding: 0.5rem;
          }

          .register-card {
            max-width: none;
          }

          .brand-title {
            font-size: 1.5rem;
          }

          .form-subtitle {
            font-size: 1rem;
          }

          .role-options {
            flex-direction: column;
          }

          .role-option {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
