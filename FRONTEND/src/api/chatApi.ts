import { api } from "./http";

export interface ChatSessionSummary {
  session_id: number;
  responder_name: string;
  created_at: string;
  ended_at: string;
}

export interface ChatMessageResponse {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatSessionDetail {
  session: {
    session_id: number;
    responder_name: string;
    created_at: string;
    ended_at: string;
  };
  messages: ChatMessageResponse[];
}

export const fetchChatSessions = async (): Promise<ChatSessionSummary[]> => {
  const response = await api.get("/patients/me/chats");
  return response.data.chats;
};

export const fetchChatSessionDetail = async (
  sessionId: number,
): Promise<ChatSessionDetail> => {
  const response = await api.get(`/patients/me/chats/${sessionId}`);
  return response.data;
};
