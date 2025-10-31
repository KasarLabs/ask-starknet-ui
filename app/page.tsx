import LandingPage from '@/components/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Starknet - Unlock your Starknet expertise',
  description: 'One Tool. Hundreds of Agents. Thousands of Actions.',
  keywords: [
    'Starknet',
    'AI blockchain assistant',
    'Cairo smart contracts',
    'blockchain AI',
    'Starknet development',
    'Web3 AI',
    'DeFi development',
    'Cairo programming',
    'blockchain development tools',
    'Starknet AI',
    'artificial intelligence blockchain',
    'smart contract AI',
    'Layer 2 blockchain',
    'ZK-rollup',
    'Ethereum scaling',
  ],
  openGraph: {
    title: 'Ask Starknet - AI-Powered Blockchain Assistant for Starknet Development',
    description: 'Ask Starknet is your AI companion for blockchain development on Starknet. Get expert assistance with Cairo smart contracts, DeFi protocols, NFTs, and Web3 development using advanced artificial intelligence.',
    url: 'https://ask.starknet.io',
    siteName: 'Ask Starknet',
    images: [
      {
        url: '/ask_full_logo_white_alpha.png',
        width: 1200,
        height: 630,
        alt: 'Ask Starknet - AI Blockchain Assistant',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask Starknet - AI-Powered Blockchain Assistant',
    description: 'Your AI companion for blockchain development on Starknet. Expert assistance with Cairo smart contracts, DeFi protocols, and Web3 development.',
    images: ['/ask_full_logo_white_alpha.png'],
  },
  icons: {
    icon: '/ask_logo_white_alpha.png',
  },
};

const Home = () => {
  return <LandingPage />;
};

export default Home;
