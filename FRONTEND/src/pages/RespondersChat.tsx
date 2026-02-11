import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/http";

interface Message {
  text: string;
  sender: "responder" | "AIAgent";
  timestamp: Date;
}

type patientInfo = {
  first_name?: string;
  last_name?: string;
  gender?: string;
  email?: string;
  blood_type?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
};

const RespondersChat = () => {
  const { token } = useParams<{ token: string }>();
  console.log("Token from URL:", token);
  const [patient, setPatient] = useState<patientInfo | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [endChat, setEndChat] = useState<boolean>(false);
  const [endChatMessage, setEndChatMessage] = useState<string>("");
  console.log("Patient Info:", patient);
  const [messages, setMessages] = useState<Message[]>([]);
  console.log("Chat Messages:", messages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // created a reference to an invisible <div> at the bottom of the chat messages to enable automatic scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // call the backend session to start a new chat session
  useEffect(() => {
    console.log("Starting chat session with token:", token);
    const chatSession = async () => {
      if (!token) {
        console.error("No token found in URL parameters.");
        return;
      }
      try {
        const response = await api.post(`/chatbot/session`, { token })
        console.log("Chat session started:", response.data);
        setPatient(response.data.patient_panel);
        setSessionId(response.data.session_id ?? null);

        // Add initial assistant message if backend provides one
        if (response.data.assistant_message) {
          setMessages([{
            text: response.data.assistant_message,
            sender: "AIAgent",
            timestamp: new Date(),
          }]);
        }
      } catch (error: unknown) {
        console.error("Error starting chat session:", error);
        setEndChatMessage("This QR Code has been revoked or invalid.");
        setEndChat(true);
      }
    };
    chatSession();
  }, [token])

  const endChatSession = async () => {
    if (!sessionId) {
      console.error("No session_id available. Cannot end session.");
      return;
    }
    const response = await api.post(`/chatbot/session/${sessionId}/end`)
    setEndChatMessage(response.data.message + ",\n Please refresh the page to start a new chat session.");
    setEndChat(true);
  }


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    if (!sessionId) {
      console.error("No session_id available. Cannot send message.");
      return;
    }

    const newMessage: Message = {
      text: inputMessage,
      sender: "responder",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Send message to backend API and get AI response
    const messageToSend = async () => {
      try {
        const response = await api.post(
          `/chatbot/message`,
          { session_id: sessionId, message: newMessage.text }
        );
        const assistantText = response.data?.assistant_message;
        if (assistantText) {
          const botResponse: Message = {
            text: assistantText,
            sender: "AIAgent",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botResponse]);
        }
      } catch (error: unknown) {
        console.error("Error sending message to AI agent:", error);
      } finally {
        setIsLoading(false);
      }
    }
    messageToSend();
  };



  return (
    <>

      {endChat ? (

        <div className="flex items-center justify-center h-screen">
          <p className="text-center text-red-600 font-semibold text-lg md:text-xl px-4">
            {endChatMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden gap-4">
          {/* Left Side - Patient Info */}
          <div className="w-full md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 overflow-y-auto max-h-[40vh] md:max-h-screen">
            <div className="space-y-3 md:space-y-4">
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-black mb-2 text-sm md:text-base">Patient Information</h3>
                <div className="space-y-1 text-xs md:text-sm">
                  <p><span className="font-medium">First Name:</span> {patient?.first_name}</p>
                  <p><span className="font-medium">Last Name:</span> {patient?.last_name}</p>
                  <p><span className="font-medium">Gender:</span> {patient?.gender}</p>
                  <p><span className="font-medium">Date of Birth:</span> {patient?.date_of_birth}</p>
                  <p><span className="font-medium">Emergency Contact:</span></p>
                  <ol className="ml-4">
                    <li> Name: {patient?.emergency_contact_name}</li>
                    <li>Phone Number: {patient?.emergency_contact_phone}</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat */}
          <div className="flex-1 flex flex-col bg-white min-h-[60vh] md:min-h-screen p-2">
            <div className="bg-[#2e7d32] text-white p-3 md:p-4 shadow-md">
              <h2 className="text-lg md:text-xl font-semibold">EmergiScan AI Assistant</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.timestamp.getTime()}
                  className={`flex ${message.sender === "responder" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 md:p-4 ${message.sender === "responder"
                      ? "bg-gray-100 text-black"
                      : "bg-[#bee6c0] text-black"
                      }`}
                  >
                    <p className="text-md md:text-lg">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[70%] rounded-lg p-3 md:p-4 bg-[#81c784] text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-2 md:p-4 bg-gray-50 shrink-0 rounded-2xl shadow-xl shadow-gray-400/50">
              <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={endChatSession}
                  className="order-2 sm:order-1 bg-red-600 hover:bg-red-800 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-colors text-sm md:text-base font-medium whitespace-nowrap"
                >
                  End Chat
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about the patient..."
                  className="order-1 sm:order-2 w-full sm:flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81c784]"
                />
                <button
                  type="submit"
                  className="order-3 sm:order-3 bg-[#2e7d32] hover:bg-gray-500 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg transition-colors text-sm md:text-base font-medium whitespace-nowrap"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </>
  );

};

export default RespondersChat;