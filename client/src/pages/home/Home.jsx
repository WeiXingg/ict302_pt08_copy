import "./home.css"
import { Link } from 'react-router-dom'
import Header from "../../components/header/Header"
import Navbar from "../../components/navbar/Navbar"
import { AuthContext } from "../../context/AuthContext"
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <h1 className="homeTitle">Welcome to AppointMate!</h1>
        <p className="homeDescription">
          If you're new here, <Link to="/register">Sign up</Link> for an account to get started.
          <br /><br /><br />
          Already have an account? Welcome back! Simply <Link to="/login">Login</Link> to continue.
        </p>
      </div>
    </div>
  );
};

export default Home;
