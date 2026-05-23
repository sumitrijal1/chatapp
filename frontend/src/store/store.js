import { configureStore } from "@reduxjs/toolkit";
import authslice from "./authslice";
import chatslice from "./chatslice";



const store = configureStore({
    reducer:{
        auth: authslice,
        chat: chatslice
    }
})

export default store;