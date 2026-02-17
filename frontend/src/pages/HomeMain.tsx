// src/pages/HomeMain.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import NoticeTimeline from "@/components/NoticeTimeline";
import { useNavigate } from "react-router-dom";

const HomeMain: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
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
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            Visible
          </Button>
        </div>
      </div>

      {/* ───────────────── MAIN CONTENT AREA ───────────────── */}
      <div className="flex-1 bg-green-300 relative overflow-y-auto">
        {/* FILTER POPUP */}
        {isFilterOpen && (
          <div className="absolute top-4 left-4 right-4 max-w-3xl mx-auto h-[30vh] bg-yellow-200 z-30 rounded-lg shadow-lg flex items-center justify-center">
            Filter Section (empty)
          </div>
        )}

        {/* TIMELINE */}
        <NoticeTimeline />

        {/* Floating Action Button - navigate to /create */}
        <Button
          className="h-12 w-12 rounded-full absolute bottom-6 right-6"
          onClick={() => navigate("/create")}
        >
          +
        </Button>
      </div>

      {/* ───────────────── BOTTOM BAR (15vh) ───────────────── */}
      <div className="h-[15vh] w-full bg-purple-300 flex items-center px-4 gap-4">
        {/* Textbox Area */}
        <div className="flex-1 h-12 bg-white rounded-md"></div>

        {/* Add Button - navigate to /create */}
        <Button
          className="h-12 w-12 rounded-full text-xl"
          onClick={() => navigate("/create")}
        >
          +
        </Button>
      </div>
    </>
  );
};

export default HomeMain;
