import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import "../styles/styles.js";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import ProtectedLogin from "./ProtectedLogin";
import PasswordReset from "./PasswordReset";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedLogin>
                  <Login />
                </ProtectedLogin>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedLogin>
                  <Register />
                </ProtectedLogin>
              }
            />

            <Route
              path="/reset-password"
              element={
                <ProtectedLogin>
                  <PasswordReset />
                </ProtectedLogin>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
