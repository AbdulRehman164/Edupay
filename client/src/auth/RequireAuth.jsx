import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';
import Loader from '../ui/Loader';

const RequireAuth = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Loader />;
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
