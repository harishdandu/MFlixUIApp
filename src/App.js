import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./Routing/userRoutes";

function App() {
  return (
    <Router>
      {/* <Loader /> */}
      <AppRoutes />
      {/* <ToastContainer /> Required for displaying toasts */}
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserRoutes />} />
      <Route path="/User/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;
