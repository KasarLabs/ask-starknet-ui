'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, Copy, Check, User, ChevronRight, Loader2 } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { useTheme } from 'next-themes';
import {
  MCP_CLIENTS,
  generateMCPDeepLink,
  copyToClipboard,
  type MCPStdioConfig,
} from '@/lib/mcpDeepLink';

type TabType = 'auto' | 'json';
type DocsTabType = 'what' | 'getting-started' | 'plugins' | 'environments' | 'examples';
type DocsSubTabType = 'overview' | 'guide' | 'advanced';

const StarknetAgentAnimation = () => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [logoIndex, setLogoIndex] = useState(0);
  const [selectedLogoIndex, setSelectedLogoIndex] = useState(-1);
  const [toolIndex, setToolIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isLogoRolling, setIsLogoRolling] = useState(false);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [checkmarkGray, setCheckmarkGray] = useState(false);

  const fullText = 'ask starknet anything';
  const categories = ['DeFi', 'Gaming', 'Infra', 'Privacy', 'Dev', 'Socials'];
  const tools = [
    'get_markets',
    'get_market_stats',
    'get_balance',
    'get_positions',
    'create_limit_order',
    'update_leverage'
  ];
  const logos = [
    { name: 'Ekubo', url: 'https://pbs.twimg.com/profile_images/1676963409303322624/NuCcNNxa_400x400.png' },
    { name: 'AVNU', url: 'https://pbs.twimg.com/profile_images/1736767433635975168/G1H8l7Ci_400x400.jpg' },
    { name: 'Vesu', url: 'https://pbs.twimg.com/profile_images/1899459698551562240/_WK4Lfeb_400x400.jpg' },
    { name: 'Extended', url: 'https://pbs.twimg.com/profile_images/1876581196173320192/pF4KQQCb_400x400.jpg' },
    { name: 'Paradex', url: 'https://pbs.twimg.com/profile_images/1940437227642798080/EnotVJl3_400x400.jpg' },
  ];

  const getStepDescription = () => {
    if (step === 0) return "1. Ask Starknet Anything";
    if (step === 1 || step === 2) return "2. A system agent determines which ecosystem category to forward the request to";
    if (step === 3 || step === 4 || step === 5) return "3. This category is monitored by an agent responsible for selecting the right protocol";
    if (step === 6 || step === 7) return "4. Each protocol contains a specialized agent and a set of tools to perfectly execute the request";
    if (step === 8) return "5. The request is then executed by selecting the right tool, achieving a 96% win rate!";
    return "";
  };

  useEffect(() => {
    // Step 1: Typing animation
    if (step === 0) {
      if (typedText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => setStep(1), 500);
      }
    }

    // Step 2: Arrow to first agent
    if (step === 1) {
      setTimeout(() => setStep(2), 1000);
    }

    // Step 3: Category cycling
    if (step === 2) {
      if (categoryIndex < categories.length - 1) {
        const timeout = setTimeout(() => {
          setCategoryIndex(categoryIndex + 1);
        }, 400);
        return () => clearTimeout(timeout);
      } else {
        setTimeout(() => setStep(3), 500);
      }
    }

    // Step 4: Select DeFi
    if (step === 3) {
      setTimeout(() => setStep(4), 1000);
    }

    // Step 5: Arrow to second agent and start carousel directly
    if (step === 4) {
      setTimeout(() => setStep(5), 1000);
    }

    // Step 6: Logo carousel roulette - start immediately
    if (step === 5) {
      console.log('Starting carousel animation');
      setIsLogoRolling(true);
      // Reduce startOffset so final position stays visible
      const startOffset = logos.length; // Start at position 5 instead of 10
      let counter = 0;
      
      const interval = setInterval(() => {
        counter++;
        const currentLogoIndex = counter % logos.length;
        setSelectedLogoIndex(currentLogoIndex);
        setCarouselOffset(startOffset + counter);
      }, 120);

      // Extended is at index 3
      // Currently AVNU (index 1) is centered, we need Extended (index 3) = +2 positions
      const extendedPositionInArray = 13; // Scroll to position 13 during animation
      const finalVisiblePosition = 10; // 8 + 2 = 10, so final position = 5 + 10 = 15
      // Wait: if current 13 shows AVNU (1), but 13 % 5 = 3...
      // Let me use the position that would actually be Extended at center
      // AVNU is apparently at index 11 (11 % 5 = 1), so Extended at center would be 13 (13 % 5 = 3)
      const totalIterations = extendedPositionInArray; // Stop counter at 13
      
      const stopTimeout = setTimeout(() => {
        console.log('Stopping carousel, moving to step 6');
        clearInterval(interval);
        setIsLogoRolling(false);
        // Set final position on Extended AT A VISIBLE POSITION
        // If AVNU (index 1) is currently centered, we need to add 2 to get Extended (index 3)
        setSelectedLogoIndex(3);
        const finalOffset = startOffset + finalVisiblePosition;
        setCarouselOffset(finalOffset); // Position 5 + 10 = 15
        console.log('Final carouselOffset:', finalOffset, 'Index:', finalOffset % logos.length, 'Should be Extended (3)');
        
        // Move to next step after a longer delay to see the green ring
        setTimeout(() => {
          console.log('Setting step to 6');
          setStep(6);
        }, 800);
      }, totalIterations * 120); // 13 * 120ms = 1560ms

      return () => {
        clearInterval(interval);
        clearTimeout(stopTimeout);
      };
    }

    // Step 8: Tool roulette
    if (step === 6) {
      setIsRolling(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % tools.length;
        setToolIndex(currentIndex);
      }, 150);

      setTimeout(() => {
        clearInterval(interval);
        setToolIndex(1); // Set to get_market_stats
        setIsRolling(false);
        setTimeout(() => setStep(7), 500);
      }, 1800);

      return () => clearInterval(interval);
    }

    // Step 9: Show final checkmark
    if (step === 7) {
      setTimeout(() => setStep(8), 500);
    }

    // Step 10: Turn checkmark gray then reset
    if (step === 8) {
      // Wait for the checkmark to appear, then turn it gray
      const grayTimeout = setTimeout(() => {
        setCheckmarkGray(true);
      }, 400);

      // Then reset animation
      const resetTimeout = setTimeout(() => {
        setStep(0);
        setTypedText('');
        setCategoryIndex(0);
        setLogoIndex(0);
        setSelectedLogoIndex(-1);
        setToolIndex(0);
        setCarouselOffset(0);
        setCheckmarkGray(false);
      }, 2500);

      return () => {
        clearTimeout(grayTimeout);
        clearTimeout(resetTimeout);
      };
    }
  }, [step, typedText, categoryIndex, logoIndex, categories.length, logos.length, fullText.length, tools.length]);

  return (
    <div className="w-full mx-auto mb-8 bg-light-primary dark:bg-dark-primary rounded-xl p-4 sm:p-6 overflow-hidden">
      {/* Step Description */}
      <div className="mb-6 text-center">
        <p 
          className={`text-xs sm:text-sm font-medium transition-all duration-500 min-h-[20px] ${
            step === 8 
              ? 'text-white dark:text-white font-bold' 
              : 'text-black/70 dark:text-white/70'
          }`}
        >
          {getStepDescription()}
        </p>
      </div>

      {/* Main Animation Container - Horizontal Slider */}
      <div className="relative w-full overflow-hidden flex items-center justify-center" style={{ minHeight: '200px' }}>
        {/* Sliding Container */}
        <div 
          className="flex items-center transition-transform duration-700 ease-in-out gap-6"
          style={{
            transform: `translateX(calc(50% - ${
              step === 0 ? '150px' :           // Center the typing text
              step <= 3 ? '400px' :             // Center the first agent
              step <= 5 ? '600px' :             // Center the logos carousel (reduced from 650px)
              step <= 7 ? '850px' :             // Center the tool selector (reduced from 900px)
              '1000px'                           // Center the final checkmark
            }))`
          }}
        >
          {/* Step 1: Typing Text */}
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '280px', minHeight: '120px' }}>
            <h2 className={`text-base sm:text-lg font-mono text-center whitespace-nowrap transition-colors duration-300 ${
              step === 0 && typedText.length < fullText.length
                ? 'text-black dark:text-white'
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {typedText}
              {step === 0 && typedText.length < fullText.length && <span className="animate-pulse">|</span>}
            </h2>
          </div>

          {/* First Arrow */}
          <div className={`flex-shrink-0 transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-white animate-pulse" />
          </div>

          {/* First Agent with Category */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2" style={{ width: '120px' }}>
            {step >= 2 && (
              <>
                <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  <User className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg ${step >= 3 ? 'text-gray-400 dark:text-gray-500' : 'text-white dark:text-white'}`} strokeWidth={1.5} />
                </div>
                
                {/* Category Display below agent */}
                {categoryIndex > 0 && (
                  <div className="text-xs sm:text-sm font-medium text-center min-h-[24px] flex justify-center">
                    {step >= 3 ? (
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 -ml-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        DeFi
                      </span>
                    ) : (
                      <span className="text-white dark:text-white">
                        {categories[categoryIndex - 1]}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Second Arrow */}
          <div className={`flex-shrink-0 transition-all duration-500 ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-white animate-pulse" />
          </div>

          {/* Protocol Logos - Carousel */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2" style={{ width: '180px' }}>
            {step >= 4 && (
              <div className="relative w-full h-20 flex items-center justify-center overflow-hidden">
                {/* Fade-out gradient masks on the sides */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-light-primary dark:from-dark-primary to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-light-primary dark:from-dark-primary to-transparent z-10 pointer-events-none" />
                
                {/* Carousel Container */}
                <div 
                  className="flex gap-4 transition-transform duration-300 ease-out items-center"
                  style={{
                    transform: `translateX(calc(-${carouselOffset * 64}px + 90px))`,
                  }}
                >
                  {/* Repeat logos 10 times for smooth infinite carousel effect */}
                  {Array(10).fill(logos).flat().map((logo, i) => {
                    const actualIndex = i % logos.length;
                    // The carouselOffset represents which logo is centered
                    // We need to see which index in the repeated array is currently centered
                    const isAtActivePosition = i === Math.round(carouselOffset);
                    // Final selection: stopped rolling and Extended logo (index 3) is at active position
                    // Keep white ring even after moving to step 6
                    const isFinalSelection = !isLogoRolling && step >= 5 && actualIndex === 3 && isAtActivePosition;
                    
                    // Debug log when animation stops
                    if (!isLogoRolling && step >= 5 && i === Math.round(carouselOffset)) {
                      console.log('Active logo at position', i, 'actualIndex:', actualIndex, 'logo name:', logo.name, 'isFinalSelection:', isFinalSelection);
                    }
                    
                    return (
                      <div
                        key={`logo-${i}`}
                        className={`rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                          isFinalSelection
                            ? 'w-20 h-20 ring-4 ring-white dark:ring-white shadow-2xl shadow-white/50 opacity-100 scale-125'
                            : isAtActivePosition && step >= 5
                            ? 'w-16 h-16 ring-4 ring-white dark:ring-white shadow-xl shadow-white/50 opacity-100'
                            : 'w-12 h-12 opacity-30 scale-90'
                        }`}
                      >
                        <Image
                          src={logo.url}
                          alt={logo.name}
                          width={isFinalSelection ? 80 : (isAtActivePosition ? 64 : 48)}
                          height={isFinalSelection ? 80 : (isAtActivePosition ? 64 : 48)}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Third Arrow */}
          <div className={`flex-shrink-0 transition-all duration-500 ${step >= 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-white animate-pulse" />
          </div>

          {/* Tool Roulette */}
          <div className="flex-shrink-0" style={{ width: '200px' }}>
            {step >= 6 && (
              <div className="bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-lg p-3 border border-light-200 dark:border-dark-200 relative">
                <div className="relative h-8 overflow-hidden">
                  <div
                    className={`transition-transform duration-200 ${isRolling ? '' : 'duration-500'}`}
                    style={{
                      transform: `translateY(-${toolIndex * 32}px)`
                    }}
                  >
                    {tools.map((tool, i) => (
                      <div
                        key={i}
                        className={`h-8 flex items-center justify-between px-2 text-xs sm:text-sm font-mono ${
                          !isRolling && step >= 7 && i === 1
                            ? 'text-gray-500 dark:text-gray-400'
                            : 'text-black/60 dark:text-white/60'
                        }`}
                      >
                        <span className="truncate">{tool}</span>
                        {!isRolling && step >= 7 && i === 1 && (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fourth Arrow */}
          <div className={`flex-shrink-0 transition-all duration-500 ${step >= 8 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white dark:text-white animate-pulse" />
          </div>

          {/* Final Checkmark */}
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '80px' }}>
            {step >= 8 && (
              <div className="relative animate-in fade-in zoom-in duration-500">
                <Check 
                  className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors duration-1000 ${
                    checkmarkGray ? 'text-gray-500 dark:text-gray-400' : 'text-white dark:text-white'
                  }`} 
                  strokeWidth={2} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mt-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 w-6 sm:w-8 rounded-full transition-all duration-300 ${
              (i === 0 && step >= 0) ||
              (i === 1 && step >= 1) ||
              (i === 2 && step >= 3) ||
              (i === 3 && step >= 6) ||
              (i === 4 && step >= 8)
                ? 'bg-white dark:bg-white' 
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMCPConfig, setShowMCPConfig] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('auto');
  const [activeDocsTab, setActiveDocsTab] = useState<DocsTabType>('what');
  const [activeDocsSubTab, setActiveDocsSubTab] = useState<DocsSubTabType>('overview');
  const [selectedClient, setSelectedClient] = useState<string>('cursor');
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deepLinkOpened, setDeepLinkOpened] = useState<boolean>(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate padding top based on screen size and config state
  const getPaddingTop = () => {
    if (showMCPConfig) {
      return activeTab === 'json' ? 'max(20vh, 100px)' : 'max(25vh, 120px)';
    }
    if (showDocsModal) {
      return 'max(25vh, 120px)';
    }
    return isMobile ? 'max(25vh, 120px)' : 'calc(50vh - 100px)';
  };

  // MCP Configuration for Ask Starknet
  const mcpConfig: MCPStdioConfig = {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@kasarlabs/ask-starknet-mcp'],
    env: {
      STARKNET_PUBLIC_ADDRESS: 'your-public-address-here',
      STARKNET_PRIVATE_KEY: 'your-private-key-here',
      STARKNET_RPC_URL: 'your-rpc-url-here',
      MODEL_API_KEY: 'your-model-api-key-here',
    },
  };

  const displayName = 'Ask Starknet MCP';
  const selectedClientInfo = MCP_CLIENTS.find((c) => c.id === selectedClient);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsTransitioning(true);
      // Navigate to chat route with prompt as query parameter
      setTimeout(() => {
        router.push(`/chat?q=${encodeURIComponent(prompt)}`);
      }, 150);
    }
  };

  const handleChatClick = () => {
    // Trigger fade out animation before navigation
    setIsTransitioning(true);
    // Navigate to chat route after a short delay for smooth transition
    setTimeout(() => {
      router.push('/chat');
    }, 150);
  };

  const handleMCPClick = () => {
    setShowMCPConfig(!showMCPConfig);
    if (showDocsModal) setShowDocsModal(false);
  };

  const handleDocsClick = () => {
    setShowDocsModal(!showDocsModal);
    if (showMCPConfig) setShowMCPConfig(false);
    setActiveDocsSubTab('overview');
  };

  const handleCopyConfig = async () => {
    const configJson = JSON.stringify({ 'ask-starknet': mcpConfig }, null, 2);
    const success = await copyToClipboard(configJson);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOneClickSetup = () => {
    setDeepLinkOpened(true);
    setTimeout(() => setDeepLinkOpened(false), 8000);
  };

  // Generate the deep link URL
  const deepLinkUrl = useMemo(() => {
    try {
      const link = generateMCPDeepLink(
        selectedClient,
        displayName,
        mcpConfig,
        false,
      );
      console.log('Generated deep link for', selectedClient, ':', link);
      return link;
    } catch (err) {
      console.error('Failed to generate deep link:', err);
      return '#';
    }
  }, [selectedClient]);

  const handleLogoClick = () => {
    // Reset all states to initial landing page view
    setShowMCPConfig(false);
    setShowDocsModal(false);
    setPrompt('');
    setActiveTab('auto');

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Navigate to home if not already there
    if (window.location.pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 bg-light-primary dark:bg-dark-primary overflow-hidden">
      {/* Landing Page */}
      <div
        className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Header with Logo */}
        <div
          className={`fixed transition-all duration-300 ease-out ${
            isTransitioning
              ? 'top-4 left-4 sm:top-8 sm:left-6 z-50 opacity-0'
              : 'top-4 left-4 sm:top-8 sm:left-8 z-50 opacity-100'
          }`}
        >
          <div className="relative flex items-center">
            {/* Logo - responsive size */}
            <button
              onClick={handleLogoClick}
              className={`transition-all duration-300 cursor-pointer hover:opacity-80 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Light mode logo */}
              <Image
                src="/ask_full_logo_black_alpha.png"
                alt="Ask Starknet Logo"
                width={120}
                height={40}
                className="object-contain dark:hidden w-[90px] h-[30px] sm:w-[120px] sm:h-[40px]"
              />
              {/* Dark mode logo */}
              <Image
                src="/ask_full_logo_white_alpha.png"
                alt="Ask Starknet Logo"
                width={120}
                height={40}
                className="object-contain hidden dark:block w-[90px] h-[30px] sm:w-[120px] sm:h-[40px]"
              />
            </button>
          </div>
        </div>

        {/* Action Buttons - top right - fade out smoothly */}
        <div
          className={`absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center space-x-3 sm:space-x-8 z-10 transition-all duration-200 ${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            onClick={handleChatClick}
            className="text-black dark:text-white font-medium text-base sm:text-2xl hover:scale-105 transition-transform duration-200"
          >
            Chat
          </button>
          <button
            onClick={handleMCPClick}
            className="text-black dark:text-white font-medium text-base sm:text-2xl hover:scale-105 transition-transform duration-200"
          >
            Mcp
          </button>
          <button
            onClick={handleDocsClick}
            className="text-black dark:text-white font-medium text-base sm:text-2xl hover:scale-105 transition-transform duration-200"
          >
            Docs
          </button>
          <button
            disabled
            className="text-gray-400 dark:text-gray-500 font-medium text-base sm:text-2xl cursor-not-allowed relative"
            title="Coming soon"
          >
            Explore
          </button>
          <button
            onClick={() => window.open('https://cairo-coder.com', '_blank')}
            className="text-black dark:text-white font-medium text-base sm:text-2xl hover:scale-105 transition-transform duration-200"
          >
            Coder
          </button>
        </div>

        {/* Landing Content - fades during transition */}
        <div
          className={`flex flex-col items-center h-full px-4 sm:px-6 md:px-8 transition-all duration-200 ${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Floating Icons around the center - hidden on mobile */}
          <div className="hidden md:block">
            <FloatingIcons isAnimating={isTransitioning} />
          </div>

          {/* Centered Title and Input - title fixed, content grows below */}
          <div
            className="flex flex-col items-center w-full max-w-3xl mx-auto z-10 relative transition-all duration-700 mt-16 sm:mt-0"
            style={{
              paddingTop: getPaddingTop(),
            }}
          >
            {/* Title */}
            <div className="flex flex-col items-center justify-center space-y-2 mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-black/70 dark:text-white/100 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-center transition-all duration-500 px-4">
                {showMCPConfig
                  ? 'Build your own Starknet Agents'
                  : showDocsModal
                    ? 'Ask Starknet Documentation'
                    : 'Unlock your Starknet expertise.'}
              </h1>
              {showMCPConfig && (
                <p className="text-black/60 dark:text-white/70 text-xs sm:text-sm md:text-base text-center max-w-2xl px-4">
                  Ask Starknet is available as a sophisticated MCP server.
                  Access hundreds of Starknet tools and agents via a single
                  ask_starknet method.
                </p>
              )}
              {showDocsModal && (
                <p className="text-black/60 dark:text-white/70 text-xs sm:text-sm md:text-base text-center max-w-2xl px-4">
                  Learn how to build powerful Agentic workflows with Ask Starknet.
                </p>
              )}
            </div>

            {/* Search Input / MCP Config - with growing transition */}
            <div className="w-full overflow-visible">
              {/* Container that grows */}
              <div
                className={`w-full transition-all duration-700 ease-in-out overflow-visible ${
                  showMCPConfig || showDocsModal
                    ? 'px-0 py-0 bg-transparent'
                    : isTransitioning
                      ? 'bg-transparent px-3 sm:px-5 pt-3 sm:pt-5 pb-2 rounded-lg'
                      : 'bg-light-secondary dark:bg-dark-secondary px-3 sm:px-5 pt-3 sm:pt-5 pb-2 rounded-lg'
                }`}
                style={{
                  minHeight: showMCPConfig
                    ? activeTab === 'json'
                      ? '500px'
                      : '250px'
                    : showDocsModal
                      ? '450px'
                      : 'auto',
                }}
              >
                {/* Search Input Content - slides left */}
                <div
                  className={`transition-all duration-400 ${
                    showMCPConfig || showDocsModal
                      ? 'opacity-0 -translate-x-8 h-0 overflow-hidden pointer-events-none'
                      : 'opacity-100 translate-x-0 h-auto'
                  }`}
                >
                  <form onSubmit={handleSubmit} className="w-full">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask anything..."
                      className="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-base sm:text-lg text-black dark:text-white resize-none focus:outline-none w-full py-2 sm:py-3"
                      autoFocus={!showMCPConfig}
                      disabled={isTransitioning}
                    />
                    <div className="flex flex-row items-center justify-end mt-3 sm:mt-4 relative z-50">
                      <button
                        type="submit"
                        disabled={!prompt.trim() || isTransitioning}
                        className="bg-transparent text-white disabled:text-gray-400 dark:disabled:text-gray-500 hover:scale-110 transition-all duration-200 rounded-full p-2"
                      >
                        <svg
                          className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>

                {/* MCP Config Content - appears while container grows */}
                <div
                  className={`transition-all duration-700 ease-in-out ${
                    showMCPConfig
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4 h-0 overflow-hidden pointer-events-none'
                  }`}
                >
                  {showMCPConfig && (
                    <div
                      className="bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 transition-all duration-500 ease-in-out overflow-visible"
                      style={{
                        minHeight: activeTab === 'json' ? '500px' : '200px',
                      }}
                    >
                      {/* Tabs */}
                      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">
                        <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200">
                          <button
                            onClick={() => setActiveTab('auto')}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeTab === 'auto'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              Auto
                            </span>
                            {activeTab === 'auto' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                          <button
                            onClick={() => setActiveTab('json')}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeTab === 'json'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              JSON
                            </span>
                            {activeTab === 'json' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content Container with relative positioning for absolute content */}
                      <div className="relative px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 overflow-visible">
                        {/* JSON Tab Content */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeTab === 'json'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          <div className="space-y-4 sm:space-y-6">
                            <p className="text-xs sm:text-sm text-black/60 dark:text-white/60">
                              Add this configuration to any MCP client settings.
                            </p>

                            {/* JSON Config */}
                            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden relative max-h-[60vh] overflow-y-auto">
                              <button
                                onClick={handleCopyConfig}
                                className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 sm:p-2 text-gray-400 hover:text-white hover:scale-110 rounded-lg transition-all"
                              >
                                {copied ? (
                                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                )}
                              </button>
                              <div className="px-3 sm:px-4 py-3 sm:py-4 overflow-x-auto pt-10 sm:pt-12">
                                <pre className="text-xs sm:text-sm font-mono leading-relaxed">
                                  <code>
                                    <span className="text-blue-400 font-semibold">
                                      &quot;ask-starknet&quot;
                                    </span>
                                    <span className="text-gray-400">
                                      : {'{'}
                                    </span>
                                    {'\n  '}
                                    <span className="text-purple-400">
                                      &quot;command&quot;
                                    </span>
                                    <span className="text-gray-400">: </span>
                                    <span className="text-green-400">
                                      &quot;{mcpConfig.command}&quot;
                                    </span>
                                    <span className="text-gray-400">,</span>
                                    {'\n  '}
                                    <span className="text-purple-400">
                                      &quot;args&quot;
                                    </span>
                                    <span className="text-gray-400">: [</span>
                                    {mcpConfig.args.map((arg, i) => (
                                      <span key={i}>
                                        {'\n    '}
                                        <span className="text-green-400">
                                          &quot;{arg}&quot;
                                        </span>
                                        {i < mcpConfig.args.length - 1 && (
                                          <span className="text-gray-400">
                                            ,
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                    {'\n  '}
                                    <span className="text-gray-400">],</span>
                                    {'\n  '}
                                    <span className="text-purple-400">
                                      &quot;env&quot;
                                    </span>
                                    <span className="text-gray-400">
                                      : {'{'}
                                    </span>
                                    {mcpConfig.env &&
                                      Object.entries(mcpConfig.env).map(
                                        ([key, value], i, arr) => (
                                          <span key={key}>
                                            {'\n    '}
                                            <span className="text-orange-400">
                                              &quot;{key}&quot;
                                            </span>
                                            <span className="text-gray-400">
                                              :{' '}
                                            </span>
                                            <span className="text-green-400">
                                              &quot;{value}&quot;
                                            </span>
                                            {i < arr.length - 1 && (
                                              <span className="text-gray-400">
                                                ,
                                              </span>
                                            )}
                                          </span>
                                        ),
                                      )}
                                    {'\n  '}
                                    <span className="text-gray-400">{'}'}</span>
                                    {'\n'}
                                    <span className="text-gray-400">{'}'}</span>
                                  </code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Auto Tab Content */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeTab === 'auto'
                              ? 'opacity-100 translate-x-0 relative overflow-visible'
                              : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          <div className="space-y-4 sm:space-y-6 overflow-visible">
                            {/* Client Dropdown and One-Click Install */}
                            <div>
                              <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 mb-3 sm:mb-4">
                                Connect this server to{' '}
                                {selectedClientInfo?.name} with one click.
                              </p>
                              
                              {/* Success Message after clicking */}
                              {deepLinkOpened && (
                                <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <p className="text-xs sm:text-sm text-black/80 dark:text-white/80 mb-3">
                                    <span className="font-semibold">✅ {selectedClientInfo?.name} should now be opening!</span>
                                  </p>
                                  <div className="space-y-2 text-xs sm:text-sm text-black/70 dark:text-white/70">
                                    <p className="font-medium text-black/90 dark:text-white/90">Next steps:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-2">
                                      <li>Open <strong>{selectedClientInfo?.name} Settings</strong> (⌘+,)</li>
                                      <li>Navigate to <strong>Features → MCP</strong> section</li>
                                      <li>The Ask Starknet server should appear in your list</li>
                                      <li>Add your environment variables in the configuration</li>
                                    </ol>
                                    <p className="mt-2 pt-2 border-t border-blue-500/20">
                                      <strong>Tip:</strong> If the server doesn't appear automatically, use the <strong>JSON tab</strong> to copy and paste the configuration manually.
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 sm:gap-3 relative z-[100]">
                                <Popover className="relative flex-1">
                                  {({ open }) => (
                                    <>
                                      <Popover.Button className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          {selectedClientInfo?.icon && (
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center">
                                              <Image
                                                src={selectedClientInfo.icon}
                                                alt={selectedClientInfo.name}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                              />
                                            </div>
                                          )}
                                          <span className="font-medium text-sm sm:text-base text-black dark:text-white">
                                            {selectedClientInfo?.name}
                                          </span>
                                        </div>
                                        <ChevronDown
                                          className={`w-4 h-4 sm:w-5 sm:h-5 text-black/50 dark:text-white/50 transition-transform ${open ? 'rotate-180' : ''}`}
                                        />
                                      </Popover.Button>

                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-150"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                      >
                                        <Popover.Panel className="absolute z-[200] left-0 mt-2 w-full">
                                          <div className="bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 rounded-lg shadow-xl overflow-hidden">
                                            {MCP_CLIENTS.filter(
                                              (client) =>
                                                client.id !== selectedClient,
                                            ).map((client) => (
                                              <Popover.Button
                                                key={client.id}
                                                onClick={() =>
                                                  setSelectedClient(client.id)
                                                }
                                                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
                                              >
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex items-center justify-center">
                                                  <Image
                                                    src={client.icon}
                                                    alt={client.name}
                                                    width={24}
                                                    height={24}
                                                    className="object-contain"
                                                  />
                                                </div>
                                                <span className="font-medium text-sm sm:text-base text-black dark:text-white">
                                                  {client.name}
                                                </span>
                                              </Popover.Button>
                                            ))}
                                          </div>
                                        </Popover.Panel>
                                      </Transition>
                                    </>
                                  )}
                                </Popover>

                                {/* One-Click Install Icon */}
                                <a
                                  href={deepLinkUrl}
                                  onClick={handleOneClickSetup}
                                  className="p-3 sm:p-4 text-white rounded-lg transition-transform hover:scale-110 cursor-pointer"
                                  title="One-Click Install"
                                >
                                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documentation Modal Content */}
                <div
                  className={`transition-all duration-700 ease-in-out ${
                    showDocsModal
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-4 h-0 overflow-hidden pointer-events-none'
                  }`}
                >
                  {showDocsModal && (
                    <div
                      className="bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 transition-all duration-500 ease-in-out overflow-visible"
                      style={{
                        minHeight: '450px',
                      }}
                    >
                      {/* Tabs Navigation - Same style as MCP */}
                      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">
                        <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200">
                          <button
                            onClick={() => {
                              setActiveDocsTab('what');
                              setActiveDocsSubTab('overview');
                            }}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeDocsTab === 'what'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              What?
                            </span>
                            {activeDocsTab === 'what' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveDocsTab('getting-started');
                              setActiveDocsSubTab('overview');
                            }}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeDocsTab === 'getting-started'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              Getting Started
                            </span>
                            {activeDocsTab === 'getting-started' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveDocsTab('plugins');
                              setActiveDocsSubTab('overview');
                            }}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeDocsTab === 'plugins'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              Plugins
                            </span>
                            {activeDocsTab === 'plugins' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveDocsTab('environments');
                              setActiveDocsSubTab('overview');
                            }}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeDocsTab === 'environments'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              Environments
                            </span>
                            {activeDocsTab === 'environments' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setActiveDocsTab('examples');
                              setActiveDocsSubTab('overview');
                            }}
                            className={`pb-2 sm:pb-3 px-1 font-medium text-sm sm:text-base transition-all duration-300 relative ${
                              activeDocsTab === 'examples'
                                ? 'text-black dark:text-white'
                                : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              Examples
                            </span>
                            {activeDocsTab === 'examples' && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content Container with relative positioning for absolute content */}
                      <div className="relative px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 overflow-visible">
                        {/* What? Tab */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeDocsTab === 'what'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          <div className="space-y-6">
                            {/* Animation */}
                            <StarknetAgentAnimation />
                          </div>
                        </div>

                        {/* Getting Started Tab - No sub-tabs */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeDocsTab === 'getting-started'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
                                Welcome to Ask Starknet
                              </h3>
                              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                                Ask Starknet is your intelligent assistant for everything Starknet. 
                                Get instant answers to your questions about smart contracts, Cairo, and the Starknet ecosystem.
                              </p>
                            </div>

                            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                              <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
                                3 Steps to Get Started
                              </h4>
                              <ol className="space-y-3 text-sm sm:text-base text-black/70 dark:text-white/70">
                                <li className="flex gap-3">
                                  <span className="font-bold text-black dark:text-white">1.</span>
                                  <span>Type your question in the search box on the home page</span>
                                </li>
                                <li className="flex gap-3">
                                  <span className="font-bold text-black dark:text-white">2.</span>
                                  <span>Press Enter or click the arrow button to submit</span>
                                </li>
                                <li className="flex gap-3">
                                  <span className="font-bold text-black dark:text-white">3.</span>
                                  <span>Get instant, accurate answers with source references</span>
                                </li>
                              </ol>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                              <p className="text-xs sm:text-sm text-black/80 dark:text-white/80">
                                <span className="font-semibold">💡 Tip:</span> Ask specific questions for the best results. 
                                For example: "How do I deploy a smart contract on Starknet?" instead of just "deployment".
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Plugins Tab */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeDocsTab === 'plugins'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          {/* Sub-tabs for API */}
                          <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200 mb-6">
                            <button
                              onClick={() => setActiveDocsSubTab('overview')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'overview'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Introduction
                              {activeDocsSubTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                            <button
                              onClick={() => setActiveDocsSubTab('guide')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'guide'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Endpoints
                              {activeDocsSubTab === 'guide' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                          </div>

                          {/* Sub-tab content */}
                          <div className="relative">
                            {/* Introduction */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'overview'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
                                API Usage
                              </h3>
                              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                                Integrate Ask Starknet into your own applications using our API.
                              </p>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                              <p className="text-xs sm:text-sm text-black/80 dark:text-white/80">
                                <span className="font-semibold">📘 Note:</span> Full API documentation is coming soon. 
                                Contact us for early access to the API.
                              </p>
                            </div>
                          </div>
                            </div>

                            {/* Endpoints */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'guide'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                              <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
                                Endpoint
                              </h4>
                              <div className="bg-black/5 dark:bg-white/5 rounded p-3 font-mono text-xs sm:text-sm">
                                <code className="text-black dark:text-white">POST /api/chat</code>
                              </div>
                            </div>

                            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                              <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
                                Example Request
                              </h4>
                              <div className="bg-[#1a1a1a] rounded-lg p-3 sm:p-4 overflow-x-auto">
                                <pre className="text-xs sm:text-sm text-white font-mono">
{`{
  "messages": [
    {
      "role": "user",
      "content": "How do I deploy a contract?"
    }
  ]
}`}
                                </pre>
                              </div>
                            </div>
                          </div>
                            </div>
                          </div>
                        </div>

                        {/* Environments Tab */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeDocsTab === 'environments'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          {/* Sub-tabs for Environments */}
                          <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200 mb-6">
                            <button
                              onClick={() => setActiveDocsSubTab('overview')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'overview'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Testnet
                              {activeDocsSubTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                            <button
                              onClick={() => setActiveDocsSubTab('guide')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'guide'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Mainnet
                              {activeDocsSubTab === 'guide' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                          </div>

                          {/* Sub-tab content */}
                          <div className="relative">
                            {/* Testnet */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'overview'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
                                Testnet Configuration
                              </h3>
                              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                                Configure Ask Starknet to work with Starknet Testnet (Sepolia).
                              </p>
                            </div>

                            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                              <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
                                RPC Endpoint
                              </h4>
                              <div className="bg-black/5 dark:bg-white/5 rounded p-3 font-mono text-xs sm:text-sm">
                                <code className="text-black dark:text-white">https://starknet-sepolia.public.blastapi.io</code>
                              </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                              <p className="text-xs sm:text-sm text-black/80 dark:text-white/80">
                                <span className="font-semibold">💡 Note:</span> Testnet is recommended for development and testing. 
                                You can get testnet ETH from the Starknet faucet.
                              </p>
                            </div>
                          </div>
                            </div>

                            {/* Mainnet */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'guide'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
                                Mainnet Configuration
                              </h3>
                              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                                Configure Ask Starknet to work with Starknet Mainnet for production.
                              </p>
                            </div>

                            <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                              <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-4">
                                RPC Endpoint
                              </h4>
                              <div className="bg-black/5 dark:bg-white/5 rounded p-3 font-mono text-xs sm:text-sm">
                                <code className="text-black dark:text-white">https://starknet-mainnet.public.blastapi.io</code>
                              </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                              <p className="text-xs sm:text-sm text-black/80 dark:text-white/80">
                                <span className="font-semibold">⚠️ Warning:</span> Mainnet operations use real assets. 
                                Always test your contracts on Testnet first before deploying to Mainnet.
                              </p>
                            </div>
                          </div>
                            </div>
                          </div>
                        </div>

                        {/* Examples Tab */}
                        <div
                          className={`transition-all duration-500 ease-in-out ${
                            activeDocsTab === 'examples'
                              ? 'opacity-100 translate-x-0 relative'
                              : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                          }`}
                        >
                          {/* Sub-tabs for Examples */}
                          <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200 mb-6">
                            <button
                              onClick={() => setActiveDocsSubTab('overview')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'overview'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Basic Questions
                              {activeDocsSubTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                            <button
                              onClick={() => setActiveDocsSubTab('guide')}
                              className={`pb-2 sm:pb-3 px-1 font-medium text-xs sm:text-sm transition-all duration-300 relative ${
                                activeDocsSubTab === 'guide'
                                  ? 'text-black dark:text-white'
                                  : 'text-black/50 dark:text-white/50 hover:text-black/70 dark:hover:text-white/70'
                              }`}
                            >
                              Advanced Topics
                              {activeDocsSubTab === 'guide' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white transition-all duration-300" />
                              )}
                            </button>
                          </div>

                          {/* Sub-tab content */}
                          <div className="relative">
                            {/* Basic Questions */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'overview'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-3">
                                Example Questions
                              </h3>
                              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                                Here are some example questions you can ask:
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 border border-light-200 dark:border-dark-200">
                                <p className="text-sm sm:text-base text-black dark:text-white font-medium mb-1">
                                  Smart Contracts
                                </p>
                                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 italic">
                                  "How do I write a Cairo smart contract for an ERC-20 token?"
                                </p>
                              </div>

                              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 border border-light-200 dark:border-dark-200">
                                <p className="text-sm sm:text-base text-black dark:text-white font-medium mb-1">
                                  Deployment
                                </p>
                                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 italic">
                                  "What are the steps to deploy a contract on Starknet mainnet?"
                                </p>
                              </div>

                              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 border border-light-200 dark:border-dark-200">
                                <p className="text-sm sm:text-base text-black dark:text-white font-medium mb-1">
                                  Cairo Language
                                </p>
                                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 italic">
                                  "What's the difference between Cairo 0 and Cairo 1?"
                                </p>
                              </div>
                            </div>
                          </div>
                            </div>

                            {/* Advanced Topics */}
                            <div
                              className={`transition-all duration-500 ease-in-out ${
                                activeDocsSubTab === 'guide'
                                  ? 'opacity-100 translate-x-0 relative'
                                  : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
                              }`}
                            >
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 border border-light-200 dark:border-dark-200">
                                <p className="text-sm sm:text-base text-black dark:text-white font-medium mb-1">
                                  Ecosystem
                                </p>
                                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 italic">
                                  "What are the best wallets for Starknet?"
                                </p>
                              </div>

                              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 border border-light-200 dark:border-dark-200">
                                <p className="text-sm sm:text-base text-black dark:text-white font-medium mb-1">
                                  Development Tools
                                </p>
                                <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 italic">
                                  "How do I set up Scarb for Cairo development?"
                                </p>
                              </div>
                            </div>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingIcons = ({ isAnimating }: { isAnimating?: boolean }) => {
  const icons = [
    {
      id: 1,
      image:
        'https://pbs.twimg.com/profile_images/1876581196173320192/pF4KQQCb_400x400.jpg',
      twitter: 'extendedapp',
      x: '15%',
      y: '20%',
      blur: 6,
      size: 82,
      mobileSize: 60,
      delay: 0,
      floatAnim: 'animate-float1',
    },
    {
      id: 2,
      image:
        'https://pbs.twimg.com/profile_images/1024585501901303808/m92jEcPI_400x400.jpg',
      twitter: 'ready_co',
      x: '75%',
      y: '15%',
      blur: 7,
      size: 95,
      mobileSize: 70,
      delay: 0.2,
      floatAnim: 'animate-float2',
    },
    {
      id: 3,
      image:
        'https://pbs.twimg.com/profile_images/1736767433635975168/G1H8l7Ci_400x400.jpg',
      twitter: 'avnu_fi',
      x: '85%',
      y: '45%',
      blur: 8,
      size: 78,
      mobileSize: 56,
      delay: 0.4,
      floatAnim: 'animate-float3',
    },
    {
      id: 4,
      image:
        'https://pbs.twimg.com/profile_images/1846554119777013760/FydsgAUR_400x400.jpg',
      twitter: 'myBraavos',
      x: '20%',
      y: '70%',
      blur: 6,
      size: 100,
      mobileSize: 72,
      delay: 0.1,
      floatAnim: 'animate-float4',
    },
    {
      id: 5,
      image:
        'https://pbs.twimg.com/profile_images/1872475547059834880/TGT0jlCk_400x400.jpg',
      twitter: 'XverseApp',
      x: '80%',
      y: '75%',
      blur: 9,
      size: 75,
      mobileSize: 54,
      delay: 0.3,
      floatAnim: 'animate-float5',
    },
    {
      id: 6,
      image:
        'https://pbs.twimg.com/profile_images/1899459698551562240/_WK4Lfeb_400x400.jpg',
      twitter: 'vesuxyz',
      x: '10%',
      y: '45%',
      blur: 7,
      size: 88,
      mobileSize: 64,
      delay: 0.5,
      floatAnim: 'animate-float6',
    },
    {
      id: 7,
      image:
        'https://pbs.twimg.com/profile_images/1676963409303322624/NuCcNNxa_400x400.png',
      twitter: 'EkuboProtocol',
      x: '65%',
      y: '85%',
      blur: 8,
      size: 92,
      mobileSize: 66,
      delay: 0.2,
      floatAnim: 'animate-float1',
    },
    {
      id: 8,
      image:
        'https://pbs.twimg.com/profile_images/1782677936585256960/JAwtVCsD_400x400.png',
      twitter: 'cairolang',
      x: '30%',
      y: '12%',
      blur: 6,
      size: 80,
      mobileSize: 58,
      delay: 0.4,
      floatAnim: 'animate-float2',
    },
    {
      id: 9,
      image:
        'https://pbs.twimg.com/profile_images/1845153042762436629/LZs7_I2b_400x400.jpg',
      twitter: 'cartridge_gg',
      x: '92%',
      y: '60%',
      blur: 7,
      size: 98,
      mobileSize: 70,
      delay: 0.1,
      floatAnim: 'animate-float3',
    },
    {
      id: 10,
      image:
        'https://pbs.twimg.com/profile_images/1845152900256829447/H6PRbeYs_400x400.jpg',
      twitter: 'ohayo_dojo',
      x: '5%',
      y: '85%',
      blur: 9,
      size: 76,
      mobileSize: 55,
      delay: 0.3,
      floatAnim: 'animate-float4',
    },
    {
      id: 11,
      image:
        'https://pbs.twimg.com/profile_images/1854492998954012672/wcFszeR-_400x400.jpg',
      twitter: 'endurfi',
      x: '50%',
      y: '30%',
      blur: 6,
      size: 85,
      mobileSize: 62,
      delay: 0.15,
      floatAnim: 'animate-float5',
    },
    {
      id: 12,
      image:
        'https://pbs.twimg.com/profile_images/1635993072327639041/G_YIQ-G1_400x400.jpg',
      twitter: 'layerswap',
      x: '60%',
      y: '25%',
      blur: 7,
      size: 90,
      mobileSize: 65,
      delay: 0.35,
      floatAnim: 'animate-float6',
    },
    {
      id: 13,
      image:
        'https://pbs.twimg.com/profile_images/1940437227642798080/EnotVJl3_400x400.jpg',
      twitter: 'tradeparadex',
      x: '25%',
      y: '40%',
      blur: 8,
      size: 83,
      mobileSize: 60,
      delay: 0.45,
      floatAnim: 'animate-float1',
    },
    {
      id: 14,
      image:
        'https://pbs.twimg.com/profile_images/1686699616853454848/GMEuUL8M_400x400.jpg',
      twitter: 'FocusTree_',
      x: '40%',
      y: '55%',
      blur: 10,
      size: 78,
      mobileSize: 56,
      delay: 0.25,
      floatAnim: 'animate-float2',
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((icon) => {
        return (
          <div
            key={icon.id}
            className={`absolute transition-all duration-200 ${
              isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            style={{
              left: icon.x,
              top: icon.y,
              animationDelay: `${icon.delay}s`,
            }}
          >
            <a
              href={`https://twitter.com/${icon.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 ${icon.floatAnim} overflow-hidden hover:scale-110 hover:shadow-2xl cursor-pointer block`}
              style={{
                width: `${icon.size}px`,
                height: `${icon.size}px`,
                animationDelay: `${icon.delay}s`,
                filter: `blur(${icon.blur}px)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'blur(0px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = `blur(${icon.blur}px)`;
              }}
            >
              <Image
                src={icon.image}
                alt="App logo"
                width={icon.size}
                height={icon.size}
                className="object-cover rounded-full"
              />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default LandingPage;
