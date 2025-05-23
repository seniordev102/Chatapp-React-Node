export interface Message {
  id?: number;
  senderId: string;
  content: string;
  created_at?: Date | string;
}
