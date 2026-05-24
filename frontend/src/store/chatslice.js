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
        userstatus: statususe.idle,
        chatstatus: statususe.idle,
        selecteduser:[],
        selectedchat:null

  },
  reducers:{
    setUsers(state,action){
        state.users = action.payload
    },
    setChatdata(state,action){
        state.chatdata = action.payload
    },
    setuserStatus(state,action){
        state.userstatus = action.payload
    },
    setchatStatus(state,action){
        state.chatstatus = action.payload
    },

    setSelecteduser(state,action){
        state.selecteduser = action.payload
    },
    setSelectedchat(state,action){
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

    export const {setUsers,setChatdata,setuserStatus,setchatStatus,setSelecteduser,setSelectedchat,deleteChat,addChat} = chatslice.actions

    export default chatslice.reducer

    export function fetchChats(){
        return async function fetchChatsThunk(dispatch){
            dispatch(setchatStatus(statususe.loading))
            try{
                const response = await apiauthen.get("/chat/fetchchats")
                dispatch(setChatdata(response.data.data))
                dispatch(setchatStatus(statususe.succeeded))
            }catch(error){
                dispatch(setchatStatus(statususe.failed))
            }
        }       
    }

    export function creategroupChat(data){
        return async function createChatThunk(dispatch){
            dispatch(setchatStatus(statususe.loading))
            try{
                const response = await apiauthen.post("/chat/createchat",data)
                dispatch(addChat(response.data.data))
                dispatch(setchatStatus(statususe.succeeded))
            }catch(error){
                dispatch(setchatStatus(statususe.failed))
            }
        }               
    }
    export function createPrivateChat(receiverId){
        return async function createPrivateChatThunk(dispatch){
            dispatch(setchatStatus(statususe.loading))  
            try{
                const response = await apiauthen.post(`/chat/createprivate/${receiverId}`)
                dispatch(addChat(response.data.data))
                dispatch(setchatStatus(statususe.succeeded))
            }       
            catch(error){
                dispatch(setchatStatus(statususe.failed))
            }   
        }
    }

   export function deleteChatById(chatId){
        return async function deleteChatByIdThunk(dispatch){
            dispatch(setchatStatus(statususe.loading))
            try{
                await apiauthen.patch(`/chat/deletechat/${chatId}`)
                dispatch(deleteChat({chatId}))
                dispatch(setchatStatus(statususe.succeeded))
            }catch(error){
                dispatch(setchatStatus(statususe.failed))
            }
        } 

    }

    export function fetchUsers(){
        return async function fetchUsersThunk(dispatch){
            dispatch(setuserStatus(statususe.loading))
            try{
                const response = await apiauthen.get("/chat/users")
               
                dispatch(setUsers(response.data.data))
                dispatch(setuserStatus(statususe.succeeded))
            }catch(error){
                dispatch(setuserStatus(statususe.failed))
            }
        }
    }   