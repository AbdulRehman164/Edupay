import { useAuth } from './AuthContext';
import { Navigate, Outlet } from 'react-router';

function RequireRole({ roles }) {
    const { user } = useAuth();
    if (!roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
}

export default RequireRole;
