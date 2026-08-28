import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OnboardingOptions from "../components/OnboardingOptions";

export default function ProtectedRoute({ children }) {
  const { user: authUser, loading: authLoading } = useSelector(state => state.auth);
  const { user: profileUser } = useSelector(state => state.user);

  const user = profileUser || authUser;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <p className="animate-pulse font-medium text-sm">Loading CampusNest...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.company) {
    return <OnboardingOptions />;
  }

  return children;
}