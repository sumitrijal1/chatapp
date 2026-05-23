import React from 'react'

const Profilepage = () => {
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className=' w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex  items-center justify-between max-sm:flex-col-reverse rounded-lg'>
      <form  onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
        <h3 className='text-lg'>Profile details</h3>
        <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          
           {/* here e.target.file[0] is done cuz it gicen array of file and we only select the first one */}
           {/* and we are converting the selectedimage into url cuz this one donot understand the directly file it needs the path so we are converting into url cuz we also donot jnow the path of file and directly we cannot store the file  */}

        <input onChange={(e)=>setSelectedimage(e.target.files[0])} type="file" id='avatar' accept='.png , .jpg ,.jpeg' hidden />
        <img src={selectedimage ?URL.createObjectURL(selectedimage):assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedimage &&'rounded-full'}`} />
        upload profile image
        </label>
        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
        <textarea onChange={(e)=>setBio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>

        <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 roded-full text-lg cursor-pointer'>Save</button>
      </form>
      <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedimage &&'rounded-full'}`} src={authUser?.profilepic || assets.logo_icon} alt="" />
      </div>
      
    </div>
  )
}

export default Profilepage
