// Import necessary modules and components from React, FontAwesome, Axios, and the Header component
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import Header from "./header";

function College_experience() {
    // State variables to manage comments, user input, error messages, and display toggling
    const [currentComment, setCurrentComment] = useState([]);
    const [experience_comment, setExperience_comment] = useState("");
    const [userName, setUserName] = useState("");
    const [experience_comments, setExperience_comments] = useState([]);
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

    // Function to handle changes in the comment input field
    const handle_user_comment = (event) => {
        setExperience_comment(event.target.value);
    };

    // Function to add a new comment
    const add_experience_comment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage("You need to be logged in to add a comment");
                return;
            }

            // Create a new comment object
            const added_experience_comment = {
                name: userName,
                experience_comments: [experience_comment] // Store the comment as an array
            };

            // Update the current comments state
            setCurrentComment(c => [...c, added_experience_comment]);

            // Make a PATCH request to update the user's comments on the server
            await axios.patch(`http://localhost:9000/users/name/${userName}`, added_experience_comment, {
                headers: {
                    'Authorization': token
                }
            });
            // Clear the input field after adding the comment
            setExperience_comment('');
        } catch (err) {
            console.log(`Error adding user comment: ${err}`);
            setErrorMessage("Error adding user comment.");
        }
    };

    // Function to fetch and render all experience comments
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
            setExperience_comments(res.data.data.users);
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
            <div className="main-college-experience-div">
                 {/* Input field for adding a new college experience comment */}
                <input className="college-experience-input" onChange={handle_user_comment} type="text" placeholder="Your college experience" value={experience_comment} />
                {/* Button to post the new comment */}
                <button className="college-experience-button" onClick={add_experience_comment}>Post</button>
                
                {/* Display error message if any */}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                {/* Section to display the user's comments */}
                <h1 className="college-user-experience-text">Your College Experience</h1>
                <div className="college-experience-comment-container-2">
                    <div className="college-experience-comment-container-3">
                        <ul>
                            {currentComment.map((item, index) => (
                                <li key={index}>
                                    <div className="user-icon-container">{element}</div>
                                    <strong className="college-experience-username">{item.name}</strong>
                                    {item.experience_comments.map((comment, commentIndex) => (
                                        <div key={commentIndex} className="college-experience-comment">{comment}</div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Section to display other students' comments */}
                <h1 className="other-college-experience-text">Other Student Experiences</h1>
                {/* Button to fetch and display other students' comments */}
                <button className="render-experience-comments-button" onClick={render_experience_comments}>Review</button>
                <div className={`college-experience-rendered-container ${showComments ? 'slide-in' : ''}`}>
                    <ul>
                        {experience_comments.map((item, index) => (
                            <li key={index} className="college-experience-comment-container">
                                <div className="">
                                    <div className="user-icon-container">{element}</div>
                                    <strong className="college-experience-username">{item.name}</strong>
                                    {item.experience_comments.map((comment, commentIndex) => (
                                        <div key={commentIndex} className="college-experience-comment">{comment}</div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
           
        </>
    );
}

// Export the College_experience component as the default export
export default College_experience;
