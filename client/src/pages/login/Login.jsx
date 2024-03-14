import "./login.css"
import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const { loading, dispatch } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setErrorMessage("");
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        // Check if either username or password is empty
        if (!credentials.username && !credentials.password) {
            setErrorMessage("Username and password are empty");
            return;
        } else if (!credentials.username) {
            setErrorMessage("Username is empty");
            return;
        } else if (!credentials.password) {
            setErrorMessage("Password is empty");
            return;
        }

        try {
            dispatch({ type: "LOGIN_START" });
            const res = await axios.post("/auth/login", credentials);
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            navigate("/dashboard")
        } catch (err) {
            if (err.response && (err.response.status === 400 || err.response.status === 404)) {
                setErrorMessage("Wrong username or password!");
            } else {
                console.error("Failed to login.");
            }
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
    };

    return (
        <div>
            <Navbar isLoginPage={true} />
            <Header />
            <div className="login">
                <div className="lContainer">
                    <h2 className="loginTitle">Sign in to AppointMate</h2>
                    <form onSubmit={handleClick}>
                        <input
                            type="text"
                            placeholder="Username"
                            id="username"
                            onChange={handleChange}
                            className="lInput"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            id="password"
                            onChange={handleChange}
                            className="lInput"
                        />
                        <button disabled={loading} className="lButton">
                            Login
                        </button>
                    </form>
                    {errorMessage &&
                        <span
                            className="error-message">{errorMessage}
                        </span>}
                </div>
            </div>
        </div>
    );
};

export default Login;