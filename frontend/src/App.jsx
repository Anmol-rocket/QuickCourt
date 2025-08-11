import React from "react";
import { Routes, Route } from "react-router-dom";
import DummyLanding from "./pages/DummyLanding";
import UserLogin from "./pages/auth/userAuth/UserLogin";
import UserRegister from "./pages/auth/userAuth/UserRegister";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DummyLanding />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
    </Routes>
  );
};

export default App;
