import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useSelector(state => state.auth);

if (loading) {
    return <h1>Loading...</h1>; 
}

if (!user) {
    return <Navigate to="/login" replace />;
}

return children;

}