'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import Footer from '../Footer';
import FloatingIcons from './FloatingIcons';
import MCPConfigSection from './MCPConfigSection';
import DocsSection from './DocsSection';

type TabType = 'auto' | 'json';
type DocsTabType = 'what' | 'getting-started' | 'plugins' | 'environments';

const LandingPage = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMCPConfig, setShowMCPConfig] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('auto');
  const [activeDocsTab, setActiveDocsTab] = useState<DocsTabType>('what');
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
      return 'max(15vh, 80px)';
    }
    return isMobile ? 'max(25vh, 120px)' : 'calc(50vh - 100px)';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsTransitioning(true);
      // Create a chat id and pass the initial message via sessionStorage
      setTimeout(() => {
        const id =
          globalThis.crypto && 'randomUUID' in globalThis.crypto
            ? (globalThis.crypto as Crypto).randomUUID()
            : Math.random().toString(36).slice(2);
        try {
          sessionStorage.setItem(`pendingPrompt:${id}`, prompt);
        } catch {}
        router.push(`/c/${id}`);
      }, 150);
    }
  };

  const handleChatClick = () => {
    // Trigger fade out animation before navigation
    setIsTransitioning(true);
    // Navigate to chat route after a short delay for smooth transition
    setTimeout(() => {
      router.push('/chat');
    }, 50);
  };

  const handleMCPClick = () => {
    setShowMCPConfig(!showMCPConfig);
    if (showDocsModal) setShowDocsModal(false);
  };

  const handleDocsClick = () => {
    setShowDocsModal(!showDocsModal);
    if (showMCPConfig) setShowMCPConfig(false);
    setActiveDocsTab('what');
  };

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
    <div className="bg-light-primary dark:bg-dark-primary">
      {/* Landing Page Content - with relative position to contain FloatingIcons */}
      <div className="relative min-h-screen">
        <div
          className={`min-h-screen transition-opacity duration-100 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
        {/* Header with Logo */}
        <div
          className={`fixed transition-all duration-100 ease-out ${
            isTransitioning
              ? 'top-4 left-4 sm:top-8 sm:left-6 z-50 opacity-0'
              : 'top-4 left-4 sm:top-8 sm:left-8 z-50 opacity-100'
          }`}
        >
          <div className="relative flex items-center">
            {/* Logo - responsive size */}
            <button
              onClick={handleLogoClick}
              className={`transition-all duration-100 cursor-pointer hover:opacity-80 ${
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
          className={`absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center space-x-3 sm:space-x-8 z-10 transition-all duration-100 ${
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
            onClick={() => window.open('https://cairo-coder.com', '_blank')}
            className="text-black dark:text-white font-medium text-base sm:text-2xl hover:scale-105 transition-transform duration-200"
          >
            Coder
          </button>
        </div>

        {/* Landing Content - fades during transition */}
        <div
          className={`flex flex-col items-center h-full px-4 sm:px-6 md:px-8 transition-all duration-100 ${
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
                  <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Only Shift+Enter creates newline, all other combinations submit
                        if (e.shiftKey) {
                          // Allow default behavior (newline)
                          return;
                        }
                        // Plain Enter or Cmd/Ctrl/Alt+Enter submits
                        e.preventDefault();
                        if (prompt.trim().length === 0 || isTransitioning)
                          return;
                        handleSubmit(e);
                      }
                    }}
                    className="w-full"
                  >
                    <TextareaAutosize
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask anything..."
                      className="bg-transparent placeholder:text-black/50 dark:placeholder:text-white/50 text-base sm:text-lg text-black dark:text-white resize-none focus:outline-none w-full py-2 sm:py-3 max-h-48"
                      autoFocus={!showMCPConfig}
                      disabled={isTransitioning}
                      minRows={1}
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
                    <MCPConfigSection
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      selectedClient={selectedClient}
                      setSelectedClient={setSelectedClient}
                      copied={copied}
                      setCopied={setCopied}
                      deepLinkOpened={deepLinkOpened}
                      setDeepLinkOpened={setDeepLinkOpened}
                    />
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
                    <DocsSection
                      activeDocsTab={activeDocsTab}
                      setActiveDocsTab={setActiveDocsTab}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* Footer outside the relative container so FloatingIcons don't overlap it */}
      <Footer />
    </div>
  );
};

export default LandingPage;

