import React, { useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Add_users from "./add_users";
import logo from "../assets/uni-diaries-logo.png";

// Set up axios interceptor for adding token to requests
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

function Login({ onLogin, onUserAdded }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAddUsers, setShowAddUsers] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const userData = { email, password };
        try {
            const response = await axios.post('http://localhost:9000/users/login', userData);
            console.log('Response data:', response.data);
            if (response.data.status === 'success') {
                const token = response.data.token;
                localStorage.setItem('token', token);
                console.log('Token stored:', token);
                toast.success('Logged in successfully');
                onLogin(token); // Pass the token to onLogin
                navigate('/home');
            } else {
                toast.error(response.data.error || "Login failed");
                if (response.data.error === "Incorrect password") {
                    setPassword('');
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error(error.response?.data?.error || "Error during login. Please try again.");
        }
    };

    const handleSignUp = () => {
        setShowAddUsers(true);
    };

    return (
        <>
            <div className="login-container">
                <img className="logo" src={logo} alt="logo" />
                <div className="login-container-3">
                    <h1 className="login-text">Login to Your Account</h1>
                    <form onSubmit={handleLogin}>
                        <input placeholder="Email" className="login-input" type="text" value={email} onChange={handleEmailChange} /> <br />
                        <input placeholder="Password" className="login-input" type="password" value={password} onChange={handlePasswordChange} /> <br />
                        <button className="login-button" type="submit">Login</button>
                    </form>
                </div>
                <div className="login-container-2">
                    <div className="login-container-4">
                        <p className="signup-text">New Here?</p>
                        <p className="signup-text-2">Sign up and join our University community to share<br /> your thoughts and experiences</p>
                        <button className="signup-button" type="button" onClick={handleSignUp}>Sign Up</button>
                    </div>
                </div>
            </div>
            {showAddUsers && <Add_users onUserAdded={onUserAdded} />}
        </>
    );
}

export default Login;
