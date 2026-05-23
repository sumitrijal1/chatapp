 const db= require('../../db')

exports.getallusers = async(req,res)=>{
    const userid= req.user.id
    const [users] = await db.execute('SELECT id,name,email FROM users WHERE id != ?',[userid])
     
    if(users.length >0){
        res.status(200).json({
            message:'users retrieved successfully',
            data:users
        })
    }
}

