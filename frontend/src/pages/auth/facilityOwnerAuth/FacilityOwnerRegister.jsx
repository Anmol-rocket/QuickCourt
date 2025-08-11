import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="rc-page">
      <div className="rc-shell">
        {/* Left panel (image / hero) */}
        <aside className="rc-left">
          <div className="rc-left-inner">
            {/* Replace this with an <img /> or background image if you want */}
            <div className="rc-hero">IMAGE</div>
          </div>
        </aside>

        {/* Right panel (login) */}
        <main className="rc-right" aria-labelledby="login-heading">
          <div className="rc-card">
            <h1 id="login-heading" className="brand">QUICKCOURT</h1>
            <p className="subtitle">LOGIN</p>

            <form className="rc-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" name="email" type="email" placeholder="Enter your email" className="input" required />

              <label htmlFor="password" className="label">Password</label>
              <div className="input-with-icon">
                <input id="password" name="password" type="password" placeholder="Enter your password" className="input" required />
                <button type="button" className="pw-icon" aria-hidden="true">●</button>
              </div>

              <button type="submit" className="btn">Login</button>
            </form>

            <div className="links">
              <p className="small">
                Don’t have an account? <a href="#" className="link">Sign up</a>
              </p>
              <a href="#" className="link tiny">Forgot password?</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
