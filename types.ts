
export type MessageAuthor = 'user' | 'ai';

export interface Message {
  id: string;
  text: string;
  author: MessageAuthor;
}
