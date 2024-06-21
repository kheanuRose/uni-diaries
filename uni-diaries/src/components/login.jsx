// Import necessary modules and components from React, axios, toast, react-router-dom, and local components
import React, { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Add_users from "./add_users"; // Assuming Add_users component is defined locally
import logo from "../assets/uni-diaries-logo.png"; // Assuming the path to the logo is correct

function Login({ onLogin, onUserAdded }) {
    // State variables to manage email, password, display of add users form, and navigation
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAddUsers, setShowAddUsers] = useState(false);
    const navigate = useNavigate(); // Hook from react-router-dom for navigation

    // Event handler for changes in the email input field
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    // Event handler for changes in the password input field
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Event handler for form submission (login)
    const handleLogin = async (event) => {
        event.preventDefault();

        // Data object containing email and password
        const userData = {
            email: email,
            password: password
        };

        try {
            // Make a POST request to login endpoint
            const response = await axios.post('http://localhost:9000/users/login', userData);
            console.log('Response data:', response.data);

            // Handle different scenarios based on response data
            if (response.data.message === 'Password is correct') {
                const token = response.data.token;
                localStorage.setItem('token', token); // Save the token to local storage
                console.log('Token stored:', token);
                toast.success('Logged in successfully'); // Display success toast notification
                alert('Logged in successfully')
                onLogin(); // Call the onLogin function passed as props
                navigate('/home'); // Navigate to '/home' route
            } else if (response.data.error === 'User does not exist') {
                toast.error("User doesn't exist"); // Display error toast for non-existing user
            } else {
                toast.error("Incorrect password"); // Display error toast for incorrect password
                setPassword(''); // Clear the password field
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error("Error during login. Please try again."); // Display error toast for login error
        }
    };

    // Event handler for sign up button click
    const handleSignUp = () => {
        setShowAddUsers(true); // Set showAddUsers state to true to display the Add_users component
    };

    // JSX to render the Login component
    return (
        <>
            <div className="login-container">
                <img className="logo" src={logo} alt="logo" /> {/* Render logo */}
                <div className="login-container-3">
                    <h1 className="login-text">Login to Your Account</h1>
                    <form onSubmit={handleLogin}>
                        {/* Input fields for email and password */}
                        <input placeholder="Email" className="login-input" type="text" value={email} onChange={handleEmailChange} /> <br />
                        <input placeholder="Password" className="login-input" type="password" value={password} onChange={handlePasswordChange} /> <br />
                        <button className="login-button" type="submit">Login</button> {/* Login button */}
                    </form>
                </div>
                <div className="login-container-2">
                    <div className="login-container-4">
                        <p className="signup-text">New Here?</p>
                        <p className="signup-text-2">Sign up and join our University community to share<br /> your thoughts and experiences</p>
                        <button className="signup-button" type="button" onClick={handleSignUp}>Sign Up</button> {/* Sign up button */}
                    </div>
                </div>
            </div>
            {/* Conditionally render the Add_users component if showAddUsers state is true */}
            {showAddUsers && <Add_users onUserAdded={onUserAdded} />}
        </>
    );
}

// Export the Login component as the default export
export default Login;
