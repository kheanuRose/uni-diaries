import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'; // Make sure to use the correct icon set
import Header from "./header";
import axios from "axios";

function Account() {
    // State variables
    const [data, setData] = useState([]);       // State to hold user data
    const [file, setFile] = useState(null);     // State for selected file
    const [filename, setFilename] = useState('Choose File');  // State to display file name
    const [error, setError] = useState(null);   // State for error messages
    const [showUploadForm, setShowUploadForm] = useState(false); // State to toggle upload form
    const [user_bio, setuser_bio] = useState(""); // State for user bio
    const [newUsername, setNewUsername] = useState(""); // State for new username
    const [newEmail, setNewEmail] = useState(""); // State for new email
    const [password, setPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [campus, setCampus] = useState(""); // State for campus

    // useEffect to fetch user details on component mount
    useEffect(() => {
        userdetails();
    }, []); // Call userdetails function once when component mounts

    // Function to fetch user details from the server
    async function userdetails() {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        try {
            const res = await axios.get('http://localhost:9000/users/currentUser', {
                headers: {
                    'Authorization': token // Include the token in the headers
                }
            });
            console.log(res.data.user); // Log user data to console
            setData(res.data.user ? [res.data.user] : []); // Set user data in state
            setuser_bio(res.data.user.bio || ""); // Set user bio in state
            setCampus(res.data.user.campus || ""); // Set campus in state
        } catch (err) {
            console.log(err); // Log any errors to console
        }
    }

    // Function to handle file selection
    const onChange = (e) => {
        setFile(e.target.files[0]); // Update selected file state
        setFilename(e.target.files[0].name); // Update filename state
    };

    // Function to handle form submission for file upload
    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const formData = new FormData();
        formData.append('image', file); // Append selected file to FormData

        const token = localStorage.getItem('token'); // Get token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id

        try {
            const res = await axios.post(`http://localhost:9000/users/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token // Include token in headers for authentication
                }
            });

            console.log(res.data); // Log response data to console
            setError(null); // Clear any previous errors
            userdetails(); // Refresh user details after upload
            setShowUploadForm(false); // Hide the upload form after successful upload
        } catch (err) {
            if (err.response && err.response.status === 500) {
                console.log('There was a problem with the server'); // Log server error
            } else {
                setError(err.response ? err.response.data.msg : 'Unknown error'); // Set error state
                console.log(err.response ? err.response.data.msg : 'Unknown error'); // Log error message
            }
        }
    }

    function handle_user_bio(event) {
        setuser_bio(event.target.value);
    }

    const update_user_bio = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id
        try {
            const response = await axios.patch(`http://localhost:9000/users/bio/${userId}`, { bio: user_bio }, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(response.data);
            userdetails();
        } catch (err) {
            console.log(`unspecified error: ${err}`);
        }
    }

    const handleShowUploadForm = () => {
        setShowUploadForm(true); // Show the upload form
    }

    // Function to handle username change
    const handleUsernameChange = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id

        try {
            const response = await axios.patch(`http://localhost:9000/users/updateUsername/${userId}`,
                { newUsername },
                { headers: { 'Authorization': token } }
            );
            console.log(response.data);
            userdetails();
            alert("name updated successfully")
        } catch (err) {
            if (err.response && err.response.data.message === "Username already exists") {
                alert("Username already exists. Please choose a different one.");
            } else {
                console.log(`Error updating username: ${err}`);
            }
        }
    }

    const handleNewUsernameInput = (e) => {
        if (e.key === " ") {
            e.preventDefault();
        } else {
            setNewUsername(e.target.value);
        }
    }

    // Function to handle email change
    const handleEmailChange = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id

        try {
            const response = await axios.patch(`http://localhost:9000/users/updateEmail/${userId}`,
                { newEmail },
                { headers: { 'Authorization': token } }
            );
            console.log(response.data);
            userdetails();
            alert("email updated successfully")
        } catch (err) {
            if (err.response && err.response.data.message === "Email already exists") {
                alert("Email already exists. Please choose a different one.");
            } else {
                console.log(`Error updating email: ${err}`);
            }
        }
    }

    // Function to handle password change
    const handlePasswordChange = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id

        try {
            const response = await axios.patch(`http://localhost:9000/users/updatePassword/${userId}`,
                { password, confirmPassword },
                { headers: { 'Authorization': token } }
            );
            console.log(response.data);
            userdetails();
            alert("Password updated successfully");
        } catch (err) {
            if (err.response && err.response.data.message === "Passwords do not match") {
                alert("Passwords do not match. Please re-enter.");
            } else {
                console.log(`Error updating password: ${err}`);
            }
        }
    }

    // Function to handle campus change
    const handleCampusChange = async () => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const userId = data[0]._id; // Assuming data contains the user object with _id

        try {
            const response = await axios.patch(`http://localhost:9000/users/updateCampus/${userId}`,
                { campus },
                { headers: { 'Authorization': token } }
            );
            console.log(response.data);
            userdetails();
            alert("Campus updated successfully");
        } catch (err) {
            console.log(`Error updating campus: ${err}`);
        }
    }

    return (
        <>
            <Header />
            <div className="account-render-container-1">
                <div className="account-render-container-2">
                    <ul>
                        {data.map((item, index) => (
                            <li key={index}>
                                <div className="user-name">{item.name}</div>
                                <div className="user-email">@{item.email}</div>
                                <div className="image-gallery">
                                    {item.images && item.images.filter(img => img).map((img, i) => (
                                        <img className="profile-pic"
                                            key={i}
                                            src={`http://localhost:9000/${img.replace(/\\/g, '/')}`}
                                            alt="User Upload"
                                        />
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div title="Change Profile Picture" className="change-profile-photo" onClick={handleShowUploadForm}>{<FontAwesomeIcon icon={faPen} className="faPen" />}</div>
                    {error && <div className="profile-pic-error">{error}</div>}
                    {showUploadForm && (
                        <form onSubmit={onSubmit}>
                            <div className="file-container">
                                <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                                <label className="custom-file-label" htmlFor="customFile">{filename}</label><br /> <br />
                                <input type="submit" value="Upload" className="btn btn-primary btn-block" />
                            </div>
                        </form>
                    )}
                    <div className="add-bio-about">Add Bio/About</div>
                    <input type="text" className="user-bio" placeholder="Write here" value={user_bio} onChange={handle_user_bio} />
                    <button className="save-user-bio" onClick={update_user_bio}>Save</button>

                    <div className="change-username-container">
                        <div className="change-username-text">Change Username</div>
                        <input
                            placeholder="Name"
                            type="text"
                            className="change-username-input"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            onKeyDown={handleNewUsernameInput}
                        />
                        <button className="change-username-button" onClick={handleUsernameChange}>Change</button>
                    </div>

                    <div className="change-email-container">
                        <div className="change-email-text">Change Email</div>
                        <input
                            placeholder="Email"
                            type="email"
                            className="change-email-input"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                        />
                        <button className="change-email-button" onClick={handleEmailChange}>Change</button>
                    </div>

                    <div className="change-password-container">
                        <div className="change-password-text">Change Password</div>
                        <input
                            placeholder="Password"
                            type="password"
                            className="change-password-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            placeholder="Confirm Password"
                            type="password"
                            className="change-password-input"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button className="change-password-button" onClick={handlePasswordChange}>Change</button>
                    </div>

                    <div className="campus-container">
                        <div className="campus-text">Campus</div>
                        <input
                            placeholder="Location"
                            type="text"
                            className="campus-input"
                            value={campus}
                            onChange={e => setCampus(e.target.value)}
                        />
                        <button className="campus-button" onClick={handleCampusChange}>Set</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;
