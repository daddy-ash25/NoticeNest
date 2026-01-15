import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">

      {/* ───────────────── TOP BAR (10vh) ───────────────── */}
      <div className="h-[10vh] w-full bg-red-300 flex items-center px-4 justify-between">
        
        {/* Menu Icon */}
        <img
          src="https://example.com/menu.svg"
          alt="menu"
          className="h-8 w-8"
        />

        {/* Logo */}
        <div className="text-2xl font-bold w-[55vw] text-center">
          NoticeNest
        </div>
      </div>

      {/* ───────────────── DATE BAR (5vh) ───────────────── */}
      <div className="h-[5vh] w-full bg-blue-300 flex items-center justify-between px-4 relative">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          
          {/* Date */}
          <Button className="h-8 w-8 bg-white text-black">
            15
          </Button>

          {/* Month */}
          <span className="text-lg">January</span>

          {/* Year Selector */}
          <Button variant="ghost">
            2026
          </Button>
        </div>

        {/* Right Section */}
        <div className="relative">
          <Button className="rounded-full px-6">
            Visible
          </Button>

          {/* Visibility Dropdown Placeholder */}
          <Card className="absolute top-12 left-1/2 -translate-x-1/2 w-[80vw] h-32 bg-yellow-200 z-20 flex items-center justify-center">
            Visibility Options (empty)
          </Card>
        </div>
      </div>

      {/* ───────────────── MAIN CONTENT AREA ───────────────── */}
      <div className="flex-1 bg-green-300 relative">

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
  );
};

export default Home;
