import db from '../../db.js'
import { executeWithRetry } from '../../services/dbretry.js'

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

    try {
    // step 1 - create group
    const [chatresult] = await executeWithRetry(db,
        'INSERT INTO chat(type, name) VALUES(?, ?)',
        ['group', name]
    )
    const chatid = chatresult.insertId

    // step 2 - insert members one by one ✅
    const allMembers = [...new Set([...receiverId, userid])]

    for(const memberId of allMembers) {
        await executeWithRetry(db,
            'INSERT INTO chat_members(chat_id, user_id) VALUES(?, ?)',
            [chatid, Number(memberId)]    // ✅ ensure number not string
        )
    }

    const listofuser = []
    for(const memberId of allMembers) {
        const [rows] = await executeWithRetry(db,
            'SELECT id, name FROM users WHERE id=?',
            [Number(memberId)]
        )
        if (rows.length) listofuser.push(rows[0])
    }

    res.status(201).json({
        data: {
            id: chatid,
            type: "group",
            name: name,
            members: listofuser   // ✅ return the list of members in the response
        }
    })
    } catch (error) {
        console.error('Error in creategroupchat:', error.message);
        res.status(500).json({ message: error.message || "Failed to create group" });
    }
}

export const addmember = async (req, res) => {
    const userid = req.user.id
    const { receiverid, name } = req.body  // name = chatId here


    if (!receiverid || !Array.isArray(receiverid)) {
        return res.status(400).json({ message: "please provide a list of users" })
    }

    try {
        for (const memberId of receiverid) {
            await executeWithRetry(db,
                'INSERT INTO chat_members(chat_id, user_id) VALUES(?, ?)',
                [name, Number(memberId)]
            )
        }
        res.status(200).json({ message: "members added successfully" })  // ✅ moved outside loop
    } catch (error) {
        console.error('Error in addmember:', error.message);
        res.status(500).json({ message: "failed to add members", error: error.message })
    }
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