const { getallusers } = require('../../controller/global/globalcontroller');
const { creategroupchat } = require('../../controller/user/chatgroup');
const { privatechat } = require('../../controller/user/chatprivate');
const { deletechatforme, undodeletechatforme } = require('../../controller/user/deletechat');
const { getchart } = require('../../controller/user/fetchallchat');
const authenticateToken = require('../../middleware/auth');
const catchasync = require('../../services/catchasync');



const router = require('express').Router();
router.route("/users").get(authenticateToken,catchasync(getallusers))
router.route("/creategroup").post(authenticateToken,catchasync(creategroupchat))
router.route("/createprivate/:receiverid").post(authenticateToken,catchasync(privatechat))
router.route("/deletechat/:chatid").patch(authenticateToken,catchasync(deletechatforme))
router.route("/restorechat/:chatid").patch(authenticateToken,catchasync(undodeletechatforme))
router.route("/fetchchats").get(authenticateToken,catchasync(getchart))
module.exports = router;