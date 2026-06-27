import axios from 'axios';


const API = axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
          Accept:"application/json"
    }
})

const apiauthen = axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
         Accept:"application/json",
         'Authorization': `Bearer ${localStorage.getItem('token')}` 
    }
})
//interceptor reads token fresh on every request
apiauthen.interceptors.request.use((config)=>{
   // dynamic import — circular dependency avoid huncha
    const token = (() => {
        try {
            const { default: store } = require('../store/store')
            return store.getState().auth.token
        } catch {
            return null
        }
    })() || localStorage.getItem("token")
    
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export{API, apiauthen}