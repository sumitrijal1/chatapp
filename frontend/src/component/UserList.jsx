export default function UsersList() {
  const users = [
    "Ram",
    "Hari",
    "Sita",
    "Gita",
  ];

  return (
    <div className="p-3 space-y-2">
      {users.map((user, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
        >
          {user}
        </div>
      ))}
    </div>
  );
}