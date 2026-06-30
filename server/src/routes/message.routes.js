import { Router } from "express";
import {  getMessagesForProject, postMessage } from "../controllers/message.controllers.js";
import auth from "../middlewares/auth.middleware.js";
const router = Router()

router.get('/:projectId', auth ,getMessagesForProject);
router.post('/:projectId',auth,  postMessage);

export default router