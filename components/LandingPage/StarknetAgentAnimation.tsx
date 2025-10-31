'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, Check } from 'lucide-react';

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
    { name: 'Vesu', url: 'https://pbs.twimg.com/profile_images/1982565692663599104/X5i_XGxL_400x400.jpg' },
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
              ? 'text-black dark:text-white font-bold' 
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
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white animate-pulse" />
          </div>

          {/* First Agent with Category */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2" style={{ width: '120px' }}>
            {step >= 2 && (
              <>
                <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                  <svg className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg ${step >= 3 ? 'text-gray-400 dark:text-gray-500' : 'text-black dark:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
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
                      <span className="text-black dark:text-white">
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
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white animate-pulse" />
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
                            ? 'w-20 h-20 ring-4 ring-black dark:ring-white shadow-2xl shadow-black/50 dark:shadow-white/50 opacity-100 scale-125'
                            : isAtActivePosition && step >= 5
                            ? 'w-16 h-16 ring-4 ring-black dark:ring-white shadow-xl shadow-black/50 dark:shadow-white/50 opacity-100'
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
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white animate-pulse" />
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
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white animate-pulse" />
          </div>

          {/* Final Checkmark */}
          <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '80px' }}>
            {step >= 8 && (
              <div className="relative animate-in fade-in zoom-in duration-500">
                <Check 
                  className={`w-16 h-16 sm:w-20 sm:h-20 transition-colors duration-1000 ${
                    checkmarkGray ? 'text-gray-500 dark:text-gray-400' : 'text-black dark:text-white'
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
                ? 'bg-black dark:bg-white' 
                : 'bg-gray-400 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StarknetAgentAnimation;

