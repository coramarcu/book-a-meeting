import { useEffect, useState, useContext } from "react";
import { profileContext } from "../profileContext";
import { updateProfileData } from "../firestore";
import ColourSelect from "./ColourSelect";

const Settings = () => {
  const { profile, setProfile } = useContext(profileContext);
  const [selectedColour, setSelectedColour] = useState(profile.colour);
  

  useEffect(() => {
    const updatedProfile = {...profile};
    updatedProfile.colour = selectedColour;
    setProfile(updatedProfile);
    
    updateProfileData(profile.uid, profile.name, selectedColour, profile.avatar)
  }, [selectedColour])

  return (
    <div className="settings-container">
      <div className={`setting ${profile.colour}`}>
        <h2>{profile.name}</h2>
      </div>
      <div className="setting">
        <img src={profile.avatar} alt={"Logo"}></img>
      </div>
      <div className="setting">
        <h3>Profile Colour</h3>
        <ColourSelect colour={selectedColour} setColour={setSelectedColour}/>
      </div>
    </div>
  );
};

export default Settings;
