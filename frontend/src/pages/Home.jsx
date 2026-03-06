import { Link } from "react-router-dom";

function Home() {
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

      <div className="relative z-10 text-center px-10 py-16 max-w-lg w-full mx-4">

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-900/40">
            <svg className="w-8 h-8 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l1.5-6h15L21 10M3 10h18M3 10v10a1 1 0 001 1h5v-5h6v5h5a1 1 0 001-1V10" />
            </svg>
          </div>
        </div>

        <h1
          className="text-5xl font-black tracking-tight text-stone-100 mb-3 leading-none"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          Room{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Booking
          </span>
        </h1>
        <p className="text-stone-400 text-lg mb-1 font-light tracking-wide">System</p>

        <div className="w-12 h-px bg-amber-500/40 mx-auto my-6" />

        <p className="text-stone-500 text-sm tracking-widest uppercase mb-12">
          Book rooms easily
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-bold text-sm tracking-widest uppercase rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-800/50 hover:scale-105 active:scale-95">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-8 py-3 border border-stone-700 text-stone-300 font-bold text-sm tracking-widest uppercase rounded-xl hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-200 hover:scale-105 active:scale-95">
              Register
            </button>
          </Link>
        </div>

        <p className="mt-12 text-stone-700 text-xs tracking-widest uppercase">
          Secure · Simple · Fast
        </p>
      </div>
    </div>
  );
}

export default Home;
