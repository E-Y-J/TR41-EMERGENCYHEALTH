interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
    isPlaceholder?: boolean;
}

const ChatMessage = ({ message, isPlaceholder }: ChatMessageProps) => {
    return (
        <div className="mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Chat Message</h3>
            </div>
            <div className="border border-gray-300 bg-gray-100 p-6 rounded">
                {isPlaceholder || !message ? (
                    <p className='text-lg font-medium'>Select a chat from the list to view contents</p>

                ) : (
                    <div>
                        <p>{message.text}</p>
                        <p>
                            {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;