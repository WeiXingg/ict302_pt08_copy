import "./dashboard.css";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext"
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"

const Dashboard = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNoBookingAlert, setShowNoBookingAlert] = useState(false);
  const [showDeleteAlert, setDeleteShowAlert] = useState(false);
  const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) {
          return;
        }
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

    fetchBookings();
  }, [user]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const clearSelection = () => {
    setSelectedBooking(null);
  };

  const handleBookingAction = async (booking) => {
    try {
      if (!selectedBooking) {
        setShowNoBookingAlert(true);
        return;
      }
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
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const calendar = [];

    // Blank placeholders for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Rendering days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const bookingsForDay = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return (
          bookingDate.getFullYear() === date.getFullYear() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getDate() === date.getDate()
        );
      });

      calendar.push(
        <div key={date} className="calendar-day">
          <div className="day-number">{day}</div>
          <ul>
            {bookingsForDay.map((booking, index) => (
              <li
                key={index}
                className={`bookingDetails ${selectedBooking === booking ? 'selected' : ''}`}
                onClick={() => handleBookingClick(booking)}
              >
                {user.usertype === 'student' ? (
                  <>
                    Lecturer: {booking.lecturer}
                    <br />
                    Time: {new Date(booking.date).toLocaleTimeString()}
                  </>
                ) : (
                  <>
                    Student: {booking.student}
                    <br />
                    Time: {new Date(booking.date).toLocaleTimeString()}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return calendar;
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h2>{currentDate.toLocaleDateString("default", { month: "long", year: "numeric" })}</h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">{renderCalendar()}</div>
      </div>
      <div className="buttonContainer">
        <button className="clear" onClick={clearSelection}>Clear Selection</button>
        <button className="delete" onClick={() => handleBookingAction(selectedBooking)}>Delete</button>
      </div>
      {showNoBookingAlert && (
        <CustomAlert
          message="No booking selected."
          onClose={() => setShowNoBookingAlert(false)}
        />
      )}
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
