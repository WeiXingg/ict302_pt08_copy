import "./header.css"
import headerLogo from "../header/headerlogo.png"

const Header = () => {
  return (
    <div className="header">
      <div className="headerContainer">
        <img src={headerLogo} alt="AppointMate" className="headerLogo" />
      </div>
    </div>
  )
};

export default Header