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
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [usertype, setUserType] = useState("student");
    const [isValidStudentId, setIsValidStudentId] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (usertype !== "student") {
            setStudentId("");
            setIsValidStudentId(true);
        }
    }, [usertype]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (usertype === "student" && !validateStudentId(studentid)) {
            setIsValidStudentId(false);
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

        try {
            let requestBody;
            if (usertype === "student") {
                requestBody = JSON.stringify({ usertype, username, email, studentid, password });
            } else {
                requestBody = JSON.stringify({ usertype, username, email, password });
            }
            const response = await fetch(`${process.env.API}/auth/register`, {
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
        return /^\d{7}$/.test(id);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <div>
            <Navbar isRegisterPage={true} />
            <Header />
            <div className="register">
                <div className="rContainer">
                    <h2 className="registerTitle">Get Started with AppointMate</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userType">User Type</label>
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
                            <label htmlFor="name">Name</label>
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
                            <label htmlFor="email">Email Address</label>
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
                                <label htmlFor="studentid">Student ID</label>
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
                                        className="error-message">Please enter a valid student ID (7 digits).
                                    </div>
                                }
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setPasswordsMatch(true);
                                }}
                                placeholder="Enter your password"
                                className="rInput"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
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
