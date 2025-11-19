import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';

// 2.1.2. Register Screen

// A unique route must exist for this screen
// 1.User must be able to enter their [email and password and name]
// 2.A [confirm password field] should exist where user re-enters their password.
// 3.If the two passwords don't match, the user should receive an error popup before submission.
// 4.If the form submission fails, [a reasonable error message] is shown
// 5.A [button] must exist to allow [submission] of form
// 6.The form must be able to be submitted on [enter key] in any of the fields

function RegistrationPage(props) {
  // 1. [email and password and name]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  // 2. A [confirm password field]
  const [confirm_password, check_passwords_match] = useState('');

  const [message, setMessage] = useState(''); 
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setIsError(false);
    setMessage("");
    setName("");
    setPassword("");
    setEmail("");
    check_passwords_match("");
  };
    // 5.A [button] must exist to allow [submission] of form
  const submit = async () => {
    const bodyObj = {email,password,name};

    // 3.If the two passwords don't match, the user should receive 
    // an error popup before submission.
    if (password !== confirm_password) {
      setMessage('Error: The passwords you entered do not match.');
      setIsError(true);
      return; 
    }

    try{
      const response = await axios.post('http://localhost:5005/user/auth/register', bodyObj)
      console.log(response.message); 
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email); 
      props.setToken(response.data.token);
      navigate('/dashboard');
    } //4. [a reasonable error message] 
    catch (error) {
      let msg = "";

      if (!error.response) {
        msg = "Cannot connect to server. Please try again later.";
      } else {
        const status = error.response.status;
        if (status === 400) {
          msg = error.response.data.error || "Invalid registration details.";
        } else if (status >= 500) {
          msg = "Server error. Please try again later.";
        } else {
          msg = `Error ${status}.`;
        }
      }

      setMessage(msg);
      setIsError(true);
    }

  }
  //6.The form must be able to be submitted on [enter key]
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };



  return (
    <div>
      {isError && (
        <Alert severity="error" onClose={handleCloseAlert}>{message}
        </Alert>
      )}
      <br />
      <TextField 
        id="register-email" 
        label="Email" 
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={handleKeyDown}
      /> 
      <br />
      <TextField 
        id="register-name" 
        label='Name' 
        variant="outlined"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={handleKeyDown}
      /> 
      <br />
      <TextField 
        id="register-password" 
        label ="Password" 
        type="password" 
        variant="outlined"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={handleKeyDown}
      /> 
      <br/>
      <TextField 
        id="register-password-confirm" 
        label ="Confirm Password" 
        type="password" 
        variant="outlined"
        value={confirm_password}
        onChange={(event) => check_passwords_match(event.target.value)}
        onKeyDown={handleKeyDown}
      /> 
      <br /> <br />
      <Button  onClick={submit} variant="outlined" color="secondary">Submit</Button>
      <br /> <br />
      <Link to="/login">Already Registered? Login Now</Link>
    </div>
  )
}

export default RegistrationPage