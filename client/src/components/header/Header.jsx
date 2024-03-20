import "./header.css"
import headerLogo from "../header/headerlogo.png"
import muLogo from "../header/mulogo.png"

const Header = () => {
  return (
    <div className="header">
      <div className="headerContainer">
        <img src={headerLogo} alt="AppointMate" className="headerLogo" />
        <img src={muLogo} alt="Murdoch University" className="muLogo" />
      </div>
    </div>
  )
};

export default Header