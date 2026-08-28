import { useState } from "react";
import { CircleUserRound, ShieldCheck, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, googleLogin, login, register, resetPassword } from "../redux/authSlice";
import CompanyWizard from "./CompanyWizard";
import toast from "react-hot-toast";

export default function LoginPanel() {
  const [tab, setTab] = useState("login"); // "login" | "register" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetTokenInput, setResetTokenInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCompanyWizard, setShowCompanyWizard] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    setSuccessMsg("");
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
    setLoading(false);
  }

  async function handleRegister() {
    setError("");
    setSuccessMsg("");
    if (!name || !email || !password) return setError("Please fill in all required fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    setLoading(true);

    const success = await dispatch(
      register({
        name,
        email,
        password,
      })
    );

    if (success) {
      navigate("/");
    }
    setLoading(false);
  }

  async function handleForgotPassword() {
    setError("");
    setSuccessMsg("");
    if (!email) return setError("Please enter your email address.");
    setLoading(true);

    const result = await dispatch(forgotPassword(email));
    if (result && result.success) {
      setSuccessMsg(result.message || "Reset token generated.");
      if (result.resetToken) {
        setResetTokenInput(result.resetToken);
        setTab("reset");
      }
    }
    setLoading(false);
  }

  async function handleResetPassword() {
    setError("");
    setSuccessMsg("");
    if (!resetTokenInput || !newPassword) return setError("Please enter token and new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters long.");
    setLoading(true);

    const success = await dispatch(resetPassword(resetTokenInput, newPassword));
    if (success) {
      setSuccessMsg("Password reset successfully. Please sign in with your new password.");
      setTab("login");
      setPassword("");
    }
    setLoading(false);
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const success = await dispatch(
        googleLogin(credentialResponse.credential)
      );

      if (success) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (showCompanyWizard) {
    return <CompanyWizard />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-[0.07] bg-indigo-500 transition-colors duration-500" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.05] bg-indigo-400" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab toggle */}
          {tab !== "forgot" && tab !== "reset" && (
            <div className="flex border-b border-gray-800">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors capitalize ${
                    tab === t
                      ? "text-white border-b-2 border-indigo-500 bg-gray-900"
                      : "text-gray-500 hover:text-gray-300 bg-gray-950"
                  }`}
                >
                  {t === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          )}

          {(tab === "forgot" || tab === "reset") && (
            <div className="px-6 pt-5 pb-2 flex items-center justify-between border-b border-gray-800">
              <h2 className="text-sm font-medium text-white capitalize">
                {tab === "forgot" ? "Forgot Password" : "Reset Password"}
              </h2>
              <button
                onClick={() => {
                  setTab("login");
                  setError("");
                  setSuccessMsg("");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="p-6 space-y-5">
            {tab === "login" && (
              <>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                />

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-xs text-gray-600">or with email</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
              </>
            )}

            {/* Form Fields */}
            <div className="space-y-3">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rohit Sharma"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              )}

              {(tab === "login" || tab === "register" || tab === "forgot") && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              )}

              {(tab === "login" || tab === "register") && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (tab === "login" ? handleSubmit() : handleRegister())
                      }
                      placeholder="••••••••"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs transition-colors"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "reset" && (
                <>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      value={resetTokenInput}
                      onChange={(e) => setResetTokenInput(e.target.value)}
                      placeholder="Paste your reset token"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Notifications / Errors */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-950/50 border border-red-800/60 text-red-400 text-xs rounded-xl px-4 py-3">
                <span className="mt-px flex-shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs rounded-xl px-4 py-3">
                <span className="mt-px flex-shrink-0">✓</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={
                tab === "login"
                  ? handleSubmit
                  : tab === "register"
                  ? handleRegister
                  : tab === "forgot"
                  ? handleForgotPassword
                  : handleResetPassword
              }
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </span>
              ) : tab === "login" ? (
                "Sign in"
              ) : tab === "register" ? (
                "Create Account"
              ) : tab === "forgot" ? (
                "Send Reset Link"
              ) : (
                "Reset Password"
              )}
            </button>

            {tab === "login" && (
              <div className="space-y-2 pt-2 text-center text-xs text-gray-500">
                <p>
                  <button
                    onClick={() => {
                      setTab("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </p>
                <p>
                  <button
                    onClick={() => setShowCompanyWizard(true)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Register your Organization / Company
                  </button>
                </p>
              </div>
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