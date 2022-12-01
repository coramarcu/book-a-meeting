import { useEffect, useState, useContext } from "react";
import { profileContext } from "../profileContext";
import { updateProfileData, uploadAvatar } from "../firestore";
import { logOut } from "../firebase";
import ColourSelect from "./ColourSelect";

const Settings = () => {
  const { profile, setProfile } = useContext(profileContext);
  const [name, setName] = useState(profile.name);
  const [nameIsValid, setNameIsValid] = useState(true);
  const [showNameError, setShowNameError] = useState(false);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [selectedColour, setSelectedColour] = useState(profile.colour);
  

  useEffect(() => {
    const updatedProfile = {...profile};
    updatedProfile.colour = selectedColour;
    updatedProfile.avatar = avatar;
    
    if(nameIsValid) {
      updatedProfile.name = name;
    }
    setShowNameError(!nameIsValid);

    setProfile(updatedProfile);
    
    updateProfileData(profile.uid, profile.name, updatedProfile.colour, updatedProfile.avatar);
  }, [selectedColour, avatar, name]);

  const handleChangeName = (event) => {
    setName(event.target.value);
    setNameIsValid(event.target.value.length > 0 && event.target.value.length <= 50)
}

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
        <input type="text" name="name" defaultValue={profile.name} onChange={handleChangeName} onBlur={() => {setShowNameError(!nameIsValid)}}/>
                    {showNameError ? <p>Name must be between 1 and 50 characters long</p> : <></>}
      </div>
      <div className="setting">
        <img src={profile.avatar} alt={"Logo"}/>
        <input type="file" onChange={handleFileInput}/>
      </div>
      <div className="setting">
        <h3>Profile Colour</h3>
        <ColourSelect colour={selectedColour} setColour={setSelectedColour}/>
      </div>
      <button onClick={() => logOut()}>Log out</button>
    </div>
  );
};

export default Settings;
