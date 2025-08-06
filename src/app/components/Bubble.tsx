export default function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-black text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
