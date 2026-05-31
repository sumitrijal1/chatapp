import {io} from "socket.io-client";

let socket = null;


export const initSocket = (userId)=>{
    socket =io("http://localhost:5000",{
        query:{userId}
    })
    return socket;
}
export const subscribeToMessages = ()=>{
    if(!socket) return; 

export const getSocket = ()=>socket;
export const disconnectSocket = ()=>{
    if(socket) socket.disconnect();
    socket = null;
}
}

// socketmanager.js is like a TEMPLATE
// copy it to every real time project
// change nothing

// only the EVENTS change per project
// joinChat, joinGame, joinRide etc
// but the manager stays the same ✅
// Project starts
//     ↓
// socketmanager sets up connection    → ONCE
//     ↓
// User does something specific
//     ↓
// Call that specific socket event     → ON DEMAND