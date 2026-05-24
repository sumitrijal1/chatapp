import React from "react";
import { useDispatch, useSelector } from "react-redux";


export default function UsersList() {
   const dispatch = useDispatch()
   const{ users,selectedchat}  = useSelector((state) => state.chat)
  
          console.log(users)

   useEffect(() => {
    dispatch(fetchUsers())
   }, [dispatch])

  return (
    <div className="p-3 space-y-2" >
      {users.map((user, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
         onClick={() => dispatch(setSelectedchat(user))}>
          {user}
        </div>
      ))}
    </div>
  );
}