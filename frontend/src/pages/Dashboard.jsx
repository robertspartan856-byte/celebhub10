import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#060816", color: "#fff", padding: "2rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px", padding: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Welcome back, {user?.name || "Robert"} 👋
        </h1>

        <p style={{ color: "#cbd5e1", marginBottom: "1.5rem" }}>
          Your CELEBHUB Account
        </p>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
            <strong>👤 Profile</strong>
            <div style={{ marginTop: "0.35rem", color: "#cbd5e1" }}>
              {user?.email || "robertspartan856@gmail.com"}
            </div>
          </div>

          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
            <strong>🎫 Fan Card:</strong> Not Active
          </div>

          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
            <strong>💎 Subscription:</strong> Free
          </div>

          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
            <strong>⭐ Favorite Celebrities:</strong> 0
          </div>

          <div style={{ padding: "1rem", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
            <strong>🔔 Notifications</strong>
            <div style={{ marginTop: "0.35rem", color: "#cbd5e1" }}>
              No new updates yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
