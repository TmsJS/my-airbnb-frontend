// routing componenents
import { useState, useEffect } from 'react';
import { Routes, Route , Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import axios from 'axios';


// all pages needed
import LandingPage from './pages/Feature1/LandingPage.jsx';
// 2.1.1. Login Screen
import LoginPage from './pages/Feature1//LoginPage.jsx';
// 2.1.2. Register Screen
import RegisterPage from './pages/Feature1//RegistrationPage.jsx';
import HostedListingsPage from './pages/Feature1//HostedListingPage.jsx';
import Dashboard from './pages/Feature1/Dashboard.jsx';


function App() {
  const [token,setToken] = useState('CHECKING');

  useEffect(() => {
    const lsToken = localStorage.getItem('token');
    setToken(lsToken);
  },[]);

  const logout = async () => {
    await axios.post('http://localhost:5005/user/auth/logout', {} ,{
      headers: {
              'Authorization' : `Bearer ${token}`,
      }
    });
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <div>
      <nav>
        {token ? (
          <>
          <Grid container spacing={100} justify='space-between'>
            <Grid container spacing = {5} justify='space-between'>
            <Button component={Link} to="/landing" variant="contained" color="success">Home</Button>
            <Button component={Link} to="/hosted" variant="contained" color="success">Hosted</Button></Grid>
            <Button onClick={logout} variant="contained" color="success">Logout</Button>
            </Grid>
            <br />
          </>
         
        ) : (
          <>
          <Grid container spacing={10} justify='space-between'>
            <Grid container justify='space-between'>
            <Button component={Link} to="/landing" variant="contained" color="success">Home</Button>
            <Button component={Link} to="/login" variant="contained" color="success">Login</Button>
            <Button component={Link} to="/register" variant="contained" color="success">Register</Button>
            </Grid></Grid>
            <br />
          </>
  
   
        )}   

      </nav>
      <Routes>
        {token !== 'CHECKING' && (

        <>
          {/* 2.3.1: Landing Screen (default screen) */}
          <Route path="/" element={<b>HOME</b>} /> 

          {/* 2.1.1: Login Screen (unique route) */}
          <Route path="/login" element={<LoginPage setToken={setToken}/>} /> 

          {/* 2.1.2: Register Screen (unique route) */}
          <Route path="/register" element={<RegisterPage setToken={setToken}/>} /> 

          {/* 2.2.1: Hosted Listings Screen (unique route)*/}
          <Route path="/hosted" element={<HostedListingsPage />} /> 

          <Route path="/landing" element={<LandingPage />} /> 

          <Route path="/dashboard" element={<Dashboard token={token}/>} />  
        </>
       
        
        )}
      </Routes>
    </div>
  );
}

export default App;