import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsers } from "../store/chatslice";
import { setSelecteduser } from "../store/chatslice";


export default function UsersList() {
   const dispatch = useDispatch()
   const{ users,selecteduser,status}  = useSelector((state) => state.chat)
   
   useEffect(() => {
    dispatch(fetchUsers())
   }, [dispatch])
   if (status === "loading") {
        return <div className="p-3 text-white">Loading users...</div>
    }

    // ✅ show empty state
    if (!users || users.length === 0) {
        return <div className="p-3 text-white">No users found</div>
    }
 
  return (
    <div className="p-3 space-y-2" >
      {users?.map((user, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
         onClick={() => dispatch(setSelecteduser(user))}>
          {user.name}
        </div>
      ))}
    </div>
  );
}