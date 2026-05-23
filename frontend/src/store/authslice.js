import { createSlice } from "@reduxjs/toolkit";
import { API, apiauthen } from "../http";
import {io} from 'socket.io-client'

const statususe = Object.freeze({
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed'
})  // Define the initial state of the authentication slice

const authslice = createSlice({
    name:'auth',
    initialState:{
        data:[],
        status: statususe.idle,
        token:'',
        email:'',
        socket:null,
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
        setSocket(state,action){
            state.socket= action.payload
        },
        setOnlineusers(state,action){
            state.onlineusers = action.payload
        }

    }
})
 export const {setUser,setStatus,setToken,logout,setEmail,setSocket,setOnlineusers} = authslice.actions

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
            dispatch(setStatus(statususe.succeeded))
            dispatch(connectSocket())
        } catch(error){
            dispatch(setStatus(statususe.failed))
        }
}
}

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
        const {auth} = getState();

        //already connected 
        if(auth.socket?.connected) return ;
        //no logges in user
        if(!auth.data?.id) return 

        const newsocket =io("http://localhost:5000",{
            query:{
                userId:auth.data.id
            }
        });
        newsocket.connect()
        dispatch(setSocket(newsocket));
        newsocket.on("getOnlineUsers",(users)=>{
            dispatch(setOnlineusers(users))
        })
    }
}