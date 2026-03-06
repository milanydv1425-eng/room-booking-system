import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [dates, setDates] = useState({});
  const [bookingError, setBookingError] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState({});

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
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms`);
        setRooms(res.data.rooms);
      } catch (error) {
        console.error(error.response?.data?.message || "Error fetching rooms");
      }
    };
    fetchRooms();
  }, []);

  const handleDateChange = (roomId, field, value) => {
    setDates((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [field]: value,
      },
    }));
  };

  const handleBooking = async (roomId) => {
    setBookingError((prev) => ({ ...prev, [roomId]: "" }));
    setBookingSuccess((prev) => ({ ...prev, [roomId]: "" }));

    if (!user?.id) {
      setBookingError((prev) => ({ ...prev, [roomId]: "Please login first" }));
      return;
    }

    const start_date = dates[roomId]?.start;
    const end_date = dates[roomId]?.end;

    if (!start_date || !end_date) {
      setBookingError((prev) => ({
        ...prev,
        [roomId]: "Please select both check-in and check-out dates.",
      }));
      return;
    }

    if (new Date(end_date) <= new Date(start_date)) {
      setBookingError((prev) => ({
        ...prev,
        [roomId]: "Check-out date must be after check-in date.",
      }));
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        user_id: user.id,
        room_id: roomId,
        start_date,
        end_date,
      });
      setBookingSuccess((prev) => ({
        ...prev,
        [roomId]: "Room booked successfully!",
      }));
    } catch (error) {
      setBookingError((prev) => ({
        ...prev,
        [roomId]:
          error.response?.data?.message || "Booking failed. Please try again.",
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
          <Link to="/my-bookings">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              My Bookings
            </button>
          </Link>
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
            Available{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Rooms
            </span>
          </h1>
          <p className="text-stone-500 text-sm tracking-widest uppercase">
            Select a room and pick your dates
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-24 text-stone-600 text-sm tracking-widest uppercase">
            No rooms available at the moment
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4 hover:border-stone-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-stone-100 font-bold text-lg"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {room.name}
                    </h3>
                    <p className="text-amber-400 font-black text-xl mt-1">
                      ₹{room.price_per_night}
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

                <div className="space-y-3">
                  <div>
                    <label className="block text-stone-500 text-xs tracking-widest uppercase mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={dates[room.id]?.start || ""}
                      onChange={(e) =>
                        handleDateChange(room.id, "start", e.target.value)
                      }
                      className="w-full bg-stone-800/60 border border-stone-700 text-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-xs tracking-widest uppercase mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      min={
                        dates[room.id]?.start ||
                        new Date().toISOString().split("T")[0]
                      }
                      value={dates[room.id]?.end || ""}
                      onChange={(e) =>
                        handleDateChange(room.id, "end", e.target.value)
                      }
                      className="w-full bg-stone-800/60 border border-stone-700 text-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition-all duration-200"
                    />
                  </div>
                </div>

                {bookingError[room.id] && (
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
                    <p className="text-red-400 text-xs leading-relaxed">
                      {bookingError[room.id]}
                    </p>
                  </div>
                )}

                {bookingSuccess[room.id] && (
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
                    <p className="text-emerald-400 text-xs leading-relaxed">
                      {bookingSuccess[room.id]}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleBooking(room.id)}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-sm tracking-widest uppercase rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-900/30 hover:scale-[1.02] active:scale-95"
                >
                  Book Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
