import { Navigate } from 'react-router';
import { useAuth } from './AuthContext';
import Loader from '../ui/Loader';

function RedirectRole() {
    const { user, isLoading } = useAuth();
    if (isLoading) return <Loader />;

    if (!user) return null;

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" replace />;
        case 'hr':
            return <Navigate to="/hr" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
}

export default RedirectRole;
