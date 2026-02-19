import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Verify() {
  const [location, navigate] = useLocation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Auto fill user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("otpUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

   const parsed = JSON.parse(storedUser);
      setEmail(parsed.email);
  }, [location]);

  const handleVerify = async () => {

    if (!username) {
    setSuccess(false);
    setMessage("Please enter username");
    return;
  }
  
    if (!otp) {
      setSuccess(false);
      setMessage("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "http://localhost:5000/api/users/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("Logged in Successfully ✨");

        // ✅ Save token
        localStorage.setItem("token", data.token);


          // ⭐⭐⭐ USER SAVE (VERY IMPORTANT) ⭐⭐⭐
        sessionStorage.setItem("verifiedUser", JSON.stringify(data.user));

        // ⭐⭐⭐ NAVBAR KO SIGNAL ⭐⭐⭐
        window.dispatchEvent(new Event("userVerified"));

        // ✅ Clear temp data
        sessionStorage.removeItem("otpUser");

        // ✅ Redirect to home (HeroCarousel)
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setSuccess(false);
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl w-[420px] p-10 text-white">

        <h2 className="text-3xl font-semibold text-center mb-8">
          Verify OTP
        </h2>

        {message && (
          <div
            className={`mb-6 text-center py-2 rounded-lg text-sm ${
              success
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

       <input
  type="text"
  placeholder="Enter Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  className="w-full mb-5 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:border-yellow-500 outline-none"
/>

        <input
          type="email"
          value={email}
          readOnly
          className="w-full mb-5 px-4 py-3 rounded-lg bg-black/30 border border-gray-600 text-gray-400 outline-none"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-gray-600 focus:border-yellow-500 outline-none"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:scale-105 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
}
