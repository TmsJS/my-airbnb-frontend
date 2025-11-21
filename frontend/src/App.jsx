// routing componenents
import { useState, useEffect } from 'react';
import { Routes, Route , Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import axios from 'axios';


// import all pages files from src/pages/Feature?/?.jsx
/* 2.1 AUTH */
import LoginPage from './pages/Feature1/LoginPage.jsx';
import RegisterPage from './pages/Feature1/RegistrationPage.jsx';
import Dashboard from './pages/Feature1/Dashboard.jsx';

/* 2.2 Hosted Listing */
import HostedListingsPage from './pages/Feature2/HostedListingPage.jsx';
import CreateListingPage from './pages/Feature2/CreateListingPage.jsx';
import EditListingPage from './pages/Feature2/EditListingPage.jsx';
import PublishListingPage from './pages/Feature2/PublishListingPage.jsx';

/* 2.3. Landing Page: Listings and Search*/
import LandingPage from './pages/Feature3/LandingPage.jsx';

/* 2.4. Viewing and Booking Listings*/
import ListingViewing from './pages/Feature4/ListingViewing.jsx';

/* 2.5. Removing a Listing, Managing Booking Requests */
import BookingManagementPage from './pages/Feature5/BookingManagementPage.jsx';

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
    } catch (_err) {
      console.log('Logout failed (ignored)');
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

            {/* Explore always links to "/"----> LandingPage */}
            {/* A button exists that will take the user to the screen to view [all listings] 
                Yeah, AirBnb call this button as Expore */}
            <Button component={Link} to="/" variant="contained" color="success">Explore</Button>

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
      {/* Routes */}
      <Routes>
        {token !== 'CHECKING' && (
          <>
            {/* 2.3 LandingPage / DEFAULT PAGE */}
            {/* http://localhost:3000/---> 2.3.1 LandingPage */}
            <Route path="/" element={<LandingPage />} />

            {/* 2.1 AUTH */}
            {/* localhost:3000/login--->LoginPage */}
            <Route path="/login" element={<LoginPage setToken={setToken} />} />
            {/* localhost:3000/register--->RegisterPage  */}
            <Route path="/register" element={<RegisterPage setToken={setToken} />} />
            {/* DASHBOARD */}
            <Route path="/dashboard" element={<Dashboard token={token} />} />

            {/* 2.2 HOSTED LISTINGS */}
            {/* 2.2.1 Hosted Listings Screen */}
            <Route path="/hosted" element={<HostedListingsPage />} />
            {/* 2.2.2 Create Listing */}
            <Route path="/hosted/create" element={<CreateListingPage />} />
            {/* 2.2.4 Edit Listing (with listing ID) */}
            <Route path="/hosted/edit/:id" element={<EditListingPage />} />
            {/* 2.2.5 Publish Listing */}
            <Route path="/hosted/publish/:id" element={<PublishListingPage />} />

            {/* 2.4 HOSTED LISTINGS */}
            <Route path="/listing/:id" element={<ListingViewing />} />

            {/* 2.5 REMOVING LISTINGS MANAGE BOOKING */}
            <Route path="/hosted/manage/:id" element={<BookingManagementPage />} />
            
          </>
        )}
      </Routes>

    </div>
  );
}

export default App;
