import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../contexts/authContext";

export default function ProtectedLogin ({children}) {
    const {currentUser} = useContext(authContext)

    if(currentUser){
        return <Navigate to="/" replace/>;
    }

    return children;
}