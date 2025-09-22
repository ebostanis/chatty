import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box 
                display="flex"
                justifyContent="center"
                alignItems="center" 
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }
        
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;