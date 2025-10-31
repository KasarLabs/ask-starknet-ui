'use client';

import Footer from './Footer';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isChat = pathname === '/chat' || pathname?.startsWith('/c/');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="lg:pl-20 bg-light-primary dark:bg-dark-primary flex-grow">
        <div className="max-w-screen-lg lg:mx-auto mx-2 sm:mx-4">{children}</div>
      </main>
      {!isChat && <Footer />}
    </div>
  );
};

export default Layout;
