import { useState } from "react";
import UsersList from "./UserList";
import ChatList from "./Chatlist";




export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="w-[320px] h-screen bg-zinc-900 text-white flex flex-col border-r border-zinc-700">

      {/* TOP HEADER */}
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-2xl font-bold">
          ChatApp
        </h1>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 p-3 border-b border-zinc-700">

        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200
            ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200
            ${
              activeTab === "chats"
                ? "bg-blue-500 text-white"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          Chats
        </button>

      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto">

        {activeTab === "users" && <UsersList/>}

        {activeTab === "chats" && <ChatList/>}

      </div>

      

    </div>
  );
}
