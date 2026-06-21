import { createSlice } from "@reduxjs/toolkit";
import { apiauthen } from "../http";
import io from 'socket.io-client'

const statususe = Object.freeze({
    idle: 'idle',
    loading: 'loading',
    succeeded: 'succeeded',
    failed: 'failed'
})

const messageslice = createSlice({
    name:'message',
    initialState:{
      messages:[],
      messagestatus: statususe.idle,
      messagedeleteinfo:null
    },
    reducers:{
        setMessages(state,action){
            state.messages = action.payload
        },
        setMessageStatus(state,action){
            state.messagestatus = action.payload
        },
        setsendmessage(state,action){
            state.messages.push(action.payload)
        },
        deletemessage(state,action){
            state.messages = state.messages.filter(message => message.id !== action.payload)
        },
        markmessagedeleted(state,action){
            const msg = state.messages.find(message => message.id === Number(action.payload))
            if(msg)msg.deleted_at = new Date().toISOString() // Mark the message as deleted by setting the deleted_at timestamp
        }

    }
})

export const { setMessages, setMessageStatus, setsendmessage, deletemessage,markmessagedeleted} = messageslice.actions
export default messageslice.reducer
 
export function messagefetch(chatid){
    return async function messagefetchThunk(dispatch){
        dispatch(setMessageStatus(statususe.loading))
        try{
            const response =  await apiauthen.get(`/message/getallmessages/${chatid}`)
            dispatch(setMessages(response.data.data))
            dispatch(setMessageStatus(statususe.succeeded))
        }
        catch(error){
            console.error('Error fetching messages:', error)
            dispatch(setMessageStatus(statususe.failed))
        }
    }
}

export function sendmessage(message,chatid){
    return async function sendmessageThunk(dispatch){
        try{
            const response = await apiauthen.post(`/message/sendmessage/${chatid}`,message)
            dispatch(setMessageStatus(statususe.succeeded))
            
        }
        catch(error){
            console.error('Error sending message:', error)
            dispatch(setMessageStatus(statususe.failed))
        }
    }
}

export function deltemessageforme(messageid){
    return async function deltemessageformeThunk(dispatch){
        try{
            const response = await apiauthen.post(`/message/deletemessageforme/${messageid}`)
            dispatch(deletemessage(messageid))
            dispatch(setMessageStatus(statususe.succeeded))
        }
        catch(error){
            console.error('Error deleting message for me:', error)
            dispatch(setMessageStatus(statususe.failed))
        }   
    }
}
export function deleteforeveryone(messageid,chatid){
    return async function deleteforeveryoneThunk(dispatch){
        try{    
             await apiauthen.patch(`/message/deleteforeveryone/${messageid}`)
              
            dispatch(setMessageStatus(statususe.succeeded))
        }
        catch(error){   
            console.error('Error deleting message for everyone:', error)
            dispatch(setMessageStatus(statususe.failed))
        }
    }   
}
//here we are manually updating the messageid ourselves instead of relying in chagned db like we are
//ourselves making the deleted_at=something like not relying in changed db value 
//if we need to rely in changed db value then we need to refetch the updated message in backend 
//and send it in frontend and handle accordingly process for that are done in notepad 
//and these process are called  state synchronization or client server state sync but the prcess above is fast 



