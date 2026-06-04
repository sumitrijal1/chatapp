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
      messagestatus: statususe.idle
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
        }

    }
})

export const { setMessages, setMessageStatus, setsendmessage } = messageslice.actions
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
           
            
        }
        catch(error){
            console.error('Error sending message:', error)
            dispatch(setMessageStatus(statususe.failed))
        }
    }
}



