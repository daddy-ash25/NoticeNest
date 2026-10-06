// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MenueIcon from "@/assets/icons/NoticeNest-MenueButton.svg";
import { UserButton } from "@clerk/react";
import { useClassApi } from "@/services/classApi";

const Home: React.FC = () => {
  const isDesktop = window.innerWidth >= 1024;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { addClassMember } = useClassApi();

  const testAddMember = async () => {
    try {
      const result = await addClassMember(
        "6ac538810dd73ef3f391a7bb",
        "NNF9FCTYDU"
      );

      console.log("MEMBER ADDED:", result);
    } catch (error) {
      console.error("ADD MEMBER FAILED:", error);
    }
  };

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsMenuOpen(true);
    }
  }, []);


  return (
    <div className="h-screen flex overflow-hidden">
      {/* ─────────────── SIDE DRAWER ─────────────── */}
      <div
        className={`
          bg-amber-200 h-screen
          transition-all duration-300 ease-in-out
          fixed lg:static top-0 left-0 z-40
          ${isDesktop && isMenuOpen ? "lg:w-[30vw]" : ""}
          ${!isDesktop && isMenuOpen ? "w-[70vw]" : ""}
          ${!isMenuOpen ? "w-0" : ""}
          overflow-hidden
        `}
      >
        <button
          onClick={testAddMember}
          className="fixed bottom-5 right-5 z-50 bg-black text-white px-4 py-2 rounded"
        >
          Test Add Member
        </button>
        {/* Empty drawer for now */}
      </div>

      <div
        className={`
          flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${isDesktop && isMenuOpen ? "lg:w-[70vw]" : "w-full"}
          ${!isDesktop && isMenuOpen ? "translate-x-[70vw]" : "translate-x-0"}
        `}
      >
        {/* ───────────────── TOP BAR (10vh) ───────────────── */}
        <div className="h-[10vh] w-full bg-red-300 flex items-center px-4 relative">

          {/* Menu Icon */}
          <img
            src={MenueIcon}
            alt="menu"
            className="h-8 w-8 cursor-pointer"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 text-3xl font-slackey tracking-wide">
            NoticeNest
          </div>

          {/* User Account */}
          <div className="ml-auto">
            <UserButton />
          </div>

        </div>

        {/* CHILD ROUTE CONTENT */}
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
