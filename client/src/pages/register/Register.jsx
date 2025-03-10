import "./register.css"
import React, { useEffect, useState } from "react"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useNavigate } from "react-router-dom"
import CustomAlert from "../../components/alert/Alert"

const Register = () => {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [studentid, setStudentId] = useState("");
    const [staffid, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [usertype, setUserType] = useState("student");
    const [isValidStudentId, setIsValidStudentId] = useState(true);
    const [isValidStaffId, setIsValidStaffId] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const apiUrl = process.env.REACT_APP_API;

    const navigate = useNavigate();

    useEffect(() => {
        if (usertype !== "student") {
            setStudentId("");
            setIsValidStudentId(true);
        } else if (usertype !== "staff") {
            setStaffId("");
            setIsValidStaffId(true);
        }
    }, [usertype]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (usertype === "student" && !validateStudentId(studentid)) {
            setIsValidStudentId(false);
            return;
        }

        if (usertype === "staff" && !validateStaffId(staffid)) {
            setIsValidStaffId(false);
            return;
        }

        if (!validateEmail(email)) {
            setIsValidEmail(false);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        if (!validatePassword(password)) {
            setIsValidPassword(false);
            return;
        }

        const lowercaseEmail = email.toLowerCase();

        try {
            let requestBody;
            if (usertype === "student") {
                requestBody = JSON.stringify({ usertype, username, email: lowercaseEmail, studentid, password });
            } else if (usertype === "staff") {
                requestBody = JSON.stringify({ usertype, username, email: lowercaseEmail, staffid, password });
            } else {
                return;
            }
            const response = await fetch(apiUrl + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: requestBody
            });
            if (response.ok) {
                setShowAlert(true);
            } else {
                const errorResponse = await response.json();
                if (response.status === 400) {
                    setErrorMessage(errorResponse.error);
                } else {
                    console.error("Failed to register user.", errorResponse.error);
                }
            }
        } catch (error) {
            console.error("Error registering user.", error.message);
        }
    };

    const handleAlertClose = () => {
        setShowAlert(false);
        navigate("/");
    };

    const validateStudentId = (id) => {
        return /^\d{8}$/.test(id);
    };

    const validateStaffId = (id) => {
        return /^\d{8}$/.test(id);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }

    return (
        <div>
            <Navbar isRegisterPage={true} />
            <Header />
            <div className="register">
                <div className="rContainer">
                    <h2 className="registerTitle">Get Started with AppointMate</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>User Type</label>
                            <select
                                id="userType"
                                value={usertype}
                                onChange={(e) => setUserType(e.target.value)}
                                required
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                id="name"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="rInput"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setEmail(value)
                                    setIsValidEmail(validateEmail(value));
                                    setErrorMessage("");
                                }}
                                placeholder="Enter your email address"
                                className="rInput"
                                required
                            />
                            {!isValidEmail &&
                                <div
                                    className="error-message">Please enter a valid email address.
                                </div>
                            }
                        </div>
                        {usertype === "student" && (
                            <div className="form-group">
                                <label>Student ID</label>
                                <input
                                    type="text"
                                    id="studentid"
                                    value={studentid}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setStudentId(value);
                                        setIsValidStudentId(validateStudentId(value));
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your student ID"
                                    className="rInput"
                                    required
                                />
                                {!isValidStudentId &&
                                    <div
                                        className="error-message">Please enter a valid student ID (8 digits).
                                    </div>
                                }
                            </div>
                        )}
                        {usertype === "staff" && (
                            <div className="form-group">
                                <label>Staff ID</label>
                                <input
                                    type="text"
                                    id="staffid"
                                    value={staffid}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setStaffId(value);
                                        setIsValidStaffId(validateStaffId(value));
                                        setErrorMessage("");
                                    }}
                                    placeholder="Enter your staff ID"
                                    className="rInput"
                                    required
                                />
                                {!isValidStaffId &&
                                    <div
                                        className="error-message">Please enter a valid staff ID (8 digits).
                                    </div>
                                }
                            </div>
                        )}
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setPassword(value);
                                    setIsValidPassword(validatePassword(value));
                                    setPasswordsMatch(true);
                                }}
                                placeholder="Enter your password"
                                className="rInput"
                                required
                            />
                            {!isValidPassword &&
                                <div
                                    className="error-message">Please enter a valid password (minimum 8 characters with at least one uppercase and one number).
                                </div>
                            }
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setPasswordsMatch(true);
                                }}
                                placeholder="Confirm your password"
                                className="rInput"
                                required
                            />
                            {!passwordsMatch &&
                                <div
                                    className="error-message">Passwords do not match.
                                </div>
                            }
                        </div>
                        <button className="rButton">Sign up</button>
                    </form>
                    {errorMessage &&
                        <div
                            className="error-message">{errorMessage}
                        </div>}
                </div>
            </div>
            {showAlert && (
                <CustomAlert
                    message="User created successfully!"
                    onClose={handleAlertClose}
                />
            )}
        </div>
    );
};

export default Register;
