import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserDash from "./pages/UserDash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import { useEffect } from "react";
import { checkTokenExpiry } from "./utils/checkTokenExpiry";
import HomePage from "./pages/HomePage";
import PaymentSuccess from "./pages/PaymentSucces";

function App() {
  useEffect(() => {
  checkTokenExpiry();
}, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
             <HomePage/>
            }/>
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <UserDash />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRouteSA>
                <SuperadminDashboard />
              </ProtectedRouteSA>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
export function ProtectedRouteSA({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
