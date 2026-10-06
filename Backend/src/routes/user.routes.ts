import { Router } from "express";
import {
    getMe,
    findUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", getMe);

router.get("/search/:noticeNestId", findUser);

export default router;