import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;  // Show a loading state while fetching user data
    }

    console.log('User in PrivateRoute:', user);

    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
        console.log('User role not authorized, redirecting to home');
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
