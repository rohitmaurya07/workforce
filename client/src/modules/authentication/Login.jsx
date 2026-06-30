import { useState } from "react";
import { CircleUserRound, CircleUserRoundIcon, ShieldCheck, UserRound } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { googleLogin, login, register } from "./redux/authSlice";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";







//  Main Login Panel 
export default function LoginPanel() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth);
    

  async function handleSubmit() {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    const success = await dispatch(
      login({
        email,
        password,
      })
    );

    if (success) {
      navigate("/");
    }
    setLoading(false)
  }


  async function handleRegister() {
    setError("");
    if (!name || !email || !password) return setError("Please fill in all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const newUser = { email, name, avatar: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) };
    const token = createMockJWT({ email, name });
    setLoading(false);

    dispatch(
      register({
        name,
        email,
        password,
      })
    );
    doLogin(newUser, token);
  }



  // Google Login
  const handleSuccess = async (credentialResponse) => {
    try {
      const success = await dispatch(
  googleLogin(credentialResponse.credential)
);


      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.07] transition-colors duration-500 `} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.05] bg-indigo-400" />
      </div>



      <div className="relative w-full max-w-md">


        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab toggle */}
          <div className="flex border-b border-gray-800">
            {["login"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors capitalize ${tab === t ? "text-white border-b-2 border-blue-500 bg-gray-900" : "text-gray-500 hover:text-gray-300 bg-gray-950"
                  }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* Role selector */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">Sign in as</p>
              <div className="grid grid-cols-3 gap-2">

              </div>
            </div>

            {/* Google OAuth button */}
            {/* <button> */}
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            {/* <svg viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.9 29.5 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.1 3l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3.1 0 6 1.1 8.1 3l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.6 7.4 6.3 14.7z" />
                <path fill="#FBBC05" d="M24 46c5.4 0 10.3-1.9 14.1-5l-6.5-5.3C29.5 37.5 26.9 38.5 24 38.5c-5.4 0-10.1-3.5-11.8-8.4l-7.1 5.5C8.9 42.4 16 46 24 46z" />
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1 3.1-3.4 5.6-6.3 7.2l6.5 5.3C40.3 37.4 44.5 31.2 44.5 24c0-1.3-.2-2.7-.5-4z" />
              </svg> */}
            {/* Continue with Google
            </button> */}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">or with email</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Form */}
            <div className="space-y-3">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Rohit Sharma"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleSubmit() : handleRegister())}
                    placeholder="••••••••"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all pr-10"
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-950/50 border border-red-800/60 text-red-400 text-xs rounded-xl px-4 py-3">
                <span className="mt-px flex-shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}



            {/* Submit */}
            <button
              onClick={tab === "login" ? handleSubmit : handleRegister}
              disabled={loading}
              className={`w-full py-2.5 rounded-xl bg-amber-700 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60 `}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : `Sign in `}
            </button>

            {tab === "login" && (
              <p className="text-center text-xs text-gray-600">
                <button className="text-gray-400 hover:text-white transition-colors">Forgot password?</button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-5">
          Protected by JWT · Role-based access control · v1.0
        </p>
      </div>
    </div>
  );
}