export default function ChatList() {
  const chats = [
    "Ram Chat",
    "Office Group",
    "Friends Group",
  ];

  return (
    <div className="p-3 space-y-2">
      {chats.map((chat, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
        >
          {chat}
        </div>
      ))}
    </div>
  );
}