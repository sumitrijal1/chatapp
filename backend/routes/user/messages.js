
const { deletemessageforme, deleteforeveryone, undodelteforeveryone } = require('../../controller/user/deletemessage');
const { forwardMessage } = require('../../controller/user/forwardmessages');
const { getmessage } = require('../../controller/user/getmessage');
const { sendmessage } = require('../../controller/user/sendmessage');
const authenticateToken = require('../../middleware/auth');
const catchasync = require('../../services/catchasync');


const router = require('express').Router();

router.route("/getallmessages/:chatid").get(authenticateToken,catchasync(getmessage))
router.route("/sendmessage/:chatid").post(authenticateToken,catchasync(sendmessage))
router.route("/deletemessageforme/:messageid").post(authenticateToken,catchasync(deletemessageforme)).patch(authenticateToken,catchasync(deleteforeveryone))
router.route("/recovermessage/:messageid").patch(authenticateToken,catchasync(undodelteforeveryone))
router.route("/forwardmessage").post(authenticateToken,catchasync(forwardMessage))

module.exports = router;