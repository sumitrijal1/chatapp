import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from "../../db.js";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({
                message:"please fill all the fields"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        )
        res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password}= req.body;
        if(!email || !password) {
            return res.status(400).json({
                message:"please fill all the fields"
            })
        }

        const [rows] = await db.execute('SELECT * FROM users WHERE email =?',[email])
        if(!rows.length){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }

        const user= rows[0];
        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
        const token = jwt.sign({
            id:user.id,name:user.name,email:user.email
        }, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.json({ token ,user:{
            id:user.id,
            name:user.name,
            email:user.email
        }});
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}