import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#121212',
        color: 'white' 
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : null;
};

export default ProtectedRoute;
