import type { User, Chat, ChatMessage } from "./types";
export interface DigitalBook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isOwned?: boolean;
}
export const MOCK_BOOKS: DigitalBook[] = [
  {
    id: "book-1",
    title: "The Sovereign Individual",
    author: "James Dale Davidson",
    description: "Mastering the Transition to the Information Age.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    category: "Philosophy"
  },
  {
    id: "book-2",
    title: "Mastering Bitcoin",
    author: "Andreas M. Antonopoulos",
    description: "Programming the Open Blockchain.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
    category: "Technology"
  },
  {
    id: "book-3",
    title: "The Bitcoin Standard",
    author: "Saifedean Ammous",
    description: "The Decentralized Alternative to Central Banking.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=300&fit=crop",
    category: "Economics"
  },
  {
    id: "book-4",
    title: "Zero to One",
    author: "Peter Thiel",
    description: "Notes on Startups, or How to Build the Future.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop",
    category: "Business"
  },
  {
    id: "book-5",
    title: "Debt: The First 5,000 Years",
    author: "David Graeber",
    description: "A history of debt and its role in human society.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=300&fit=crop",
    category: "History"
  },
  {
    id: "book-6",
    title: "The Ethics of Liberty",
    author: "Murray N. Rothbard",
    description: "A comprehensive theory of liberty based on natural law.",
    price: 1,
    imageUrl: "https://images.unsplash.com/photo-1532012197367-63098482c21d?w=300&h=300&fit=crop",
    category: "Politics"
  }
];
export const MOCK_OWNED_BOOKS: string[] = ["book-2", "book-4"];
/**
 * Missing constants required by worker/entities.ts
 */
export const MOCK_USERS: User[] = [
  { id: "user-1", name: "Alice" },
  { id: "user-2", name: "Bob" }
];
export const MOCK_CHATS: Chat[] = [
  { id: "chat-1", title: "General Discussion" }
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { 
    id: "msg-1", 
    chatId: "chat-1", 
    userId: "user-1", 
    text: "Welcome to the bookstore!", 
    ts: Date.now() 
  }
];