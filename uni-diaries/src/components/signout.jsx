import React, { useState } from "react";
import Login from "./login";

// Signout component
function Signout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to handle user login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set isLoggedIn state to true
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set isLoggedIn state to false
  };

  return (
    <div>
      {isLoggedIn ? ( // Conditional rendering based on isLoggedIn state
        <>
          <button onClick={handleLogout}>Sign Out</button> {/* Button to handle logout */}
          <h1>Welcome!</h1> {/* Display welcome message when logged in */}
        </>
      ) : (
        <Login onLogin={handleLogin} /> // Render Login component when not logged in, pass handleLogin as a prop
      )}
    </div>
  );
}

export default Signout;
