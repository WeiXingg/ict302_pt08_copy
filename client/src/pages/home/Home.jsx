import "./home.css"
import Header from "../../components/header/Header"
import Navbar from "../../components/navbar/Navbar"

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <h1 className="homeTitle">Homepage</h1>
      </div>
    </div>
  );
};

export default Home;
