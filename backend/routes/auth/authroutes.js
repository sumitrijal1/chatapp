import { register, login } from '../../controller/auth/authcontroller.js';
import catchasync from '../../services/catchasync.js';
import express from 'express';

const router = express.Router(); 

router.route("/register").post(catchasync(register))
router.route("/login").post(catchasync(login))

export default router;