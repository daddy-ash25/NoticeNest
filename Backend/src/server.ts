import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware, getAuth } from "@clerk/express";
import connectDB from "./config/db";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import classRoutes from "./routes/class.routes";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(clerkMiddleware());

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "NoticeNest backend is running"
    });
});

app.get("/api/auth/me", (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    res.json({
        message: "Authenticated",
        userId
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`NoticeNest backend running on http://localhost:${PORT}`);
});