import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [cancelError, setCancelError] = useState({});
  const [cancelSuccess, setCancelSuccess] = useState({});
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch {
      console.warn("Invalid user in localStorage");
    }
    return null;
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/my/${user.id}`,
      );
      setBookings(res.data.bookings);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching bookings");
    }
  };

  const handleCancel = async (bookingId) => {
    setCancelError((prev) => ({ ...prev, [bookingId]: "" }));
    setCancelSuccess((prev) => ({ ...prev, [bookingId]: "" }));
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
      );
      setCancelSuccess((prev) => ({
        ...prev,
        [bookingId]: "Booking cancelled!",
      }));
      // Remove from list after short delay
      setTimeout(() => {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      }, 1000);
    } catch (error) {
      setCancelError((prev) => ({
        ...prev,
        [bookingId]:
          error.response?.data?.message || "Failed to cancel booking.",
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-stone-950 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500 opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-600 opacity-10 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#d4a96a 1px, transparent 1px), linear-gradient(90deg, #d4a96a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Navbar */}
      <div className="relative z-10 border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-stone-950"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1V10z"
              />
            </svg>
          </div>
          <span
            className="text-stone-100 font-black tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Room Booking
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-stone-500 text-sm hidden sm:block">
            Hey,{" "}
            <span className="text-amber-400 font-semibold">{user?.name}</span>
          </span>
          <Link to="/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-700 text-stone-400 text-xs tracking-widest uppercase rounded-xl hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1V10z"
                />
              </svg>
              Dashboard
            </button>
          </Link>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-900/50 text-red-400 text-xs tracking-widest uppercase rounded-xl hover:border-red-500/60 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1
            className="text-4xl font-black text-stone-100 mb-2"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            My{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Bookings
            </span>
          </h1>
          <p className="text-stone-500 text-sm tracking-widest uppercase">
            Your reserved rooms
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-stone-600 text-sm tracking-widest uppercase">
              No bookings yet
            </p>
            <Link to="/dashboard">
              <button className="mt-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-xs tracking-widest uppercase rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-200 hover:scale-[1.02] active:scale-95">
                Browse Rooms
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4 hover:border-stone-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-stone-100 font-bold text-lg">
                      Room {booking.room_number}
                    </h3>

                    <p className="text-amber-400 font-black text-xl mt-1">
                      ₹{booking.price}
                      <span className="text-stone-500 text-xs font-normal ml-1">
                        / night
                      </span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1V10z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="h-px bg-stone-800" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-xs tracking-widest uppercase">
                      Check-in
                    </span>
                    <span className="text-stone-300 text-sm font-medium">
                      {new Date(booking.check_in).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 text-xs tracking-widest uppercase">
                      Check-out
                    </span>
                    <span className="text-stone-300 text-sm font-medium">
                      {new Date(booking.check_out).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs tracking-widest uppercase font-semibold">
                    Confirmed
                  </span>
                </div>

                {/* Cancel feedback */}
                {cancelError[booking.id] && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                    <svg
                      className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                      />
                    </svg>
                    <p className="text-red-400 text-xs">
                      {cancelError[booking.id]}
                    </p>
                  </div>
                )}
                {cancelSuccess[booking.id] && (
                  <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                    <svg
                      className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-emerald-400 text-xs">
                      {cancelSuccess[booking.id]}
                    </p>
                  </div>
                )}

                {/* Cancel Button */}
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="w-full py-2.5 border border-red-900/50 text-red-400 font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-200 active:scale-95"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
