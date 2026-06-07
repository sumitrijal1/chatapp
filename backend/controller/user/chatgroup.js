import db from '../../db.js'

export const creategroupchat = async(req, res) => {
    console.log("CHATGROUP FILE LOADED v2")  // ← very first line
    const userid = req.user.id
    const { name, receiverId } = req.body

    if(!name) {
        return res.status(400).json({ message: "please provide a name for the group chat" })
    }

    if(!receiverId || !Array.isArray(receiverId)) {
        return res.status(400).json({ message: "please provide a list of users for the group chat" })
    }

    // step 1 - create group
    const [chatresult] = await db.execute(
        'INSERT INTO chat(type, name) VALUES(?, ?)',
        ['group', name]
    )
    const chatid = chatresult.insertId

    // step 2 - insert members one by one ✅
    const allMembers = [...receiverId, userid]

    for(const memberId of allMembers) {
        await db.execute(
            'INSERT INTO chat_members(chat_id, user_id) VALUES(?, ?)',
            [chatid, Number(memberId)]    // ✅ ensure number not string
        )
    }

    res.status(201).json({
        data: {
            id: chatid,
            type: "group",
            name: name,
            members: allMembers   // ✅ return the list of members in the response
        }
    })
}





 //if we donot want to make the group wit existing user than we can do but basically in real world same user with differeent group can exist so we are not checking for that
    //but the code is written like this if we want to check for that
//     const members = [senderId, ...otherUserIds];

// // ⚠️ important: remove duplicates + sort
// const uniqueMembers = [...new Set(members)].sort((a, b) => a - b);

// // create placeholders (?, ?, ?, ...)
// const placeholders = uniqueMembers.map(() => '?').join(',');

// const [existingChat] = await db.execute(
//   `
//   SELECT cm.chat_id
//   FROM chat_members cm
//   JOIN chat c ON c.id = cm.chat_id
//   WHERE c.type = 'group'
//   GROUP BY cm.chat_id
//   HAVING 
//     COUNT(DISTINCT cm.user_id) = ?
//     AND (
//       SELECT COUNT(*) 
//       FROM chat_members cm2 
//       WHERE cm2.chat_id = cm.chat_id
//     ) = ?
//   `,
//   [...uniqueMembers, uniqueMembers.length, uniqueMembers.length]
// );
//we can write c.id or cm.chatid both will work because we are joining the chat table with chat_members table and both tables have id column but to avoid confusion we can write c.id