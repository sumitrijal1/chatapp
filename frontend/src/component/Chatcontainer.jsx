import React from 'react'
import { setSelectedchat } from '../store/chatslice'
import { useDispatch, useSelector } from 'react-redux'
import assets from '../assets/assets'
import { useEffect, useState } from 'react'
import { getSocket } from '../http/socketmanager'
import { setsendmessage } from '../store/message'
import { messagefetch } from '../store/message'
import { formatmessagetime } from '../http/utils'
import { useRef } from 'react'
import { toast } from "react-hot-toast"
import { sendmessage } from '../store/message'

const Chatcontainer = () => {
  const dispatch = useDispatch()
  const { selectedchat, chatdata } = useSelector((state) => state.chat)
  const { onlineusers } = useSelector((state) => state.auth)
  const { messages } = useSelector((state) => state.message)
  const { data } = useSelector((state) => state.auth)
  const [input, setInput] = useState("")
  const scrollend = useRef()
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null)

  const selectedChatData = chatdata.find(chat => chat.id === selectedchat)

  useEffect(() => {
    if (!selectedchat) return
    const socket = getSocket()
    if (!socket) return
    socket.emit("joinChat", selectedchat)
  }, [selectedchat])

  useEffect(() => {
    if (scrollend.current && messages) {
      scrollend.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (selectedchat) {
      dispatch(messagefetch(selectedchat));
    }
  }, [selectedchat, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNewMessage = (message) => {
      dispatch(setsendmessage(message));
    }
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [dispatch])

  const handlesendimage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file")
      return
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file)
  }

  const handlesendmessage = () => {
    if (!input.trim() && !selectedImage) return;

    dispatch(
      sendmessage(
        {
          text: input,
          image: selectedImage,
        },
        selectedchat
      )
    );

    setInput("");
    setSelectedImage(null);
    setPreviewImage(null);
  };

  console.log(selectedChatData)
  console.log(onlineusers)
  {console.log("online:", onlineusers, "checking id:", selectedChatData?.otheruserid || selectedChatData?.userId)}
//   DB returns       → "1,2,4"          (string)
// .split(",")      → ["1","2","4"]    (array)
// .some()          → loops each one   (boolean)
// .includes()      → checks against onlineusers

  return selectedChatData ? (
    <div className='h-full overflow-y-scroll relative backdrop-blur-lg bg-gray-900'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
  <img src={selectedChatData?.otheruseravatar || selectedChatData?.avatar} alt="" className='w-8 rounded-full' />
  <p className='flex-1 text-lg text-white flex items-center gap-2'>
    {selectedChatData?.type === "private" ? selectedChatData?.otherusername : selectedChatData?.name}
    {selectedChatData?.type === "private" ? (
      onlineusers.includes(selectedChatData?.otheruserid?.toString() || selectedChatData?.userId) ? (
        <span className='w-2 h-2 rounded-full bg-green-500 ml-2'></span>
      ) : null
    ) : null}
    {/* Group chat - check if ANY member is online */}
{selectedChatData?.type === "group" ? (
  selectedChatData?.groupmembers?.split(",").some(memberId =>
    onlineusers.includes(memberId.toString())
  ) ? (
    <span className='w-2 h-2 rounded-full bg-green-500 ml-2'></span>
  ) : null
) : null}
  </p>
  <img onClick={() => dispatch(setSelectedchat(null))} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
  <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
</div>

      {/* chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages?.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.sender_id !== data.id && 'flex-row-reverse'}`}>
            {msg.image_url ? (
              <img src={msg.image_url} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                ${msg.sender_id === data.id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.content}
              </p>
            )}
            <div className='text-center text-xs'>
              <img src={msg.sender_id === data.id ? data?.profilepic || assets.avatar_icon : selectedChatData?.otheruseravatar || assets.profile_martin} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500'>{formatmessagetime(msg.sent_at)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollend}></div>
      </div>

      {/* bottom area */}
      <div className='absolute bottom-0 left-0 right-0 bg-gray-900'>

        {/* ✅ Image preview shown ABOVE the input box */}
        {previewImage && (
          <div className='px-4 pt-2'>
            <div className='relative inline-block'>
              <img
                src={previewImage}
                alt="preview"
                className='w-16 h-16 rounded-lg object-cover border border-gray-600'
              />
              {/* ❌ Remove selected image */}
              <button
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedImage(null);
                }}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer'
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* input row */}
        <div className='flex items-center gap-3 p-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === 'Enter' ? handlesendmessage(e) : null}
              type="text"
              placeholder='send a message'
              className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            />
            <input onChange={handlesendimage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img onClick={handlesendmessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>

      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p>Chat anytime, anywhere</p>
    </div>
  )
}

export default Chatcontainer


