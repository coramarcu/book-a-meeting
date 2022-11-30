import logo from "../images/logo-cat.jpg";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../authContext";
import { profileContext } from "../profileContext";
import { getEvents } from "../firestore";
import Settings from "./Settings";

const Navbar = ({setEvents}) => {
  const { currentUser } = useContext(authContext);
  const { profile, setProfile } = useContext(profileContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
    (async() => {
      setEvents(await getEvents(currentUser.uid))
    })();
  };

  return (
    <nav>
      <div>
        <img src={logo} alt={"Logo"}></img>
      </div>
      <div>
          <img
            src={profile.avatar}
            alt={"user avatar"}
            onClick={handleAvatarClick}
          ></img>
      </div>
      <div>
        {isSettingsOpen ? (
          <Settings/>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
