import { useState } from "react";
import { Notice } from "../components/Notice";
import { api, setAccessToken } from "../services/api";

export function AuthPage() {
  const [notice, setNotice] = useState({ message: "", tone: "success" });

  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = await api.login({
        email: form.get("email"),
        password: form.get("password")
      });

      setAccessToken(result.accessToken);
      setNotice({ message: `Welcome back, ${result.user.name}.`, tone: "success" });
    } catch (error) {
      setNotice({ message: error.message, tone: "error" });
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const result = await api.register({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        college: form.get("college"),
        city: form.get("city"),
        password: form.get("password")
      });

      setAccessToken(result.accessToken);
      setNotice({ message: `Account created for ${result.user.name}. Check email for verification.`, tone: "success" });
    } catch (error) {
      setNotice({ message: error.message, tone: "error" });
    }
  }

  return (
    <main className="auth-layout">
      <div className="card auth-card form-grid">
        <div>
          <span className="pill auth-pill">AUTHENTICATION</span>
          <h1 className="auth-title">Welcome to StudySwap</h1>
          <p className="auth-copy">Register, log in, and prepare for password reset and email verification flows.</p>
        </div>
        <div className="two-col">
          <form className="form-grid" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input className="input" name="email" type="email" placeholder="Email" required />
            <input className="input" name="password" type="password" placeholder="Password" required />
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
          <form className="form-grid" onSubmit={handleRegister}>
            <h2>Register</h2>
            <input className="input" name="name" placeholder="Full name" required />
            <input className="input" name="email" type="email" placeholder="Email" required />
            <input className="input" name="phone" placeholder="Phone" />
            <input className="input" name="college" placeholder="College" />
            <input className="input" name="city" placeholder="City" />
            <input className="input" name="password" type="password" placeholder="Password" required />
            <button className="btn btn-primary" type="submit">Create Account</button>
          </form>
        </div>
        <Notice message={notice.message} tone={notice.tone} />
      </div>
    </main>
  );
}
