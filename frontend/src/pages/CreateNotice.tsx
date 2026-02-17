import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNotice } from "@/services/noticeService";
import type { NoticeCategory, NoticeScope } from "@/types/notice";
import { Button } from "@/components/ui/button";

export default function CreateNotice() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("event");
  const [importance, setImportance] = useState(false);
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [scope, setScope] = useState<NoticeScope>("personal");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async () => {
    if (!title || !date) {
      alert("Title and Date are required");
      return;
    }

    await createNotice({
      title,
      category,
      date,
      importance,
      scope,
      description: description || undefined,
      time: time || undefined,
      source: "user",
      createdBy: "demo-user",
    });

    navigate("/");
  };

  return (
    <div className="h-full w-full p-6 bg-white overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Create Notice</h2>

      {/* Title */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Date */}
      <input
        type="date"
        className="border p-2 w-full mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Category */}
      <select
        className="border p-2 w-full mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value as NoticeCategory)}
      >
        <option value="event">Event</option>
        <option value="exam">Exam</option>
        <option value="class">Class</option>
        <option value="meeting">Meeting</option>
        <option value="festival">Festival</option>
        <option value="holiday">Holiday</option>
        <option value="announcement">Announcement</option>
        <option value="personal">Personal</option>
      </select>

      {/* Importance */}
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={importance}
          onChange={(e) => setImportance(e.target.checked)}
        />
        Important
      </label>

      {/* Class selector placeholder */}
      <div className="border p-3 mb-3 text-gray-500">
        Class Selector (placeholder)
      </div>

      {/* Advanced toggle */}
      <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? "Hide Advanced" : "Advanced"}
      </Button>

      {/* Advanced section */}
      {showAdvanced && (
        <div className="mt-4 space-y-3">
          <textarea
            className="border p-2 w-full"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <select
            className="border p-2 w-full"
            value={scope}
            onChange={(e) => setScope(e.target.value as NoticeScope)}
          >
            <option value="personal">Personal</option>
            <option value="class">Class</option>
            <option value="subclass">Subclass</option>
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button onClick={handleSubmit}>Create</Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
