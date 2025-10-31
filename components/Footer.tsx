import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsTelegram, BsGithub } from 'react-icons/bs';

interface XIconProps {
  className?: string;
  size?: number;
}

const XIcon = ({ className, size = 24 }: XIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-800" style={{ backgroundColor: '#1e1e1e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1 - KasarLabs Logo and Terms */}
          <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4">
            <div className="w-[110px] sm:w-[125px] md:w-[140px]">
              <div className="relative w-full h-8 sm:h-10">
                <a
                  href="https://kasar.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="https://github.com/KasarLabs/brand/blob/main/kasar/logo/KasarWhiteLogo.png?raw=true"
                    fill
                    alt="kasarlabs"
                    className="object-contain"
                  />
                </a>
              </div>
            </div>
            <div className="text-neutral-400 text-xs sm:text-sm flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2">
              <a
                href="https://kasar.io/pages/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Terms
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://kasar.io/pages/general-conditions-of-sale"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Conditions
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://kasar.io/pages/legal-information"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Legal
              </a>
            </div>
          </div>

          {/* Column 2 - Resources */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Resources
            </h3>
            <ul className="space-y-1 sm:space-y-2 md:space-y-3">
              <li>
                <a
                  href="https://cairo-coder.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-xs sm:text-sm md:text-base transition-colors"
                >
                  Cairo Coder
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@kasarlabs/ask-starknet-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-xs sm:text-sm md:text-base transition-colors"
                >
                  Package
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/kasarlabs/ask-starknet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white text-xs sm:text-sm md:text-base transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Us */}
          <div className="text-center sm:text-left sm:col-span-1 lg:col-span-1">
            <h3 className="text-white font-semibold mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg">
              Contact us
            </h3>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 md:space-x-6">
              <Link
                href="https://x.com/KasarLabs"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <XIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </Link>
              <Link
                href="https://t.me/+jZZuamlUM5lNWNk"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <BsTelegram className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </Link>
              <Link
                href="https://github.com/kasarlabs"
                target="_blank"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <BsGithub className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-800">
          <p className="text-center text-neutral-400 text-xs sm:text-sm">
            © {new Date().getFullYear()} KasarLabs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

