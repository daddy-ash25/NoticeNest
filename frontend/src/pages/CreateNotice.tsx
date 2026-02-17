// src/pages/CreateNotice.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateNotice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-white flex items-center justify-center">
      <div className="w-[90%] max-w-xl h-[60%] bg-white border rounded shadow p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Page</h2>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-500">
          {/* Placeholder for form */}
          This is the Create Notice page (placeholder).
        </div>
      </div>
    </div>
  );
};

export default CreateNotice;
