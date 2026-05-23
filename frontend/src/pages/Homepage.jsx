import React from 'react'
import Sidebar from '../component/Sidebar'
import Rightsidebar from '../component/Rightsidebar'
import Chatcontainer from '../component/Chatcontainer'
const Homepage = () => {
  return (
    <div>
      <div>
        hello  welcome to the home page 
      </div>
     <div  className="flex h-screen">
      <Sidebar/>
      <Chatcontainer/>
      <Rightsidebar/>
    
      </div>
    </div>
  )
}

export default Homepage
