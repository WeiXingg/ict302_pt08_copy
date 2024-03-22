import "./booking.css"
import React, { useContext, useState, useEffect } from "react"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import DayTimePicker from "@mooncake-dev/react-day-time-picker"
import CustomAlert from "../../components/alert/Alert"
import CheckToken from "../../hooks/CheckToken"
import ical from "ical-generator"
import emailjs from "emailjs-com"

const Booking = () => {
    const apiUrl = process.env.REACT_APP_API;
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
    const { showLogoutAlert, handleLogout } = CheckToken(user, dispatch);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user) {
                    return;
                }
                if (user.isStaff) {
                    navigate("/dashboard");
                }
                const lecturerResponse = await fetch(apiUrl + `/schedule/retrievelecturers?` +
                    `access_token=${encodeURIComponent(user?.access_token)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (lecturerResponse.ok) {
                    const lecturerData = await lecturerResponse.json();
                    if (lecturerData.lecturers) {
                        const filteredLecturers = lecturerData.lecturers.filter(lecturer => !lecturer.isAdmin);
                        setLecturer(filteredLecturers);
                    } else {
                        console.error("No lecturers found in lecturerData.");
                    }
                } else {
                    console.error("Error fetching lecturers.", lecturerResponse.message);
                }
                if (selectedLecturer) {
                    const bookedDatesResponse = await fetch(apiUrl + `/users/${selectedLecturer}?` +
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
    }, [user?.access_token, user, navigate, selectedLecturer, apiUrl]);

    const handleScheduled = async (date) => {
        setIsScheduling(true);
        setScheduleErr("");

        if (!selectedLecturer) {
            setShowLecturerAlert(true);
            setIsScheduling(false);
            return;
        }

        try {
            const check = await fetch(apiUrl + `/users/${selectedLecturer}?` +
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

            const response = await fetch(apiUrl + "/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    access_token: user?.access_token || "",
                    lecturer: selectedLecturer,
                    student: user.username,
                    studentid: user.studentid,
                    date: date
                }),
            });

            if (response.ok) {
                const updateBooked = await fetch(apiUrl + `/users/${selectedLecturer}?` +
                    `access_token=${encodeURIComponent(user?.access_token)}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ booked: date }),
                });
                if (updateBooked.ok) {

                    const selectedLecturerInfo = lecturer.find(lecturer => lecturer.username === selectedLecturer);
                    const lecturerEmail = selectedLecturerInfo.email;

                    const cal = ical({
                        domain: "https://ict302-pt08.vercel.app/",
                        name: "Appointment",
                    });

                    cal.createEvent({
                        start: date,
                        end: new Date(date.getTime() + 30 * 60 * 1000),
                        summary: "Appointment with Lecturer/Student",
                        description: "",
                        location: "Microsoft Teams",
                        organizer: {
                            name: selectedLecturer,
                            email: lecturerEmail,
                        },
                        attendees: [
                            {
                                name: user.username,
                                email: user.email,
                            },
                        ],
                    });

                    const calendarString = cal.toString();

                    sendEmail(selectedLecturer, lecturerEmail, user.username, date.toLocaleString(), calendarString);
                    sendEmail(user.username, user.email, selectedLecturer, date.toLocaleString(), calendarString);

                    setIsScheduled(true);
                } else {
                    console.error("Failed to update user.");
                }
            } else {
                console.error("response not ok.");
            }
        } catch (error) {
            console.error("Error.", error);
        }
        setIsScheduling(false);
    };

    const sendEmail = (to_name, to_email, with_name, date, calendarString) => {
        const blob = new Blob([calendarString], { type: "text/calendar" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onload = () => {
            const attachmentBase64 = reader.result.split(",")[1];

            emailjs.send(
                process.env.REACT_APP_SERVICE_ID,
                process.env.REACT_APP_BOOKING_TEMPLATE_ID,
                {
                    to_name,
                    to_email,
                    with_name,
                    date,
                    attachment: attachmentBase64,
                },
                process.env.REACT_APP_PUBLIC_KEY
            )
                .then((response) => {
                    console.log("Email sent successfully!", response.status, response.text);
                })
                .catch((error) => {
                    console.error("Email sending failed:", error);
                });
        };
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
                        <h2 className="bookingTitle">Book An Appointment</h2>
                        <div className="selection">
                            <label htmlFor="lecturerSelect">Select Lecturer:</label>
                            <select
                                id="lecturerSelect"
                                value={selectedLecturer}
                                onChange={(e) => setSelectedLecturer(e.target.value)}
                            >
                                {!selectedLecturer && <option value="">Select a lecturer</option>}
                                {lecturer.map((lecturer, index) => (
                                    <option
                                        key={index}
                                        value={lecturer.username}>{lecturer.username}
                                    </option>
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
                    message="Please select a lecturer."
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
