import { useEffect, useState } from "react";

const API_URL = "https://celebhub1-production.up.railway.app";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        setUser(data.user);

        // Keep local storage updated
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Dashboard authentication error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your account...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-xl px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <span className="text-purple-400">CELEB</span>
          <span className="text-blue-400">HUB</span>
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          Logout
        </button>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl font-bold">
          Welcome back, {user.name} 👋
        </h2>

        <p className="mt-2 text-gray-400">
          Your account is securely authenticated.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Account</p>
            <h3 className="mt-2 text-2xl font-semibold">
              {user.name}
            </h3>
            <p className="mt-2 text-gray-400">{user.email}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Fan Card</p>
            <h3 className="mt-2 text-2xl font-semibold">
              Not Active
            </h3>

            <button className="mt-4 rounded-lg bg-purple-600 px-4 py-2 hover:bg-purple-500">
              Explore Fan Cards
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Membership</p>
            <h3 className="mt-2 text-2xl font-semibold">
              Free Member
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
}
