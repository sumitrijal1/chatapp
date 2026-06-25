let io;

export const setIo = (ioInstance) => {
    io = ioInstance;
}

export const getIo = () => io;

// ❌ Never import from server.js in controllers
// ❌ Never import from a file that imports you back

// ✅ Always create separate service files (like socket.js)
//    for things that need to be shared across files

//    1. Starts loading server.js
// 2. Sees import of messageRouter
// 3. Starts loading messageRouter
// 4. Sees import of sendmessage.js
// 5. Starts loading sendmessage.js
// 6. Sees import of server.js
// 7. But server.js isn't fully loaded yet!
// 8. So io comes back as undefined
// 9. Route silently breaks
// What is Circular Import?
// It's when two files import each other, creating a loop:
// server.js  →  imports  →  messageRouter.js
//                                ↓
//                           sendmessage.js
//                                ↓
//                           imports server.js  ←── 🔄 LOOP!
// So socket.js acts as a middleman that both server.js and sendmessage.js can import without looping!