import { getallusers } from '../../controller/global/globalcontroller.js';
import { creategroupchat } from '../../controller/user/chatgroup.js';
import { privatechat } from '../../controller/user/chatprivate.js';
import { deletechatforme, undodeletechatforme } from '../../controller/user/deletechat.js';
import { getchart } from '../../controller/user/fetchallchat.js';
import authenticateToken from '../../middleware/auth.js';
import catchasync from '../../services/catchasync.js';
import express from 'express';



const router = express.Router();
router.route("/users").get(authenticateToken,catchasync(getallusers))
router.route("/creategroup").post(authenticateToken,catchasync(creategroupchat))
router.route("/createprivate/:receiverid").post(authenticateToken,catchasync(privatechat))
router.route("/deletechat/:chatid").patch(authenticateToken,catchasync(deletechatforme))
router.route("/restorechat/:chatid").patch(authenticateToken,catchasync(undodeletechatforme))
router.route("/fetchchats").get(authenticateToken,catchasync(getchart))
export default router;