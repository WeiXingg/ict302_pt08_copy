import "./header.css"
import logo from "../header/image.png"

const Header = () => {
  return (
    <div className="header">
      <div className="headerContainer">
        <img src={logo} alt="AppointMate" className="logo" />
      </div>
    </div>
  )
};

export default Header