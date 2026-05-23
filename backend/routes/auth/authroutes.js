const { register, login } = require('../../controller/auth/authcontroller');
const catchasync = require('../../services/catchasync');

const router = require('express').Router(); 

router.route("/register").post(catchasync(register))
router.route("/login").post(catchasync(login))

module.exports = router;