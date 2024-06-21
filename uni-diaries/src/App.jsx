import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Add_users from './components/add_users';
import Professor_comments from './components/professor_comments';
import Living_comments from './components/living_comments';
import College_experience from './components/college_experience';
import './App.css';
import './index.css'
import Signout from './components/signout';
import Account from './components/account';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(true); // New state to control the visibility of Login and Add_users components
  const [token, setToken] = useState(null); // State to store the token

  useEffect(() => {
    // Check if user is already logged in when component mounts
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      const storedToken = localStorage.getItem('token'); // Retrieve token from local storage
      if (storedToken) {
        setToken(storedToken); // Set token state
      }
    }
  }, []);

  const handleLogin = (token) => { // Update handleLogin to receive token
    setIsLoggedIn(true);
    setToken(token); // Set token state
    // Save login status and token to sessionStorage
    sessionStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', token); // Store token in local storage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null); // Clear token state
    // Remove login status and token from sessionStorage
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token'); // Remove token from local storage
  };

  const handleUserAdded = () => {
    setShowAuth(false); // Hide Login and Add_users components
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home onLogout={handleLogout} />} />
          <Route path="/professor_comments" element={<Professor_comments />} />
          <Route path="/living_comments" element={<Living_comments />} />
          <Route path="/college_experience" element={<College_experience />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/account" element={<Account />} /> {/* Pass the token as a prop to Account */}
        </Routes>
        {!isLoggedIn && showAuth && <Login onLogin={handleLogin} onUserAdded={handleUserAdded} />} {/* Pass the handleUserAdded function to Login component */}
      </Router>
    </>
  );
}

export default App;
