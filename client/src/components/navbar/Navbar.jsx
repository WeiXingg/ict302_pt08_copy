import { useNavigate } from "react-router-dom"
import "./navbar.css"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import { jwtDecode } from "jwt-decode"

const Navbar = ({ isLoginPage, isRegisterPage, isBookingPage, isUploadPage }) => {

  const { user, dispatch } = useContext(AuthContext) || { user: null, dispatch: () => { } };
  const navigate = useNavigate();
  const [countdownTime, setCountdownTime] = useState(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleLogoutEvent = (event) => {
      if (event.key === "access_token" && event.newValue === null) {
        dispatch({ type: "LOGOUT" }); // Dispatch logout action
        navigate("/"); // Navigate to home page or any appropriate page
      }
    };

    window.addEventListener("storage", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleLogoutEvent);
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    } else {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      // Update the countdown timer every second
      const interval = setInterval(() => {
        // Calculate the remaining time by subtracting the current time from the expiration time
        const remaining = expirationTime - Date.now();
        // Update the countdown time
        setCountdownTime(remaining > 0 ? remaining : 0);
      }, 1000);
      // Clean up interval when component unmounts or when remainingTime becomes null
      return () => clearInterval(interval);
    }
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  }

  const handleHome = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleBooking = () => {
    navigate("/booking");
  };

  const handleUpload = () => {
    navigate("/upload");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <button className="homeButton" onClick={handleHome}>AppointMate</button>
        {user ?
          <>
            <div className="leftSection">
              <div className="loggedInName">Logged in as: <strong>{user.username}</strong></div>
              {countdownTime !== null && (<div className="timer">(Auto logout in: {formatTime(countdownTime / 1000)})</div>)}
            </div>
            <div className="rightSection">
              {user.isStaff && <button disabled={isUploadPage} className="navButton" onClick={handleUpload}>Upload</button>}
              <button disabled={isBookingPage} className="navButton" onClick={handleBooking}>Booking</button>
              <button className="navButton" onClick={handleLogout}>Logout</button>
            </div>
          </>
          :
          <>
            <div className="rightSection">
              <button disabled={isRegisterPage} className="navButton" onClick={handleSignUp}>Sign up</button>
              <button disabled={isLoginPage} className="navButton" onClick={handleLogin}>Login</button>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default Navbar