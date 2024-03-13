import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import CustomAlert from "../../components/alert/Alert";
import CheckToken from "../../hooks/CheckToken";

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/schedule/retrievebookings?username=${encodeURIComponent(user?.username)}&access_token=${encodeURIComponent(user?.access_token)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
      }
    };

    fetchBookings(); // Fetch bookings on component mount
  }, [user]); // Dependency array to ensure useEffect runs when user changes

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="dashboardContainer">
        <h1 className="dashboardTitle">Dashboard</h1>
        {error && <p>{error}</p>}
        {bookings.length > 0 && (
          <ul>
            {bookings.map((booking, index) => (
              <li key={index}>
                <div>
                  <p>Lecturer: {booking.lecturer}</p>
                  <p>Date: {formatDate(booking.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {bookings.length === 0 && !error && <p>No bookings found.</p>}
      </div>
      {showLogoutAlert && (<CustomAlert message="Your session has expired, please relogin." onClose={handleLogout} />)}
    </div>
  );
};

export default Dashboard;
