import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setSuccess(false);
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage("OTP Sent Successfully ✨");

        // Save user temporarily for verify page
        sessionStorage.setItem(
          "otpUser",
          JSON.stringify({ email })
        );

        setTimeout(() => {
         window.location.href = "/verify";
        }, 50);
      } else {
        setSuccess(false);
        setMessage(data.message || "Something went wrong ");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Server Error ");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="text-white mx-auto   p-8 rounded-lg bg-black/50 backdrop-blur-sm">

      <h2 className="text-2xl font-semibold text-center mb-6">
        Login
      </h2>

                {/* <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none"
            /> */}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-5 px-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none"
        />


              <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
          {loading ? "Sending..." : "Send OTP"}
        </button>

                  {message && (
            <div className={`mb-4 text-center text-sm ${success ? "text-green-400" : "text-red-400"}`}>
              {message}
            </div>
          )}


    </div>
  );
}
