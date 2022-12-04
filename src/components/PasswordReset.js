import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/firebase";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const navigate = useNavigate();

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);

        const validEmailPattern = /\S+@\S+\.\S+/;
        setEmailIsValid(validEmailPattern.test(event.target.value));
    }

    const attemptReset = async (event) => {
        event.preventDefault();

        setShowEmailError(!emailIsValid);

        if(emailIsValid){
            await resetPassword(email);
            navigate("/login", {replace: true});
        }
    }

    return <div>
        <h1>Reset Password</h1>
        <form>
            <label>
                Email:
                <input type="text" name="email" onChange={handleChangeEmail} onBlur={()=>{setShowEmailError(!emailIsValid)}}/>
                {showEmailError? <p>this doesn't look right (eg. somebody@somewhere.com)</p> : <></>}
            </label>
            <button onClick={attemptReset}>Send password reset link</button>
        </form>
        
        <button onClick={() => navigate("/login", { replace: true })}>Back to login screen</button>
    </div>
}

export default PasswordReset;