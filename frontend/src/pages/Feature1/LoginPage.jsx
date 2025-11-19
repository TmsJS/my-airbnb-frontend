import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
// 2.1.1. Login Screen

// A unique route must exist for this screen
// 1.User must be able to enter their [email and password].
// 2.If the form submission fails, a reasonable [error message] is shown
// 3.A [button] must exist to allow [submission] of form
// 4.The form must be able to be submitted on [enter key] in any of the fields

function LoginPage(props) {
  // 1.User must be able to enter their email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const [message, setMessage] = useState(''); 
  const [isError, setIsError] = useState(false);

    const handleCloseAlert = () => {
      setIsError(false);
      setMessage("");
      setPassword("");
      setEmail("");
  };
    // Submit function 
    const submit = async () => {
      const bodyObj = { email, password };

      try {
        const response = await axios.post(
          'http://localhost:5005/user/auth/login',
          bodyObj
        );

        localStorage.setItem('token', response.data.token);
        props.setToken(response.data.token);
        navigate('/dashboard');

      } catch (error) {
        let msg = "";

        if (!error.response) {
          // Network connection error
          msg = "Unable to connect to server, please check your network.";
        } else {
          const status = error.response.status;

          if (status === 400) {
            msg = "Invalid email or password.";
          } else if (status === 403) {
            msg = "You are not allowed to log in.";
          } else if (status >= 500) {
            msg = "Server error. Please try again later.";
          } else if (error.response.data?.error) {
            msg = error.response.data.error;  // From backend
          } else {
            msg = `Unexpected error (status ${status}).`;
          }
        }

        setMessage(msg);
        setIsError(true);
      }
    };


    // 4.The form must be able to be submitted on [enter key] in any of the fields
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        submit(); 
      }
    };


  return (
    <div>
      <br />
        {isError && (
              <Alert severity="error" onClose={handleCloseAlert}>{message}
              </Alert>
          )}
        <br />
        <TextField 
            id="login-email" 
            label="Email" 
            variant="outlined"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={handleKeyDown}
        /> 
        <br />
        <TextField 
            id="login-password" 
            label ="Password" 
            type="password" 
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleKeyDown}
        /> 
        <br /><br/>
         {/*3.A button must exist to allow submission of form*/}
         <Button onClick={submit} variant="outlined" color="secondary">Submit</Button>
        <br /> <br/>
        <Link to="/register">Not Registered? Register Now</Link>
    </div>
  )
}

export default LoginPage