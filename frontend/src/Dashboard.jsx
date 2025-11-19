import { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useThemeProps } from '@mui/material/styles';

function Dashboard(props) {
    console.log(props);
    const navigate = useNavigate();
    useEffect(() => {
        if (!props.token) {
            navigate('/landing');
        }
    }, [props.token]);

return (
<>hey</>
)

}

export default Dashboard