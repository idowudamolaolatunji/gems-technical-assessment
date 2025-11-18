import { Outlet, Navigate } from 'react-router-dom'
import DashboardUI from '../components/ui/DashboardUI';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores';
import { selectIsAuthenticated } from '../stores/slices/authSlice';

export default function ProtectedRoute() {
    const isAuthenticated = useSelector((state: RootState) => 
        selectIsAuthenticated(state)
    );

    if (!isAuthenticated) {
        return <Navigate to={`/login`} replace />;
    }

    return (
        <DashboardUI>
            <Outlet />
        </DashboardUI>
    );
};