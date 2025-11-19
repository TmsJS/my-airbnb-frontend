import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';

function RegistrationPage(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName] = useState('');
    const [message, setMessage] = useState(''); 
    const [isError, setIsError] = useState(false);
    const [confirm_password, check_passwords_match] = useState('');
    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setIsError(false);
        setMessage("");
        setName("");
        setPassword("");
        setEmail("");
        check_passwords_match("");
    };

    const submit = async () => {
        const bodyObj = {email,password,name};

        if (password !== confirm_password) {
            setMessage('Error: The passwords you entered do not match.');
            setIsError(true);
            return; 
        }

        try{
            const response = await axios.post('http://localhost:5005/user/auth/register', bodyObj)
            console.log(response.message); 
           localStorage.setItem('token', response.data.token);
            props.setToken(response.data.token);
            navigate('/dashboard');
        }catch (error) {
            setMessage("status " + error.status + " INVALID INPUT");
            setIsError(true);  
            console.log(error.message);
        }
    }


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
        /> 
        <br />
        <TextField 
            id="register-name" 
            label='Name' 
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
        /> 
        <br />
        <TextField 
            id="register-password" 
            label ="Password" 
            type="password" 
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
        /> 
        <br/>
        <TextField 
            id="register-password-confirm" 
            label ="Confirm Password" 
            type="password" 
            variant="outlined"
            value={confirm_password}
            onChange={(event) => check_passwords_match(event.target.value)}
        /> 
        <br /> <br />
        <Button  onClick={submit} variant="outlined" color="secondary">Submit</Button>
        <br /> <br />
        <Link to="/login">Already Registered? Login Now</Link>
    </div>
  )
}

export default RegistrationPage