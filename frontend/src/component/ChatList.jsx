 import React from 'react'
 import { useDispatch, useSelector } from "react-redux";
 import { useEffect } from "react";
 import { fetchChats, setSelectedchat } from "../store/chatslice";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteChatById } from '../store/chatslice';

export default function ChatList() {
   const  dispatch = useDispatch()
   const { chatdata,chatstatus } = useSelector((state) => state.chat)
  
    useEffect(() => {
        dispatch(fetchChats())
    },[])

    if (chatstatus === "loading") {
        return <div className="p-3 text-white">Loading chats...</div>
    } 
    if (!chatdata || chatdata.length === 0) {
        return <div className="p-3 text-white">No chats found</div>
    }   

   
  

   return (
   <div className="p-3 space-y-2">
  {chatdata?.map((chat) => (
    
    <div
      key={chat.id }
      className="flex items-center justify-between p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
      onClick={() => dispatch(setSelectedchat(chat.id))}
    >
      <div>
        <span className="text-white font-medium">
          {chat.type === "private" ? chat.otherusername : chat.name}
        </span>
        <span className="text-zinc-400 text-xs ml-2">
          {chat.type}
        </span>
      </div>

      <button onClick={() => dispatch(deleteChatById(chat.id))}
        aria-label="Delete"
        className="inline-flex items-center justify-center w-9 h-9 p-0 shrink-0 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 active:scale-95 transition-all"
      >
        <TrashIcon className="w-5 h-5"  />
      </button>
    </div>
  ))}
</div>
)
  
}