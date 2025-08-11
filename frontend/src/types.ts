export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  answer: string;
}
