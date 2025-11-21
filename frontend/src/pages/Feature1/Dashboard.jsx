import { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useThemeProps } from '@mui/material/styles';
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome!</p>
    </div>
  );
}

export default Dashboard;
