import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ChatList from '../components/Chats/ChatList';
import ChatMessage from '../components/Chats/ChatMessage';
import { fetchChatSessions, fetchChatSessionDetail } from '../api/chatApi';

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatSession {
    id: number;
    title: string;
    timestamp: Date;
    messages: Message[];
}

const ChatHistory = () => {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

    const { data: chatSessionsData, isLoading: isLoadingSessions } = useQuery({
        queryKey: ['chatSessions'],
        queryFn: fetchChatSessions,
    });

    const { data: chatDetailData, isLoading: isLoadingDetail } = useQuery({
        queryKey: ['chatSession', selectedChatId],
        queryFn: () => fetchChatSessionDetail(selectedChatId!),
        enabled: selectedChatId !== null,
    });

    const chatSessions: ChatSession[] = chatSessionsData?.map(session => ({
        id: session.session_id,
        title: `Chat with ${session.responder_name || 'Unknown'}`,
        timestamp: new Date(session.created_at),
        messages: [],
    })) || [];

    const messages: Message[] = chatDetailData?.messages.map((msg, index) => ({
        id: index + 1,
        text: msg.content,
        sender: msg.role === "assistant" ? "bot" : "user",
        timestamp: new Date(msg.created_at + (msg.created_at.endsWith('Z') ? '' : 'Z')),
    })) || [];

    const handleSelectChat = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    if (isLoadingSessions) {
        return (
            <div className='max-w-7xl mx-auto'>
                <h1 className="text-2xl font-bold text-center mb-10">Chat History</h1>
                <div className="text-center">Loading chat sessions...</div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-2xl font-bold text-center mb-10">Chat History</h1>
            <div className='flex flex-col lg:flex-row gap-8'>

                <div className='lg:w-2/5'>
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-6">
                        <ChatList
                            chats={chatSessions}
                            selectedChatId={selectedChatId}
                            onSelectChat={handleSelectChat}
                        />
                    </div>
                </div>
                <div className='lg:w-3/5'>
                    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        {isLoadingDetail ? (
                            <div className="text-center">Loading messages...</div>
                        ) : !selectedChatId || messages.length === 0 ? (
                            <ChatMessage isPlaceholder />
                        ) : (
                            <ChatMessage messages={messages} />
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ChatHistory;