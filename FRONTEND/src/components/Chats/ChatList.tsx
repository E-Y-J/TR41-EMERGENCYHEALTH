interface ChatSession {
    id: number;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

interface ChatListProps {
    chats: ChatSession[];
    selectedChatId: number | null;
    onSelectChat: (chatId: number) => void;
}

const ChatList = ({ chats, selectedChatId, onSelectChat }: ChatListProps) => {
    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Chat List</h3>
            </div>

            <div className="border border-gray-300 bg-gray-100 p-6 rounded">
                {chats.length === 0 ? (
                    <div>
                        <p className="text-lg font-medium">No previous chats</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 ">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className={selectedChatId === chat.id ? 'p-3 bg-[#4caf50]/25 border rounded border-gray-300' : ''}
                            >
                                <p className="text-sm text-gray-500 mb-1">{chat.timestamp.toLocaleDateString()}</p>
                                <p className="text-lg font-medium">{chat.title}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ChatList;