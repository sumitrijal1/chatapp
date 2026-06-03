import React from 'react'
import Sidebar from '../component/Sidebar'
import Rightsidebar from '../component/Rightsidebar'
import Chatcontainer from '../component/Chatcontainer'

const Homepage = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
      
      {/* Left sidebar - let Sidebar control its own width */}
      <Sidebar />

      {/* Chat area - takes remaining space */}
      <div className="flex-1 h-full overflow-hidden">
        <Chatcontainer />
      </div>

      {/* Right sidebar - fixed width, always visible */}
      <div className="w-[250px] min-w-[250px] h-full max-md:hidden">
        <Rightsidebar />
      </div>

    </div>
  )
}

export default Homepage
