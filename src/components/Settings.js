import { useEffect, useState, useContext } from "react";
import { profileContext } from "../profileContext";
import { updateProfileData, uploadAvatar } from "../firestore";
import ColourSelect from "./ColourSelect";

const Settings = () => {
  const { profile, setProfile } = useContext(profileContext);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [selectedColour, setSelectedColour] = useState(profile.colour);
  

  useEffect(() => {
    const updatedProfile = {...profile};
    updatedProfile.colour = selectedColour;
    updatedProfile.avatar = avatar
    setProfile(updatedProfile);
    
    const response = updateProfileData(profile.uid, profile.name, updatedProfile.colour, updatedProfile.avatar);
  }, [selectedColour, avatar])

  const handleFileInput = async (event) => {
    const avatarFile = event.target.files[0];
    if(avatarFile){
        const downloadURL = await uploadAvatar(profile.uid, avatarFile)
        setAvatar(downloadURL);
    }    
}

  return (
    <div className="settings-container">
      <div className={`setting ${profile.colour}`}>
        <h2>{profile.name}</h2>
      </div>
      <div className="setting">
        <img src={profile.avatar} alt={"Logo"}/>
        <input type="file" onChange={handleFileInput}/>
      </div>
      <div className="setting">
        <h3>Profile Colour</h3>
        <ColourSelect colour={selectedColour} setColour={setSelectedColour}/>
      </div>
    </div>
  );
};

export default Settings;
