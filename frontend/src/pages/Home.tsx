import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MenueIcon from "@/assets/icons/NoticeNest-MenueButton.svg"
import { useState } from "react";


const Home = () => {


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ─────────────── SIDE DRAWER ─────────────── */}
      <div
        className={`
          fixed top-0 left-0 h-screen
          bg-amber-200
          transition-transform duration-300 ease-in-out
          w-[70vw] md:w-[70vw] lg:w-[40vw]
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          z-40
        `}
      >
        {/* Empty drawer for now */}
      </div>
      <div className="min-h-screen w-full flex flex-col">

        {/* ───────────────── TOP BAR (10vh) ───────────────── */}
        <div className="h-[10vh] w-full bg-red-300 flex items-center px-4 justify-between">

          {/* Menu Icon */}
          <img
            src={MenueIcon}
            alt="menu"
            className="h-8 w-8 cursor-pointer"
            onClick={() => setIsMenuOpen(prev => !prev)}
          />

          {/* Logo */}
          <div className="text-3xl w-[55vw] text-center font-slackey tracking-wide">
            NoticeNest
          </div>

        </div>

        {/* ───────────────── DATE BAR (5vh) ───────────────── */}
        <div className="h-[5vh] w-full bg-blue-300 flex items-center justify-between px-4 relative">

          {/* Left Section */}
          <div className="flex items-center gap-3">

            <div className="h-8 w-8 flex items-center justify-center">15</div>


            <span className="text-lg">January</span>

            <Button variant="ghost">2026</Button>
          </div>

          {/* Right Section */}
          <div className="relative">
            <Button
              className="rounded-full px-6"
              onClick={() => setIsFilterOpen(prev => !prev)}
            >
              Visible
            </Button>
          </div>
        </div>

        {/* ───────────────── MAIN CONTENT AREA ───────────────── */}
        <div className="flex-1 bg-green-300 relative">

          {/* FILTER POPUP */}
          {isFilterOpen && (
            <div className="absolute top-4 left-[10vw] w-[80vw] h-[30vh] bg-yellow-200 z-30 rounded-lg shadow-lg flex items-center justify-center">
              Filter Section (empty)
            </div>
          )}

          {/* Floating Action Button */}
          <Button className="h-12 w-12 rounded-full absolute bottom-6 right-6">
            +
          </Button>
        </div>


        {/* ───────────────── BOTTOM BAR (15vh) ───────────────── */}
        <div className="h-[15vh] w-full bg-purple-300 flex items-center px-4 gap-4">

          {/* Textbox Area */}
          <div className="flex-1 h-12 bg-white rounded-md"></div>

          {/* Add Button */}
          <Button className="h-12 w-12 rounded-full text-xl">
            +
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Home;
