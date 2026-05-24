import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import db from "../db.js";    
import dotenv from 'dotenv';
dotenv.config();

const authenticateToken = async(req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    //here split is used to remove the "Bearer " part from the token
    //since the authorization header is usually in the format "Bearer <token>"   
    //so here split will convert the bearer and token into an array and we are taking the second element which is the token itself
    //and we can keep authorization in bracket also and not also it will work fine
    //but if there was some special character,hipen or something in the header then it would have been better to use  in bracket

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const [doesuserexist] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
        if(!doesuserexist.length){
            return res.status(401).json({ message: "Invalid token. User does not exist." });
        }
        req.user = doesuserexist[0]; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }

};
export default authenticateToken;