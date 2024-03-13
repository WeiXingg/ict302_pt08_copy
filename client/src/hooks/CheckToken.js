import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const useTokenExpiration = (user, dispatch) => {
    const navigate = useNavigate();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const expirationTime = decoded.exp * 1000;
                const timeout = expirationTime - Date.now();
                const logoutTimeout = setTimeout(() => {
                    setShowLogoutAlert(true);
                }, timeout);
                return () => clearTimeout(logoutTimeout);
            } catch (error) {
                console.log("Decode error.");
            }
        } else {
            console.log("You are not authenticated.");
            navigate("/");
        }
    }, [user, dispatch, navigate]);
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };
    return { showLogoutAlert, handleLogout };
};

export default useTokenExpiration;
