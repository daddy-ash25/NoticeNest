import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import MenueIcon from "@/assets/icons/NoticeNest-MenueButton.svg"
import { useState } from "react";
import { useEffect } from "react";


const Home = () => {


  const isDesktop = window.innerWidth >= 1024;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsMenuOpen(true);
    }
  }, []);


  return (
    <div className="relative min-h-screen flex overflow-hidden">
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
        {/* Empty drawer */}
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
