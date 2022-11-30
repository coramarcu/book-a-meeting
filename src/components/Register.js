import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword } from "../firebase";
import { addProfileData } from "../firestore";
import ColourSelect from "./ColourSelect";

const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [nameIsValid, setNameIsValid] = useState(false);
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [showNameError, setShowNameError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [colour, setColour] = useState();

    const navigate = useNavigate();

    const handleChangeName = (event) => {
        setName(event.target.value);
        setNameIsValid(event.target.value.length > 0 && event.target.value.length <= 50)
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);

        const validEmailPattern = /\S+@\S+\.\S+/

        if(validEmailPattern.test(event.target.value)){
            setEmailIsValid(true);
        }else{
            setEmailIsValid(false);
        }
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value);

        if(event.target.value.length >= 6){
            setPasswordIsValid(true);
        }else{
            setPasswordIsValid(false);
        }
    }

    const handleFileInput = (event) => {
        if(event.target.files[0]){
            setAvatar(event.target.files[0]);
        } else {
            setAvatar(null);
        }
        
    }

    const attemptRegistration = async (event) => {
        event.preventDefault();

        setShowNameError(!nameIsValid);
        setShowPasswordError(!passwordIsValid);
        setShowEmailError(!emailIsValid);

        if(nameIsValid && emailIsValid && passwordIsValid){
            const uid = await registerWithEmailAndPassword(email, password);
        
            await addProfileData(uid, name, colour, avatar);
            navigate("/", { replace: true });
        } 
    }

    return (
        <div>
            <h1>Sign up below</h1>
            <form onSubmit={attemptRegistration}>
                <label>
                    Name:
                    <input type="text" name="name" onChange={handleChangeName} onBlur={() => {setShowNameError(!nameIsValid)}}/>
                    {showNameError ? <p>Name must be between 1 and 50 characters long</p> : <></>}
                </label>
                <label>
                    Email:
                    <input type="text" name="email" onChange={handleChangeEmail} onBlur={()=>{setShowEmailError(!emailIsValid)}}/>
                    {showEmailError ? <p>this doesn't look right (eg. somebody@somewhere.com)</p> : <></>}
                </label>
                <label>
                    Password:
                    <input type="password" name="password" onChange={handleChangePassword} onBlur={()=>{setShowPasswordError(!passwordIsValid)}}/>
                    {showPasswordError ? <p>password must be at least 6 characters long</p> : <></>}
                </label>
                <label>
                    Avatar:
                    <input type="file" onChange={handleFileInput}/>
                </label>
                <label>
                    Colour:
                    <ColourSelect colour={colour} setColour={setColour}
                />  
                </label>  
                        
                <button>Register</button>
            </form>
            <Link to="/login">Already have an account? Log in</Link>
        </div>
    )
}

export default Register;