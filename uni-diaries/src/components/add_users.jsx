import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Add_users component
function Add_users() {
  const [name, setName] = useState(''); // State to store name input
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [confirmPassword, setConfirmPassword] = useState(''); // State to store confirm password input
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle name input change
  const handleNameChange = (event) => {
    const trimmedName = event.target.value.replace(/\s/g, ''); // Remove all spaces from name input
    setName(trimmedName); // Update name state with the trimmed value
  };

  // Function to handle form submission
  const addUserDetails = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required. Please fill in all fields."); // Set error message if any field is empty
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again."); // Set error message if passwords do not match
      return;
    }

    const newUser = {
      name: name,
      email: email,
      password: password
    }; // Prepare new user data

    try {
      // Make a POST request to add new user
      const response = await axios.post('http://localhost:9000/users', newUser);
      
      // Clear input fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage(''); // Clear any previous error message

      window.alert('Account created successfully, Login'); // Show success alert

      // Navigate to sign out or any other page
      navigate('/signout');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;

        // Check if the error is due to duplicate email
        if (errorMessage.includes("Email already exists")) {
          setErrorMessage("Email already exists. Please use a different email.");
        } else if (errorMessage.includes("Username already exists")) {
          // Check if the error is due to duplicate username
          setErrorMessage("Username already exists. Please use a different username.");
        } else {
          setErrorMessage(`Error adding user: ${errorMessage}`);
        }
      } else {
        setErrorMessage("Error adding user. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="add-user-container">
        <div className="add-user-container-2">
          <h1 className="add-user-text">Create Account</h1>
          <div>
            <form onSubmit={addUserDetails}>
              <input placeholder="Username" className="add-user-input" type="text" value={name} onChange={handleNameChange} /> <br />
              <input placeholder="Email" className="add-user-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
              <input placeholder="Password" className="add-user-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
              <input placeholder="Confirm Password" className="add-user-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button className="add-user-button" type="submit">Create</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Add_users;
