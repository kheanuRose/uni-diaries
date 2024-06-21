// Import necessary modules and components from React, FontAwesome, Axios, and the Header component
import { useState, useEffect } from "react";
import axios from 'axios';
import Header from "./header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

function Professor_comments() {
    // State variables to manage comments, user input, error messages, and display toggling
    const [currentComment, setCurrentComment] = useState([]);
    const [professor_comment, setProfessorComment] = useState("");
    const [userName, setUserName] = useState("");
    const [professor_comments, setProfessorComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showComments, setShowComments] = useState(false);

    // useEffect hook to get the username from the token stored in local storage when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserName(decodedToken.name);
        }
    }, []);

    // Function to handle changes in the professor comment input field
    const handle_user_comment = (event) => {
        setProfessorComment(event.target.value);
    };

    // Function to add a new professor comment
    const add_user_comment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage("You need to be logged in to add a comment");
                return;
            }

            // Create a new comment object
            const added_user_comment = {
                name: userName,
                professor_comments: professor_comment
            };

            // Update the current comments state
            setCurrentComment(f => [...f, added_user_comment]);

            // Make a PATCH request to update the user's comments on the server
            await axios.patch(`http://localhost:9000/users/name/${userName}`, added_user_comment, {
                headers: {
                    'Authorization': token
                }
            });
            // Clear the input field after adding the comment
            setProfessorComment('');
        } catch (err) {
            console.log(`Error adding user comment: ${err}`);
            setErrorMessage("Error adding user comment.");
        }
    };

    // Function to fetch and render all professor comments
    const render_experience_comments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage("You need to be logged in to view comments");
                return;
            }

            // Make a GET request to fetch all users' comments from the server
            const res = await axios.get(`http://localhost:9000/users`, {
                headers: {
                    'Authorization': token
                }
            });
            // Update the state with fetched comments and set the flag to show comments
            setProfessorComments(res.data.data.users);
            setShowComments(true);
        } catch (err) {
            console.log(`Error fetching comments: ${err}`);
            setErrorMessage("Error fetching comments.");
        }
    };

    // Create a FontAwesomeIcon element to display user icons
    const element = <FontAwesomeIcon icon={faUser} className="user-college-experience-icon" />;

    // JSX to render the component
    return (
        <>
            {/* Render the Header component */}
            <Header />
            <div className="main-professor-div">
                {/* Input field for adding a new professor comment */}
                <input className="professor-experience-input" onChange={handle_user_comment} type="text" placeholder="Enter professor comment" value={professor_comment} />
                {/* Button to post the new comment */}
                <button className="professor-experience-button" onClick={add_user_comment}>Post</button>
                {/* Display error message if any */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {/* Section to display the user's comments */}
                <h1 className="professor-user-experience-text">Your Comments</h1>
                <div className="professor-experience-comment-container-2">
                    <div className="professor-experience-comment-container-3">
                        <ul>
                            {currentComment.map((item, index) => (
                                <li key={index}>
                                    <div className="user-icon-container">{element}</div>
                                    <strong className="professor-experience-username">{item.name}</strong>
                                    {/* Display professor comments, ensuring it's rendered correctly whether it's a string or an array */}
                                    {Array.isArray(item.professor_comments) ? (
                                        item.professor_comments.map((comment, commentIndex) => (
                                            <div key={commentIndex} className="professor-experience-comment">{comment}</div>
                                        ))
                                    ) : (
                                        <div className="professor-experience-comment">{item.professor_comments}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Section to display other professor comments */}
                <h1 className="other-professor-experience-text">Other Professor Comments</h1>
                {/* Button to fetch and display other professor comments */}
                <button className="render-professor-comments-button" onClick={render_experience_comments}>Review</button>
                <div className={`college-experience-rendered-container ${showComments ? 'slide-in' : ''}`}>
                    <ul>
                        {professor_comments.map((item, index) => (
                            <li key={index} className="professor-experience-comment-container">
                                <div>
                                    <div className="user-icon-container">{element}</div>
                                    <strong className="college-experience-username">{item.name}</strong>
                                    {/* Ensure professor_comment is an array */}
                                    {Array.isArray(item.professor_comments) ? (
                                        item.professor_comments.map((comment, commentIndex) => (
                                            <div key={commentIndex} className="college-experience-comment">{comment}</div>
                                        ))
                                    ) : (
                                        <div className="college-experience-comment">{item.professor_comments}</div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

// Export the Professor_comments component as the default export
export default Professor_comments;
