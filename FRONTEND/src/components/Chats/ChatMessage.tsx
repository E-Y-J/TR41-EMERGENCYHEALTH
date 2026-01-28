interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    length?: number
}

interface ChatMessageProps {
    messages?: Message[];
    isPlaceholder?: boolean;
}

const ChatMessage = ({ messages, isPlaceholder }: ChatMessageProps) => {
    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Chat Message</h3>
            </div>

            <div className="border border-gray-300 bg-gray-100 p-6 rounded">
                {isPlaceholder || !messages || messages.length === 0 ? (
                    <p className='text-lg font-medium'>Select a chat from the list to view contents</p>
                ) : (
                    messages.map((message: Message) => (
                        <div key={message.id}
                            className={`p-3 rounded ${message.sender === 'user' ? 'bg-[#4caf50]/25 border border-gray-300 ml-auto w-fit max-w-xs' : 'bg-white border border-gray-300 w-fit'}`}>
                            <p className="text-lg mb-1">{message.text}</p>
                            <p className="text-sm text-gray-500 mb-1">
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default ChatMessage;