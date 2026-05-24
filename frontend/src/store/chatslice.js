import { createSlice } from "@reduxjs/toolkit";
import { API, apiauthen } from "../http";


const statususe = Object.freeze({
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed'
})  

const chatslice = createSlice({
    name:'chat',
    initialState:{
        users:[],
        chatdata:[],
        status: statususe.idle,
        selecteduser:null

  },
  reducers:{
    setUsers(state,action){
        state.users = action.payload
    },
    setChatdata(state,action){
        state.chatdata = action.payload
    },
    setStatus(state,action){
        state.status = action.payload
    },
    setSelecteduser(state,action){
        state.selectedchat = action.payload
    },
    deleteChat(state,action){ 
        state.chatdata = state.chatdata.filter(chat => chat.id !== action.payload.chatId)
    },
    addChat(state,action){
    const exists = state.chatdata.find(
        chat => chat.id === action.payload.id
    )

    if(!exists){
        state.chatdata.push(action.payload)
    }
}

  }
})

    export const {setUsers,setChatdata,setStatus,setSelectedchat,deleteChat,addChat} = chatslice.actions

    export default chatslice.reducer

    export function fetchChats(){
        return async function fetchChatsThunk(dispatch){
            dispatch(setStatus(statususe.loading))
            try{
                const response = await apiauthen.get("/fetchchats")
                dispatch(setChatdata(response.data.data))
                dispatch(setStatus(statususe.succeeded))
            }catch(error){
                dispatch(setStatus(statususe.failed))
            }
        }       
    }

    export function creategroupChat(data){
        return async function createChatThunk(dispatch){
            dispatch(setStatus(statususe.loading))
            try{
                const response = await apiauthen.post("/chat/createchat",data)
                dispatch(addChat(response.data.data))
                dispatch(setStatus(statususe.succeeded))
            }catch(error){
                dispatch(setStatus(statususe.failed))
            }
        }               
    }
    export function createPrivateChat(receiverId){
        return async function createPrivateChatThunk(dispatch){
            dispatch(setStatus(statususe.loading))  
            try{
                const response = await apiauthen.post(`/chat/createprivate/${receiverId}`)
                dispatch(addChat(response.data.data))
                dispatch(setStatus(statususe.succeeded))
            }       
            catch(error){
                dispatch(setStatus(statususe.failed))
            }   
        }
    }

   export function deleteChatById(chatId){
        return async function deleteChatByIdThunk(dispatch){
            dispatch(setStatus(statususe.loading))
            try{
                await apiauthen.patch(`/chat/deletechat/${chatId}`)
                dispatch(deleteChat({chatId}))
                dispatch(setStatus(statususe.succeeded))
            }catch(error){
                dispatch(setStatus(statususe.failed))
            }
        } 

    }

    export function fetchUsers(){
        return async function fetchUsersThunk(dispatch){
            dispatch(setStatus(statususe.loading))
            try{
                const response = await apiauthen.get("/chat/users")
               
                dispatch(setUsers(response.data.data))
                dispatch(setStatus(statususe.succeeded))
            }catch(error){
                dispatch(setStatus(statususe.failed))
            }
        }
    }   