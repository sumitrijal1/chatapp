import { configureStore } from "@reduxjs/toolkit";
import authslice from "./authslice";
import chatslice from "./chatslice";
import messageslice from "./message";



const store = configureStore({
    reducer:{
        auth: authslice,
        chat: chatslice,
        message: messageslice
    }
})

export default store;