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
        `${import.meta.env.VITE_API_URL}/api/bookings/my/${user.id}`
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
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`
      );

      setCancelSuccess((prev) => ({
        ...prev,
        [bookingId]: "Booking cancelled!",
      }));

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

      {/* Navbar */}
      <div className="relative z-10 border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">

        <span className="text-stone-100 font-black">Room Booking</span>

        <div className="flex items-center gap-3">
          <span className="text-stone-500 text-sm">
            Hey, <span className="text-amber-400">{user?.name}</span>
          </span>

          <Link to="/dashboard">
            <button className="px-4 py-2 border border-stone-700 text-xs uppercase rounded-xl">
              Dashboard
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-400 text-xs uppercase rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-4xl text-white font-bold mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-6"
              >

                <h3 className="text-white font-bold text-lg">
                  Room {booking.room_number}
                </h3>

                <p className="text-amber-400 text-xl font-bold mt-1">
                  ₹{booking.price}
                  <span className="text-xs text-gray-400 ml-1">/ night</span>
                </p>

                <div className="mt-4 text-sm text-gray-300">

                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(booking.check_in).toLocaleDateString("en-IN")}
                  </p>

                  <p>
                    <strong>Check-out:</strong>{" "}
                    {new Date(booking.check_out).toLocaleDateString("en-IN")}
                  </p>

                </div>

                {cancelError[booking.id] && (
                  <p className="text-red-400 text-xs mt-2">
                    {cancelError[booking.id]}
                  </p>
                )}

                {cancelSuccess[booking.id] && (
                  <p className="text-green-400 text-xs mt-2">
                    {cancelSuccess[booking.id]}
                  </p>
                )}

                <button
                  onClick={() => handleCancel(booking.id)}
                  className="w-full mt-4 py-2 border border-red-500 text-red-400 text-xs uppercase rounded-lg"
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