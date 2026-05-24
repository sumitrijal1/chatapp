import db from '../../db.js'

export const getchart = async(req,res)=>{
    const userid = req.user.id
    const [chats] = await db.execute(`select c.id ,c.type,c.name ,u.id As otheruserid ,u.name As otherusername
         from chart c
        

         join chart_members cm on c.id = cm.chatid
          
       

          left join chat_members cm2 on c.id = cm2.chatid  and  cm2.userid !=? 
          
          left join user on cm2.userid = u.id

        where cm.userid =?
        AND cm.deleted_at IS NULL
        `,[userid,userid])
    
    res.status(200).json({
        message:"chats retrieved successfully",
        data:chats
    })
}
//First JOIN creates all chat-member rows, second LEFT JOIN fetches other members excluding the logged-in user, third JOIN fetches their details, and finally WHERE filters everything to only the logged-in user’s chats.

//  first join  we are joining all the loggesin user with the chart table to get all the charts of the logged in user 
//second left join is used to get the other user of the chart if there is any and we are using left join because there can be group chat in that case there will be no other user and we don't want to lose those charts
 // second left join is used to get all the charts of the logged in user and also get the other user of the chart if there is any
//third join is used to get the details of the other user