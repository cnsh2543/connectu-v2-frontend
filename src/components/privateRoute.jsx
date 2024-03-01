import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { authenticate } from '../utils/helper';
import { AuthContext } from '../utils/authContext';

const PrivateRoute = () => {
    const { username, setUsername } = useContext(AuthContext);
    const { uni, setUni } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            if (username !== null) {
              setIsAuthenticated(true);
            } else {
              const result = await authenticate(document.cookie);
              if (result.username !== undefined) {
                setUsername(result.username);
                setUni(result.uni)
                setIsAuthenticated(true);
              } else {
                setIsAuthenticated(false);
              }
            }
          } catch (error) {
            console.error("Error during authentication:", error);
            // Handle errors, e.g., redirect to an error page
          } finally {
            setLoading(false);
          }
        };
        
        checkAuthentication();
      }, []);

      if (loading) {
        // You can render a loading indicator here
        return <div>Loading...</div>
      }
  
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };

export default PrivateRoute