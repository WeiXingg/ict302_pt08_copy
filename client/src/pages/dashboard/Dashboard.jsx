import React, { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"
import "./dashboard.css"

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteAlert, setDeleteShowAlert] = useState(false);
  const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/schedule/retrievebookings?` +
          `username=${encodeURIComponent(user?.username)}&` +
          `access_token=${encodeURIComponent(user?.access_token)}`, {
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
        console.error("Error fetching bookings.");
      }
    };

    fetchBookings(); // Fetch bookings on component mount
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBookingAction = async (actionType, booking, setBookings) => {
    if (actionType === "delete") {
      try {
        const response = await fetch(`http://localhost:8800/api/schedule/${booking.lecturer}/${encodeURIComponent(booking.date)}?` +
          `access_token=${encodeURIComponent(user?.access_token)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          setDeleteShowAlert(true);
          setBookings(prevBookings => prevBookings.filter(prevBooking => prevBooking !== booking));
        } else {
          console.error("Failed to delete booking.");
        }
      } catch (error) {
        console.error("Error deleting booking.");
      }
    } else {
      console.error("Unsupported action.");
    }
    //   } else if (actionType === "update") {
    //     console.log("yet to implement");
    //   }
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="dashboardContainer">
        <h1 className="bookingsTitle">Your appointments</h1>
        <div className="bookingsContainer">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                key={index}
                className={`bookingItem ${selectedBooking === booking ? "selected" : ""
                  }`}
                onClick={() => handleBookingClick(booking)}
              >
                <div>
                  {user.usertype === "student" ? (
                    <>
                      <p>Lecturer: {booking.lecturer}</p>
                      <p>Date: {formatDate(booking.date)}</p>
                    </>
                  ) : user.usertype === "staff" ? (
                    <>
                      <p>Student: {booking.student}</p>
                      <p>Date: {formatDate(booking.date)}</p>
                    </>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
        {selectedBooking && (
          <div className="bookingActions">
            <button className="deleteButton" onClick={() => handleBookingAction("delete", selectedBooking, setBookings)}>Delete</button>
            {/* <button onClick={() => handleBookingAction("update", selectedBooking)}>Update</button> */}
          </div>
        )}
      </div>
      {showDeleteAlert && (
        <CustomAlert
          message="Booking deleted successfully!"
          onClose={() => setDeleteShowAlert(false)}
        />
      )}
      {showLogoutAlert && (
        <CustomAlert
          message="Your session has expired, please relogin."
          onClose={handleLogout}
        />
      )}
    </div>
  );
};

export default Dashboard;
