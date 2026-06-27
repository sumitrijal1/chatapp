import { createSlice } from "@reduxjs/toolkit";
import { API, apiauthen } from "../http";
import {io} from 'socket.io-client'
import { getSocket,initSocket, disconnectSocket} from "../http/socketmanager";
import { fetchChats, fetchUsers } from "./chatslice";

const statususe = Object.freeze({
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed'
})  // Define the initial state of the authentication slice

const authslice = createSlice({
    name:'auth',
    initialState:{
        data:null,
        status: statususe.idle,
        token:null,
        email:'',
        
        onlineusers:[]
    },
    reducers:{
        setUser(state,action){
            state.data = action.payload
        },
        setStatus(state,action){
            state.status = action.payload
        },
        setToken(state,action){
            state.token = action.payload        
        },
        logout(state,action){
            state.data =[]
            state.token = null  
            state.status = statususe.succeeded
        },
        setEmail(state,action){
            state.email = action.payload
        },
        
        setOnlineusers(state,action){
            state.onlineusers = action.payload
        },
        resetStatus(state) {         // ✅ add this
            state.status = statususe.idle
        }

    }
})
 export const {setUser,setStatus,setToken,logout,setEmail,setOnlineusers,resetStatus} = authslice.actions

 export default authslice.reducer


 export function registeruser(data){
    return async function regusterUserThunk(dispatch){
        dispatch(setStatus(statususe.loading))
        try{
            const response = await API.post("/register",data)
            dispatch(setStatus(statususe.succeeded))
        }catch(error){
            dispatch(setStatus(statususe.failed))
        }
 }
}

export function loginuser(data){
    return async function loginUserThunk(dispatch){
        dispatch(setStatus(statususe.loading))
        try{
            const response = await API.post("/login",data)
            dispatch(setUser(response.data.user))
            dispatch(setToken(response.data.token))
            localStorage.setItem("token", response.data.token)
            dispatch(connectSocket())
            
            console.log("token set:", response.data.token) // ← add
            
            const chatResult = await dispatch(fetchChats())
            console.log("fetchChats result:", chatResult)  // ← add
            
            const userResult = await dispatch(fetchUsers())
            console.log("fetchUsers result:", userResult)  // ← add
          
            dispatch(setStatus(statususe.succeeded))
            
        } catch(error){
            console.log("loginuser error:", error) // ← add
            dispatch(setStatus(statususe.failed))
        }
    }
}
//The rule is — always set succeeded status last, after everything else is ready. Since useEffect watches status, it fires the moment status changes — so anything after setStatus(succeeded) may be too late.

export function fetchprofile(){
    return async function fetchProfileThunk(dispatch){ 
        dispatch(setStatus(statususe.loading))
        try{
            const response = await apiauthen.get("/profile")
            dispatch(setUser(response.data))
            dispatch(setStatus(statususe.succeeded))
        }catch(error){
            dispatch(setStatus(statususe.failed))
        }
    } 
}

export function forgotpassword(email){
    return async function forgotpasswordThunk(dispatch){
        dispatch(setStatus(statususe.loading))
        try{
            const response = await apiauthen.post("/forgotpassword",{email})
            dispatch(setEmail(response.data.data))
            dispatch(setStatus(statususe.succeeded))
        }catch(error){
            dispatch(setStatus(statususe.failed))
        }
    }
}

export function verifyotp(data){
    return async function verifyotpThunk(dispatch){
        dispatch(setStatus(statususe.loading))
        try{
            const response = await apiauthen.post("/verifyotp",data)
            dispatch(setEmail(data.email))
            dispatch(setStatus(statususe.succeeded))
        }catch(error){
            dispatch(setStatus(statususe.failed))
        }
    }
}
//coonect socket function to handle socket connection and online users update 
export function connectSocket(){
    return function connectSocketThunk(dispatch,getState){
       try{
         const {auth} = getState();

        //already connected 
        if(getSocket()?.connected) return ;
        //no logges in user
        if(!auth.data?.id) return 

        const socket= initSocket(auth.data.id)
        
        socket.on("getOnlineUsers",(users)=>{
            dispatch(setOnlineusers(users))
        })
       }
         catch(error){  
            console.error("Socket connection error:", error)
         }
    }
}