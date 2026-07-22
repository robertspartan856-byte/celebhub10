import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://celebhub10-production.up.railway.app";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem("celebhub_admin_token", data.token);

      onLogin();
    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">✦ CELEBHUB</div>

        <p className="admin-login-label">ADMINISTRATION PORTAL</p>

        <h1>Welcome Back</h1>

        <p className="login-description">
          Sign in to manage the CELEBHUB platform.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {message && <div className="login-error">{message}</div>}

        <a href="/" className="return-home">
          ← Return to CELEBHUB
        </a>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    todaySubscribers: 0,
    yesterdaySubscribers: 0,
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchSubscribers();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem("celebhub_admin_token");

      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      setStats(data.stats);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchSubscribers(searchTerm = "") {
    try {
      setLoading(true);

      const token = localStorage.getItem("celebhub_admin_token");

      const response = await fetch(
        `${API_BASE_URL}/api/newsletter/subscribers?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();

      setSubscribers(data.subscribers);
    } catch (error) {
      setError("Unable to load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("celebhub_admin_token");
    window.location.href = "/admin-login";
  }

  function exportCSV() {
    const headers = ["Email", "Source", "Date Joined"];

    const rows = subscribers.map((subscriber) => [
      subscriber.email,
      subscriber.source,
      new Date(subscriber.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "celebhub-subscribers.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  function handleSearch(event) {
    event.preventDefault();
    fetchSubscribers(search);
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-brand">✦ CELEBHUB</div>

          <p>Administration Dashboard</p>
        </div>

        <div className="admin-actions">
          <a href="/" className="back-button">
            ← Website
          </a>

          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">PLATFORM OVERVIEW</p>

            <h1>Welcome back, Admin.</h1>
          </div>
        </div>

        <div className="stats-grid">
          <div className="dashboard-stat-card">
            <span>TOTAL SUBSCRIBERS</span>

            <strong>{stats.totalSubscribers}</strong>

            <small>All-time waitlist members</small>
          </div>

          <div className="dashboard-stat-card">
            <span>TODAY</span>

            <strong>{stats.todaySubscribers}</strong>

            <small>New subscribers today</small>
          </div>

          <div className="dashboard-stat-card">
            <span>YESTERDAY</span>

            <strong>{stats.yesterdaySubscribers}</strong>

            <small>Previous day signups</small>
          </div>
        </div>

        <section className="subscriber-section">
          <div className="section-top">
            <div>
              <h2>Waitlist Subscribers</h2>

              <p>Manage everyone waiting for the CELEBHUB launch.</p>
            </div>

            <button className="export-button" onClick={exportCSV}>
              ↓ Export CSV
            </button>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search subscriber email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit">Search</button>

            <button
              type="button"
              className="refresh-button"
              onClick={() => {
                setSearch("");
                fetchSubscribers();
              }}
            >
              ↻
            </button>
          </form>

          {loading && <div className="empty-state">Loading subscribers...</div>}

          {error && <div className="error-state">{error}</div>}

          {!loading && !error && subscribers.length === 0 && (
            <div className="empty-state">No subscribers found.</div>
          )}

          {!loading && !error && subscribers.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email Address</th>
                    <th>Source</th>
                    <th>Date Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber._id}>
                      <td>{index + 1}</td>

                      <td className="email-cell">{subscriber.email}</td>

                      <td>
                        <span className="source-badge">{subscriber.source}</span>
                      </td>

                      <td>
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    Boolean(localStorage.getItem("celebhub_admin_token"))
  );
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthMessage("Account created successfully!");
      window.location.href = "/dashboard";
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthMessage("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  if (window.location.pathname === "/dashboard") {
    return <Dashboard />;
  }

  if (window.location.pathname === "/admin-login") {
    return (
      <AdminLogin
        onLogin={() => {
          window.location.href = "/admin";
        }}
      />
    );
  }

  if (window.location.pathname === "/admin") {
    if (!isAdminLoggedIn) {
      window.location.href = "/admin-login";
      return null;
    }

    return <AdminDashboard />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setMessage(
        "🎉 You're on the CELEBHUB waitlist! We'll notify you when we launch."
      );

      setEmail("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the server. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span>✦</span> CELEBHUB
        </div>

        <div className="launch-badge">🚀 LAUNCHING SOON</div>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">✦ THE NEXT ERA OF ENTERTAINMENT</p>

          <h1>
            THE FUTURE OF
            <span>CELEBRITY INTELLIGENCE</span>
          </h1>

          <p className="hero-text">
            CELEBHUB is creating a new era of celebrity discovery, premium fan
            memberships, AI-powered entertainment intelligence, and exclusive
            experiences.
          </p>

          <a href="#waitlist" className="primary-button">
            Join the Waitlist →
          </a>
        </section>

        <section className="features" style={{ marginTop: "2rem" }}>
          <div className="feature-card">
            <h3>Create your account</h3>
            <p>Sign up for CELEBHUB and start your fan experience.</p>
            <form onSubmit={handleSignup} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={signupEmail}
                onChange={(event) => setSignupEmail(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(event) => setSignupPassword(event.target.value)}
                required
              />
              <button type="submit" disabled={authLoading}>
                {authLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>

          <div className="feature-card">
            <h3>Log in to CELEBHUB</h3>
            <p>Access your dashboard and account details.</p>
            <form onSubmit={handleLogin} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                required
              />
              <button type="submit" disabled={authLoading}>
                {authLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

          {authMessage && <div className="message" style={{ gridColumn: "1 / -1" }}>{authMessage}</div>}

          <div className="feature-card">
            <div className="icon">✦</div>
            <h3>Premium Fan Memberships</h3>
            <p>
              Discover a new standard of celebrity fan identity and exclusive
              membership experiences.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">◈</div>
            <h3>AI Celebrity Intelligence</h3>
            <p>
              Explore smarter celebrity trends, insights, updates, and
              personalized entertainment discovery.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">♛</div>
            <h3>Exclusive Experiences</h3>
            <p>
              Unlock premium experiences and a new way to connect with the
              world of entertainment.
            </p>
          </div>
        </section>

        <section id="waitlist" className="waitlist">
          <p className="eyebrow">BE FIRST IN</p>

          <h2>
            SOMETHING
            <span>EXTRAORDINARY</span>
            IS COMING
          </h2>

          <p>
            Join the CELEBHUB waitlist and be among the first to know when we
            officially launch.
          </p>

          <form onSubmit={handleSubmit} className="waitlist-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Notify Me →"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </section>
      </main>

      <footer>
        <div className="footer-logo">✦ CELEBHUB</div>
        <p>AI-POWERED CELEBRITY INTELLIGENCE</p>
        <small>© 2026 CELEBHUB. ALL RIGHTS RESERVED.</small>
      </footer>
    </div>
  );
}

export default App;
