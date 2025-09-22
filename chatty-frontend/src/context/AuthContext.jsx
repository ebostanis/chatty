import { createContext, useEffect, useContext, useState} from "react";
import { login, signup, fetchProfile } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile()
                .then(response => {
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                })
                .finally(() => {setLoading(false)});
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = async (credentials) => {
        try {
            const response = await login(credentials);
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            const profile = await fetchProfile();
            
            setUser(profile.data);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            if (error.response) {
                return { 
                success: false,
                status: error.response.status,
                message: error.response.data.message || `Error: Invalid email or password` 
                };
            }
            return { success: false, message: 'Network error' };
        }
    };

    const handleSignup = async (userInfo) => {
        try {
            const response = await signup(userInfo);
            const { token } = response.data;

            localStorage.setItem('token', token);
            
            const profile = await fetchProfile();
            setUser(profile.data);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            if (error.response) {
                return {
                success: false,
                status: error.response.status,
                message: error.response.data.message || `Error: Email already in use`
                };
            }
            return { success: false, message: 'Network error' };
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        handleLogin,
        handleSignup,
        handleLogout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};