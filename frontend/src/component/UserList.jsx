import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsers, createPrivateChat, creategroupChat } from "../store/chatslice";
import { setSelecteduser } from "../store/chatslice";
import { addMembersToGroupChat } from "../store/chatslice";


export default function UsersList({mode ="default",chatId =null,chatType =null,otherUserId =null, onClose= null}) {
    const dispatch = useDispatch()
    const { users, userstatus } = useSelector((state) => state.chat)
    const [selectedusers, setSelected] = useState([])  // local selection state
    const [groupname, setGroupname] = useState("")      // group name input
    const [showgroupinput, setShowgroupinput] = useState(false)
     const { chatdata } = useSelector((state) => state.chat)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])


    

    const handleUserClick = (user) => {
        const alreadySelected = selectedusers.find(u => u.id === user.id)

        if (alreadySelected) {
            // ✅ deselect if already selected
            setSelected(selectedusers.filter(u => u.id !== user.id))
        } else {
            // ✅ add to selection
            setSelected([...selectedusers, user])
        }
    }

    const handleCreateChat = () => {
        if (selectedusers.length === 0) return

        if (mode === "addmember" && chatId) {
        if (chatType === "group") {
            // ✅ group chat → add members directly
            dispatch(addMembersToGroupChat(chatId, selectedusers.map(u => u.id)))
            setSelected([])
            if (onClose) onClose()
        } else {
            // ✅ private chat → need group name to convert to group
                        const newMembers = selectedusers.filter(u => u.id !== Number(otherUserId))
            if (newMembers.length === 0) {
                alert("Please select at least one new member to create a group")
                return  // ✅ stop here, don't create group
            }

            setShowgroupinput(true)
        }
        return
    }


        if (selectedusers.length === 1) {
            // ✅ single user → private chat
            dispatch(createPrivateChat(selectedusers[0].id))
            setSelected([])   // clear selection
        } else {
            // ✅ multiple users → show group name input
            setShowgroupinput(true)
        }
    }

const handleCreateGroup = () => {
    if (!groupname.trim()) return

    if (mode === "addmember" && chatType === "private") {
        dispatch(creategroupChat({
            name: groupname,
           receiverId: [...new Set([...selectedusers.map(u => u.id), Number(otherUserId)])]
        }))
    } else {
        dispatch(creategroupChat({
            name: groupname,
            receiverId: selectedusers.map(u => u.id)
        }))
    }

    setSelected([])
    setGroupname("")
    setShowgroupinput(false)
    if (onClose) onClose()
}

    if (userstatus === "loading") {
        return <div className="p-3 text-white">Loading users...</div>
    }

    if (!users || users.length === 0) {
        return <div className="p-3 text-white">No users found</div>
    }
   

    return (
        <div className="p-3 space-y-2">

            {/* ✅ show selected count and action button */}
            {selectedusers.length > 0 && (
                <div className="mb-2">
                    <p className="text-zinc-400 text-sm mb-1">
                        {selectedusers.length} user{selectedusers.length > 1 ? 's' : ''} selected
                    </p>

                    {/* ✅ group name input — only shows for 2+ users */}
                    {showgroupinput && (mode !== "addmember" || chatType === "private")  && (
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Enter group name"
                                value={groupname}
                                onChange={(e) => setGroupname(e.target.value)}
                                className="flex-1 p-2 rounded-lg bg-zinc-700 text-white text-sm outline-none"
                            />
                            <button
                                onClick={handleCreateGroup}
                                className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg"
                            >
                                Create
                            </button>
                        </div>
                    )} 

                    <button
                        onClick={handleCreateChat}
                        className="w-full p-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg"
                    >
                            {mode === "addmember" ? "Add members" : selectedusers.length === 1 ? "Start Private Chat" : "Create Group Chat"}
                        
                    </button>
                </div>
            )}

            {/* ✅ users list */}
            {users.map((user) => {
                const isSelected = selectedusers.find(u => u.id === user.id)
                return (
                    <div
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center
                            ${isSelected 
                                ? 'bg-indigo-600 hover:bg-indigo-500'   // ✅ selected = blue
                                : 'bg-zinc-800 hover:bg-zinc-700'       // unselected = dark
                            }`}
                    >
                        <span className="text-white">{user.name}</span>
                        {isSelected && (
                            <span className="text-white text-sm">✓</span>   // ✅ checkmark
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// // normal array — allows duplicates
// const arr = [1, 2, 2, 3, 3, 3]
// console.log(arr)  // [1, 2, 2, 3, 3, 3]

// // Set — removes duplicates automatically
// const set = new Set([1, 2, 2, 3, 3, 3])
// console.log(set)  // {1, 2, 3}

// const unique = [...new Set([1, 2, 2, 3, 3, 3])]
// console.log(unique)  // [1, 2, 3]  ✅ array again