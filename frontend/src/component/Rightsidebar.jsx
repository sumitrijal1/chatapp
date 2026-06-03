import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authslice'
import assets from '../assets/assets'

const Rightsidebar = () => {
  const dispatch = useDispatch()
  const { selectedchat, chatdata } = useSelector((state) => state.chat)
  const { onlineusers } = useSelector((state) => state.auth)
  const selectedChatData = chatdata.find(chat => chat.id === selectedchat)

  return (
    // ✅ always render the container so layout doesn't shift
    <div className='bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-scroll max-md:hidden'>
      
      {selectedChatData ? (
        <>
          <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
            <img
              src={selectedChatData?.otheruseravatar || selectedChatData?.avatar || assets.avatar_icon}
              alt=""
              className='w-20 aspect-square rounded-full'
            />
            <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
              {onlineusers.includes(selectedChatData?.otheruserId || selectedChatData?.userId) && (
                <span className='w-2 h-2 rounded-full bg-green-500'></span>
              )}
              {selectedChatData?.otherusername || selectedChatData?.name}
            </h1>
          </div>

          <hr className='border-[#ffffff50] my-4' />

          <div className='px-5 text-xs'>
            <p>Media</p>
          </div>
        </>
      ) : (
        // ✅ show placeholder when no chat selected
        <div className='flex items-center justify-center h-1/2 text-gray-500 text-sm'>
          <p>Select a chat</p>
        </div>
      )}

      {/* Logout always visible */}
      <button
        onClick={() => dispatch(logout())}
        className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-10 rounded-full cursor-pointer whitespace-nowrap'
      >
        Logout
      </button>
    </div>
  )
}

export default Rightsidebar


