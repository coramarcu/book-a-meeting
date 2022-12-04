import logo from "../images/PK-logo.jpeg";
import { ReactComponent as Arrow } from "../images/arrow.svg";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/authContext";
import { profileContext } from "../contexts/profileContext";
import { getEvents } from "../services/firestore";
import Settings from "./Settings";

const Navbar = ({ setEvents }) => {
  const { currentUser } = useContext(authContext);
  const { profile, setProfile } = useContext(profileContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArrowActive, setIsArrowActive] = useState(false);

  const handleAvatarClick = () => {
    setIsArrowActive(!isArrowActive);
    setIsSettingsOpen(!isSettingsOpen);
    (async () => {
      setEvents(await getEvents(currentUser.uid));
    })();
  };

  return (
    <div className="nav-and-settings-wrap">
      <nav className="navbar">
        <div className="logo-wrap">
          <img src={logo} alt={"Logo"}></img>
        </div>
        <div className="profile-box" onClick={handleAvatarClick}>
          <div className="profile-picture-wrap">
            <img src={profile.avatar} alt={"user avatar"}></img>
          </div>
          <p className="user-name">{profile.name}</p>
          <Arrow className={isArrowActive ? "arrow-up" : "arrow"} />
        </div>
      </nav>
      {isSettingsOpen ? <Settings /> : <></>}
    </div>
  );
};

export default Navbar;
