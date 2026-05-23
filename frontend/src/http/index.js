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

export{API, apiauthen}