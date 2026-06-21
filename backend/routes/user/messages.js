
import { deletemessageforme, deleteforeveryone } from '../../controller/user/deletemessage.js';
import { forwardMessage } from '../../controller/user/forwardmessages.js';
import { getmessage } from '../../controller/user/getmessage.js';
import { sendmessage } from '../../controller/user/sendmessage.js';
import authenticateToken from '../../middleware/auth.js';
import catchasync from '../../services/catchasync.js';
import express from 'express';


const router = express.Router();

router.route("/getallmessages/:chatid").get(authenticateToken,catchasync(getmessage))
router.route("/sendmessage/:chatid").post(authenticateToken,catchasync(sendmessage))
router.route("/deletemessageforme/:messageid").post(authenticateToken,catchasync(deletemessageforme))
router.route("/deleteforeveryone/:messageid").patch(authenticateToken,catchasync(deleteforeveryone))

router.route("/forwardmessage").post(authenticateToken,catchasync(forwardMessage))

export default router;