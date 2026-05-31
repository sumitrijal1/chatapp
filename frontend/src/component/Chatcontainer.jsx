import React from 'react'
import { setSelectedchat } from '../store/chatslice'
import { useDispatch, useSelector } from 'react-redux'
import {assets} from '../assets/assets'
import { useEffect ,useState} from 'react'
import { getSocket } from '../socket'




const Chatcontainer = () => {
  const dispatch = useDispatch()
  const { selectedchat, chatdata } = useSelector((state) => state.chat)
  const { onlineusers } = useSelector((state) => state.auth)
  console.log("selectedchat in Chatcontainer:", selectedchat)

  const selectedChatData = chatdata.find(chat => chat.id === selectedchat)
  useEffect(() => {
        if (!selectedchat) return
        const socket = getSocket()
        if (!socket) return
        socket.emit("joinChat", selectedchat)
    }, [selectedchat])

  
   return setSelectedchat? (
    <div className='h-full overflow-y-scroll relative backdrop-blur-lg'>
                  {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
       <img src={ assets.hero} alt="" className='w-8 rounded-full' />
       <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedChatData?.otherusername || selectedChatData?.name}
       {onlineusers.includes(selectedChatData?.otheruserId || selectedChatData?.userId) &&<span className='w-2 h-2 rounded-full bg-green-500'></span> }
       </p>
       <img onClick={()=>
        
        (null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
       <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
      </div>
      {/* chatarea */}
      <div className='flex  flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
       {messages.map((msg,index)=>(
        <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
        {
          msg.image ?(
            <img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
          ):(
          <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId===authUser._id?'rounded-br-none' :'rounded-bl-none'}`}>{msg.text}</p>
          )
        }
        <div className='text-center text-xs'>
         <img src={msg.senderId === authUser._id ?authUser?.profilepic ||  assets.avatar_icon : selectedUser ?.profilepic ||assets.profile_martin} alt=""  className=' w-7 rounded-full'/>
         <p className='text-gray-500'>{ formatmessagetime(msg.createdAt)}</p>
        </div>

        </div>

       ))}
       <div ref={scrollend}></div>
      </div>
       {/* bottom area */}
       <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div  className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input}
          onKeyDown={(e)=>e.key==='Enter'? handlesendmessage(e):null} type="text" placeholder='send a message'  className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-shite placeholder-gray-400'/>
          <input onChange={handlesendimage} type="file" id='image' accept='image/png ,image/jpeg' hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt=""  className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>
        <img onClick={handlesendmessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
       </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt=""  className='max-w-16'/>
      <p>Chat anytime, anywhere</p>
    </div>
  )
}



export default Chatcontainer

