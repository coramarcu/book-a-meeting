import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from "../services/firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const navigate = useNavigate();

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);

        const validEmailPattern = /\S+@\S+\.\S+/;
        setEmailIsValid(validEmailPattern.test(event.target.value));
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
        setPasswordIsValid(event.target.value.length >= 6);
    }

    const attemptLogin = async (event) => {
        event.preventDefault();

        setShowPasswordError(!passwordIsValid);
        setShowEmailError(!emailIsValid);
        
        if(emailIsValid && passwordIsValid){
            await logInWithEmailAndPassword(email, password);
            navigate("/", { replace: true });
        }
    }

    return (
        <div>
            <h1>Log in</h1>
            <button onClick={() => navigate("/register", { replace: true })}>New around here? Create an account</button>
            <form>
                <label>
                    Email:
                    <input type="text" name="email" onChange={handleChangeEmail} onBlur={()=>{setShowEmailError(!emailIsValid)}}/>
                    {showEmailError? <p>this doesn't look right (eg. somebody@somewhere.com)</p> : <></>}
                </label>
                <label>
                    Password:
                    <input type="password" name="password" onChange={handleChangePassword} onBlur={()=>{setShowPasswordError(!passwordIsValid)}}/>
                    {showPasswordError? <p>password must be at least 6 characters long</p> : <></>}
                </label>
                <button onClick={attemptLogin} >Log in</button>
            </form>
            <button onClick={() => navigate("/reset-password", { replace: true })}>Forgotten your password?</button>
        </div>
    )
}

export default Login;