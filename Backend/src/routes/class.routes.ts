import { Router } from "express";

import {
    createClassController,
    getUserClassesController,
    addClassMemberController,
    getClassMembersController,
} from "../controllers/class.controller";

const router = Router();

router.post("/", createClassController);

router.post(
    "/:classId/members",
    addClassMemberController
);

router.get("/", getUserClassesController);

router.get(
    "/:classId/members",
    getClassMembersController
);

export default router;