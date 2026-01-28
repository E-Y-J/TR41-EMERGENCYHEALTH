import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hook/useAuth";


interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const EmergiChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the EmergiScan AI assistant. How can I help you with this patient's medical information?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // created a reference to an invisible <div> at the bottom of the chat messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "I understand your question. Let me help you with that information.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      {/* Left Side - Patient Info */}
      <div className="w-full md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 overflow-y-auto max-h-[40vh] md:max-h-screen">
        <div className="space-y-3 md:space-y-4">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Patient Information</h3>
            <div className="space-y-1 text-xs md:text-sm">
              <p><span className="font-medium">First Name:</span> {user?.first_name}</p>
              <p><span className="font-medium">Last Name:</span> {user?.last_name}</p>
              <p><span className="font-medium">Gender:</span> Male</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Emergency Contact:</span></p>
              <ol className="ml-4">
                <li> Name: John Doe</li>
                <li>Phone Number: 415-555-1234</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="flex-1 flex flex-col bg-white min-h-[60vh] md:min-h-screen">
        <div className="bg-[#81c784] text-white p-3 md:p-4 shadow-md">
          <h2 className="text-lg md:text-xl font-semibold">EmergiScan AI Assistant</h2>
          <p className="text-xs md:text-sm opacity-90">Ask questions about the patient's medical information</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 md:p-4 ${message.sender === "user"
                  ? "bg-[#81c784] text-white"
                  : "bg-gray-100 text-gray-800"
                  }`}
              >
                <p className="text-sm md:text-base">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about the patient..."
              className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c784]"
            />
            <button
              type="submit"
              className="bg-[#81c784] hover:bg-[#2e7d32] text-white px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmergiChatBot;