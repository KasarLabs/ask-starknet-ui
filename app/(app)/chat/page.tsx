import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat with AI - Ask Starknet Blockchain Assistant',
  description: 'Start chatting with Ask Starknet AI assistant for blockchain development. Get instant help with Cairo smart contracts, Starknet development, DeFi protocols, and Web3 questions powered by artificial intelligence.',
  keywords: [
    'Starknet chat',
    'AI blockchain chat',
    'Cairo smart contract help',
    'blockchain AI assistant',
    'Starknet developer chat',
    'AI coding assistant',
    'blockchain development chat',
  ],
  openGraph: {
    title: 'Chat with AI - Ask Starknet Blockchain Assistant',
    description: 'Start chatting with Ask Starknet AI assistant for blockchain development. Get instant help with Cairo smart contracts and Starknet development.',
    url: 'https://ask.starknet.io/chat',
  },
  icons: {
    icon: '/ask_logo_white_alpha.png',
  },
};

const ChatPage = () => {
  return (
    <div className="content-wrapper">
      <Suspense>
        <ChatWindow />
      </Suspense>
    </div>
  );
};

export default ChatPage;
