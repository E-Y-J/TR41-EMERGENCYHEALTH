import { useState } from 'react';
import ChatList from '../components/Chats/ChatList';
import ChatMessage from '../components/Chats/ChatMessage';

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatSession {
    id: number;
    title: string;
    lastMessage: string;
    timestamp: Date;
    messages: Message[];
}

const ChatHistory = () => {
    // Load from localStorage or API
    const [chatSessions] = useState<ChatSession[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const currentChat = chatSessions.find(chat => chat.id === selectedChatId);
    const messages = currentChat?.messages || [];

    const handleSelectChat = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-2xl font-bold text-center mb-10">Chat History</h1>
            <div className='grid grid-cols-5 gap-8'>

                <div className='col-span-2'>
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-6">
                        <ChatList
                            chats={chatSessions}
                            selectedChatId={selectedChatId}
                            onSelectChat={handleSelectChat}
                        />
                    </div>
                </div>

                <div className="col-span-3 space-y-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    {!selectedChatId ? (
                        <ChatMessage isPlaceholder />
                    ) : messages.length === 0 ? (
                        <ChatMessage isPlaceholder />
                    ) : (
                        messages.map((message) => <ChatMessage key={message.id} message={message} />)
                    )}
                </div>
            </div>
        </div >
    );
};

export default ChatHistory;