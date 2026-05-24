 import React from 'react'
 import { useDispatch, useSelector } from "react-redux";
 import { useEffect } from "react";
 import { fetchChats } from "../store/chatslice";


export default function ChatList() {
   const  dispatch = useDispatch()
   const { chatdata,chatstatus } = useSelector((state) => state.chat)

    useEffect(() => {
        dispatch(fetchChats())
    },[dispatch])

    if (chatstatus === "loading") {
        return <div className="p-3 text-white">Loading chats...</div>
    } 
    if (!chatdata || chatdata.length === 0) {
        return <div className="p-3 text-white">No chats found</div>
    }   
    

  

  return (
    <div className="p-3 space-y-2">
      {chatdata?.map((chat, index) => (
        <div
          key={chat.id}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
        >
          {chat.name}
        </div>
      ))}
    </div>
  );
}