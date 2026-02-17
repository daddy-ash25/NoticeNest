// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HomeMain from "@/pages/HomeMain";
import CreateNotice from "@/pages/CreateNotice";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Layout route: Home acts as shared layout (topbar + menu) */}
      <Route path="/" element={<Home />}>
        {/* index route = / */}
        <Route index element={<HomeMain />} />

        {/* create page = /create */}
        <Route path="create" element={<CreateNotice />} />
      </Route>
    </Routes>
  );
};

export default App;
