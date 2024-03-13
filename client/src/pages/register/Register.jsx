import React, { useEffect, useState } from "react"
import "./register.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useNavigate } from "react-router-dom"
import CustomAlert from "../../components/alert/Alert"

const Register = () => {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [studentid, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [usertype, setUserType] = useState("student");

    const navigate = useNavigate();

    useEffect(() => {
        if (usertype !== "student") {
            setStudentId("");
        }
    }, [usertype]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let requestBody;
            if (usertype === "student") {
                requestBody = JSON.stringify({ usertype, username, email, studentid, password });
            } else {
                requestBody = JSON.stringify({ usertype, username, email, password });
            }
            const response = await fetch("http://localhost:8800/api/auth/register", {
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

    return (
        <div>
            <Navbar isRegisterPage={true} />
            <Header />
            <div className="register-container">
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
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                    {usertype === "student" && (
                        <div className="form-group">
                            <label htmlFor="studentid">Student ID</label>
                            <input
                                type="text"
                                id="studentid"
                                value={usertype === "student" ? studentid : ""}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="Enter your student ID"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit">Sign up</button>
                </form>
                {errorMessage &&
                    <div
                        className="error-message">{errorMessage}
                    </div>}
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
