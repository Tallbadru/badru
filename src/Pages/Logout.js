import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication tokens or session data
    localStorage.removeItem('authToken'); // Assuming the token is stored in localStorage

    // Redirect to login page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Logout;