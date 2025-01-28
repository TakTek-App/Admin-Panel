//@ts-ignore
//@ts-nocheck
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PersistentDrawer from "./components/PersistentDrawer";
import Users from "./pages/Users";
import Services from "./pages/Services";
import { Box } from "@mui/material";
import EditUsers from "./pages/Edit/EditUsers";
import CreateUser from "./pages/Create/CreateUser";
import EditServices from "./pages/Edit/EditServices";
import { ToastContainer } from "react-toastify";
import CreateService from "./pages/Create/CreateService";
import Companies from "./pages/Companies";
import EditCompany from "./pages/Edit/EditCompany";
import EditTechnician from "./pages/Edit/EditTechnician";
import Login from "./pages/Login";
import React, { useContext, useEffect, useState } from "react";
import Categories from "./pages/Categories";

interface AuthContextProps {
  signedIn: boolean;
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthContext = React.createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthContext.Provider");
  }
  return context;
};

function App() {
  const getInitialSignedIn = () => {
    const savedState = localStorage.getItem("signedIn");
    return savedState === "true";
  };
  const drawerWidth = 240;
  const [signedIn, setSignedIn] = useState(getInitialSignedIn);
  console.log(signedIn);

  useEffect(() => {
    localStorage.setItem("signedIn", signedIn.toString());
  }, [signedIn]);

  return (
    <>
      <AuthContext.Provider value={{ signedIn, setSignedIn }}>
        {signedIn ? (
          <Box>
            <ToastContainer />
            <PersistentDrawer />
            <Box
              sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                margin: "auto",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/create" element={<CreateUser />} />
                <Route path="/users/:id" element={<EditUsers />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/create" element={<CreateService />} />
                <Route path="/services/:id" element={<EditServices />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/categories" element={<Categories />} />
                <Route
                  path="/companies/:companyId/technicians/:technicianId"
                  element={<EditTechnician />}
                />
                <Route path="/companies/:id" element={<EditCompany />} />
              </Routes>
            </Box>
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </AuthContext.Provider>
    </>
  );
}

export default App;
