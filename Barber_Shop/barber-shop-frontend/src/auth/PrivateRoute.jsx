import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ roles = [] }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <h3>403 - Forbidden</h3>;
    }

    return <Outlet />;
}
