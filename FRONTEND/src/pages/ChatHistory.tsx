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
    // Load from localStorage for testing for now 
    const [chatSessions] = useState<ChatSession[]>(() => {
        //only for testing
        const saved = localStorage.getItem('chatHistory');
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return parsed.map((chat: any) => ({
            ...chat,
            timestamp: new Date(chat.timestamp),
            messages: chat.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }))
        }))
    });
    //only for testing

    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const currentChat = chatSessions.find(chat => chat.id === selectedChatId);
    const messages = currentChat?.messages || [];

    const handleSelectChat = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-2xl font-bold text-center mb-10">Chat History</h1>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>

                <div className='lg:col-span-2'>
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 lg:sticky lg:top-6">
                        <ChatList
                            chats={chatSessions}
                            selectedChatId={selectedChatId}
                            onSelectChat={handleSelectChat}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    {!selectedChatId || messages.length === 0 ? (
                        <ChatMessage isPlaceholder />
                    ) : (
                        <ChatMessage messages={messages} />)
                    }
                </div>
            </div>
        </div >
    );
};

export default ChatHistory;