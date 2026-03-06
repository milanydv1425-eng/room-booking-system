import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center relative overflow-hidden">

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

      {/* Home Button */}
      <Link to="/" className="absolute top-6 left-6 z-20">
        <button className="flex items-center gap-2 px-4 py-2 border border-stone-700 text-stone-400 text-xs tracking-widest uppercase rounded-xl hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1V10z" />
          </svg>
          Home
        </button>
      </Link>

      <div className="relative z-10 w-full max-w-md mx-4">

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <svg className="w-8 h-8 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        <h2
          className="text-4xl font-black text-center text-stone-100 mb-2"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Welcome Back
        </h2>
        <p className="text-center text-stone-500 text-sm tracking-widest uppercase mb-8">Sign in to continue</p>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-red-400 text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">
                Email <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                required
                className="w-full bg-stone-800/60 border border-stone-700 text-stone-100 placeholder-stone-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/60 focus:bg-stone-800 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-2">
                Password <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                  className="w-full bg-stone-800/60 border border-stone-700 text-stone-100 placeholder-stone-600 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-amber-500/60 focus:bg-stone-800 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-400 transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-sm tracking-widest uppercase rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-900/30 hover:scale-[1.02] active:scale-95"
            >
              Login
            </button>

            <div className="relative flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-stone-800" />
              <span className="text-stone-600 text-xs tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-stone-800" />
            </div>

            <p className="text-center text-stone-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">
                Register
              </Link>
            </p>

          </form>
        </div>

        <p className="text-center text-stone-600 text-xs tracking-widest uppercase mt-6">
          Secure · Simple · Fast
        </p>
      </div>
    </div>
  );
}

export default Login;