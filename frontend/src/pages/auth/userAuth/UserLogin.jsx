import React, { useState } from "react";
import styles from "./UserLogin.module.css";
import BASE_URL from "../../../api/baseURL";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = `${BASE_URL}/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error("Wrong credentials or authentication error");
      }
      const data = await response.json();
      // Save token and email in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      // Optionally redirect or show success
      alert("Login successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["rc-page"]}>
      <div className={styles["rc-shell"]}>
        {/* Left panel (image / hero) */}
        <aside className={styles["rc-left"]}>
          <div className={styles["rc-left-inner"]}>
            {/* Replace this with an <img /> or background image if you want */}
            <div className={styles["rc-hero"]}>IMAGE</div>
          </div>
        </aside>

        {/* Right panel (login) */}
        <main className={styles["rc-right"]} aria-labelledby="login-heading">
          <div className={styles["rc-card"]}>
            <h1 id="login-heading" className={styles["brand"]}>
              QUICKCOURT
            </h1>
            <p className={styles["subtitle"]}>LOGIN</p>

            <form className={styles["rc-form"]} onSubmit={handleSubmit}>
              <label htmlFor="email" className={styles["label"]}>
                Email
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

              <label htmlFor="password" className={styles["label"]}>
                Password
              </label>
              <div className={styles["input-with-icon"]}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className={styles["input"]}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles["pw-icon"]}
                  aria-hidden="true"
                >
                  ●
                </button>
              </div>

              <button
                type="submit"
                className={styles["btn"]}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}

            <div className={styles["links"]}>
              <p className={styles["small"]}>
                Don’t have an account?{" "}
                <a href="#" className={styles["link"]}>
                  Sign up
                </a>
              </p>
              <a href="#" className={`${styles["link"]} ${styles["tiny"]}`}>
                Forgot password?
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
