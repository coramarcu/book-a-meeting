import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { auth } from "../services/firebase";

const authContext = createContext();

function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState();
  const [pending, setPending] = useState(true);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    })
  }, [])

  return pending ? <p>Loading...</p> : <authContext.Provider value={{currentUser}}>{children}</authContext.Provider>
}

export {AuthProvider, authContext};