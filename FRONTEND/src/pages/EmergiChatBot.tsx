import { useParams } from "react-router-dom";

const EmergiChatBot = () => {
  const { token } = useParams();

  return (
    <>
      <div className="text-center mt-10">
        <h1 className="text-center">Chatbot</h1>
        <p className="mt-4">patient token: {token}</p>
      </div>
    </>
  );
};

export default EmergiChatBot;