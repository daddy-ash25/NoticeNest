import { Router } from "express";

import {
    createClassController,
    getUserClassesController,
    getClassDetailsController,
    updateClassController,
    deleteClassController,
    getClassMembersController,
    addClassMemberController,
    removeClassMemberController,
    changeMemberRoleController,
} from "../controllers/class.controller";

const router = Router();

/*
    Class
*/

router.post(
    "/",
    createClassController
);

router.get(
    "/",
    getUserClassesController
);

router.get(
    "/:classId",
    getClassDetailsController
);

router.patch(
    "/:classId",
    updateClassController
);

router.delete(
    "/:classId",
    deleteClassController
);


/*
    Members
*/

router.get(
    "/:classId/members",
    getClassMembersController
);

router.post(
    "/:classId/members",
    addClassMemberController
);

router.delete(
    "/:classId/members/:noticeNestId",
    removeClassMemberController
);

router.patch(
    "/:classId/members/:noticeNestId/role",
    changeMemberRoleController
);

export default router;