// routing componenents
import { useState, useEffect } from 'react';
import { Routes, Route , Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import axios from 'axios';


// import all pages files here
// 2.1.1. Login Screen
import LoginPage from './pages/Feature1/LoginPage.jsx';
import RegisterPage from './pages/Feature1/RegistrationPage.jsx';
// 2.1.2. Register Screen

import LandingPage from './pages/Feature1/LandingPage.jsx';
import HostedListingsPage from './pages/Feature1/HostedListingPage.jsx';
import Dashboard from './pages/Feature1/Dashboard.jsx';

function App() {
  const [token, setToken] = useState('CHECKING');
  const navigate = useNavigate();


  useEffect(() => {
    const lsToken = localStorage.getItem('token');
    setToken(lsToken);
  }, []);

  //2.1.3. Logout Button
  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5005/user/auth/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
    } catch (_) {
    }

    localStorage.removeItem('token');
    setToken(null);
    // A logout button, when clicked, logs you out and returns you 
    // to the landing screen.
    navigate('/landing');
  };

  return (
    <div>
      {/* Navigation Bar for all pages
      2.1.4. Items on all screens
      for a user who is logged in / authorised:
      [The logout button] exists somewhere
      A button exists that will take the user to the screen to view their [hosted listings].
      A button exists that will take the user to the screen to view [all listings].
      */}  
      <nav>
        <Grid container spacing={10}>
          <Grid container spacing={5}>

            {/* Home always links to "/"----> LandingPage */}
            {/* A button exists that will take the user to the screen to view [all listings] */}
            <Button component={Link} to="/" variant="contained" color="success">Home</Button>

            {token ? (
              <>{/* for a user who is logged in / authorised: */}
                {/*[Home] [hosted] [logout]*/}
                <Button component={Link} to="/hosted" variant="contained" color="success">Hosted</Button>
                <Button onClick={logout} variant="contained" color="success">Logout</Button>
              </>
            ) : (
              <>
                {/* for a user who is NOT logged in / authorised: */}
                {/*[Home] [login] [register]*/}
                <Button component={Link} to="/login" variant="contained" color="success">Login</Button>
                <Button component={Link} to="/register" variant="contained" color="success">Register</Button>
              </>
            )}

          </Grid>
        </Grid>
      </nav>

      <Routes>
        {token !== 'CHECKING' && (
          <>
            {/* DEFAULT PAGE */}
            {/* http://localhost:3000/--->LandingPage */}
            <Route path="/" element={<LandingPage />} />

            {/* AUTH */}
            {/* localhost:3000/login--->LoginPage */}
            <Route path="/login" element={<LoginPage setToken={setToken} />} />
            {/* localhost:3000/register--->RegisterPage  */}
            <Route path="/register" element={<RegisterPage setToken={setToken} />} />

            {/* HOSTED LISTINGS */}
            <Route path="/hosted" element={<HostedListingsPage />} />

            {/* DASHBOARD */}
            <Route path="/dashboard" element={<Dashboard token={token} />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
