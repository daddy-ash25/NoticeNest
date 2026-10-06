import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import HomeMain from "@/pages/HomeMain";
import CreateNotice from "@/pages/CreateNotice";

import Auth from "@/pages/Auth";
import SignUpPage from "@/pages/SignUp";
import ProtectedApp from "@/pages/ProtectedApp";


const App: React.FC = () => {
    return (
        <Routes>
            {/* Authentication */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/sign-up" element={<SignUpPage />} />

            {/* Protected NoticeNest application */}
            <Route element={<ProtectedApp />}>
                <Route path="/" element={<Home />}>
                    {/* / */}
                    <Route index element={<HomeMain />} />

                    {/* /create */}
                    <Route path="create" element={<CreateNotice />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;