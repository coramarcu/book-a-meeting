import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../contexts/authContext";

export default function ProtectedRoute ({children}) {
    const {currentUser} = useContext(authContext)

    if(!currentUser){
        return <Navigate to="/login" replace/>;
    }

    return children;
}