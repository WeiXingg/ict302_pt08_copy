import React, { useContext, useState, useEffect } from "react"
import "./booking.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import DayTimePicker from "@mooncake-dev/react-day-time-picker"
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"

const Booking = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const [lecturer, setLecturer] = useState([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleErr, setScheduleErr] = useState("");
    const [bookedDates, setBookedDates] = useState([]);
    const [showLecturerAlert, setShowLecturerAlert] = useState(false);
    const [showBookedAlert, setShowBookedAlert] = useState(false);
    const navigate = useNavigate();
    // Check if token still valid
    const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user) {
                    return;
                }

                // Fetch lecturer data
                const lecturerResponse = await fetch(`http://localhost:8800/api/schedule/retrievelecturers?` +
                    `access_token=${encodeURIComponent(user?.access_token)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (lecturerResponse.ok) {
                    const lecturerData = await lecturerResponse.json();
                    setLecturer(lecturerData.usernames);
                } else {
                    console.error("Error fetching lecturers.", lecturerResponse.message);
                }

                // Fetch booked dates if a lecturer is selected
                if (selectedLecturer) {
                    const bookedDatesResponse = await fetch(`http://localhost:8800/api/users/${selectedLecturer}?` +
                        `access_token=${encodeURIComponent(user?.access_token)}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (bookedDatesResponse.ok) {
                        const bookedDatesData = await bookedDatesResponse.json();
                        setBookedDates(bookedDatesData.booked);
                    } else {
                        console.error("Error fetching booked dates.", bookedDatesResponse.message);
                    }
                }
            } catch (error) {
                console.error("Error fetching data.", error.message);
            }
        };

        fetchData();
    }, [user?.access_token, user, selectedLecturer]);

    const handleScheduled = async (date) => {
        setIsScheduling(true);
        setScheduleErr("");

        if (!selectedLecturer) {
            setShowLecturerAlert(true);
            setIsScheduling(false);
            return;
        }

        try {
            const check = await fetch(`http://localhost:8800/api/users/${selectedLecturer}?` +
                `access_token=${encodeURIComponent(user?.access_token)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!check.ok) {
                console.error("Error fetching booked dates.", check.message);
                setIsScheduling(false);
                return;
            }
            const data = await check.json();
            const updatedBookedDates = data.booked;

            // Check if the selected date is already booked
            const isBooked = updatedBookedDates.some(bookedDate => {
                const bookedDateTime = new Date(bookedDate);
                return bookedDateTime.getTime() === date.getTime();
            });

            if (isBooked) {
                setBookedDates(data.booked);
                setShowBookedAlert(true);
                setIsScheduling(false);
                return;
            }

            const response = await fetch("http://localhost:8800/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_token: user?.access_token || "",
                    lecturer: selectedLecturer,
                    student: user.username, date: date
                }),
            });

            if (response.ok) {
                const updateBooked = await fetch(`http://localhost:8800/api/users/${selectedLecturer}?` +
                    `access_token=${encodeURIComponent(user?.access_token)}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ booked: date }),
                });
                if (updateBooked.ok) {
                    setIsScheduled(true);
                } else {
                    console.error("Failed to update user.");
                }
            } else {
                console.error("response not ok.");
            }
        } catch (error) {
            console.error("Error.", error.message);
        }
        setIsScheduling(false);
    };

    const timeSlotValidator = (slotTime) => {
        for (const bookedDate of bookedDates) {
            const bookedDateTime = new Date(bookedDate);
            if (slotTime.getDate() === bookedDateTime.getDate() &&
                slotTime.getMonth() === bookedDateTime.getMonth() &&
                slotTime.getFullYear() === bookedDateTime.getFullYear() &&
                slotTime.getHours() === bookedDateTime.getHours() &&
                slotTime.getMinutes() === bookedDateTime.getMinutes()) {
                return false;
            }
        }
        const minTime = new Date(
            slotTime.getFullYear(),
            slotTime.getMonth(),
            slotTime.getDate(),
            8, // 8 AM
            0,
            0
        );
        const maxTime = new Date(
            slotTime.getFullYear(),
            slotTime.getMonth(),
            slotTime.getDate(),
            18, // 6 PM
            0,
            0
        );
        return slotTime >= minTime && slotTime <= maxTime;
    };

    const handleCloseAlert = (alertType) => {
        if (alertType === "LecturerAlert") {
            setShowLecturerAlert(false);
        } else if (alertType === "BookedAlert") {
            setShowBookedAlert(false);
        }
    };

    return (
        <div>
            <Navbar isBookingPage={true} />
            <Header />
            <div className="container">
                {!isScheduled && (
                    <div>
                        <h2 className="bookingTitle">Book an appointment</h2>
                        <div className="selection">
                            <label htmlFor="lecturerSelect">Select Lecturer:</label>
                            <select
                                id="lecturerSelect"
                                value={selectedLecturer}
                                onChange={(e) => setSelectedLecturer(e.target.value)}
                            >
                                {!selectedLecturer && <option value="">Select a lecturer</option>}
                                {lecturer.map((lecturer, index) => (
                                    <option key={index} value={lecturer}>{lecturer}</option>
                                ))}
                            </select>
                        </div>
                        <h3>Pick a Day and Time</h3>
                    </div>
                )}
                {isScheduled && (
                    <span
                        className="lecturerSelected">Lecturer: {selectedLecturer}
                    </span>
                )}
                <DayTimePicker
                    timeSlotSizeMinutes={30}
                    isLoading={isScheduling}
                    isDone={isScheduled}
                    timeSlotValidator={timeSlotValidator}
                    err={scheduleErr}
                    onConfirm={handleScheduled}
                    confirmText="Book now"
                    loadingText="Booking..."
                    doneText="Booking confirmed!"
                />
                {isScheduled && (
                    <button
                        className="home"
                        onClick={() => navigate("/dashboard")}>Home
                    </button>
                )}
            </div>
            {showLecturerAlert && (
                <CustomAlert
                    message="Please select a lecturer"
                    onClose={() => handleCloseAlert("LecturerAlert")}
                />
            )}
            {showBookedAlert && (
                <CustomAlert
                    message="This date and time slot is already booked. Please choose a different slot."
                    onClose={() => handleCloseAlert("BookedAlert")}
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

export default Booking;
