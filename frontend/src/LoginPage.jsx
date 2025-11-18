import { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';

function LoginPage(props) {
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

    const submit = async () => {
        const bodyObj = {email,password};
        try{
            const response = await axios.post('http://localhost:5005/user/auth/login', bodyObj)
            localStorage.setItem('token', response.data.token);
            props.setToken(response.data.token);
            navigate('/dashboard');
            
        }catch (error) {
            setMessage("status " + error.status + " INVALID CREDENTIALS");
            setIsError(true);  
            console.log(error.message);
        }
    }


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
        /> 
        <br />
        <TextField 
            id="login-password" 
            label ="Password" 
            type="password" 
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
        /> 
        <br /><br/>
         <Button onClick={submit} variant="outlined" color="secondary">Submit</Button>
        <br /> <br/>
        <Link to="/register">Not Registered? Register Now</Link>
    </div>
  )
}

export default LoginPage