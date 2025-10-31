'use client';

import { Fragment, useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Copy, Check } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import {
  MCP_CLIENTS,
  generateMCPDeepLink,
  copyToClipboard,
  type MCPStdioConfig,
} from '@/lib/mcpDeepLink';

type TabType = 'auto' | 'json';

type MCPConfigSectionProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedClient: string;
  setSelectedClient: (client: string) => void;
  copied: boolean;
  setCopied: (value: boolean) => void;
  deepLinkOpened: boolean;
  setDeepLinkOpened: (value: boolean) => void;
};

const MCPConfigSection = ({
  activeTab,
  setActiveTab,
  selectedClient,
  setSelectedClient,
  copied,
  setCopied,
  deepLinkOpened,
  setDeepLinkOpened,
}: MCPConfigSectionProps) => {
  // MCP Configuration for Ask Starknet
  const mcpConfig: MCPStdioConfig = useMemo(() => ({
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@kasarlabs/ask-starknet-mcp'],
    env: {
      PROVIDER_API_KEY: 'your-model-api-key-here',
    },
  }), []);

  const displayName = 'Ask Starknet MCP';
  const selectedClientInfo = MCP_CLIENTS.find((c) => c.id === selectedClient);

  const handleCopyConfig = async () => {
    const configJson = JSON.stringify({ mcpServers: { 'ask-starknet': mcpConfig } }, null, 2);
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
  }, [selectedClient, mcpConfig]);

  return (
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
                    <span className="text-gray-400">{'{'}</span>
                    {'\n  '}
                    <span className="text-blue-400 font-semibold">
                      &quot;mcpServers&quot;
                    </span>
                    <span className="text-gray-400">
                      : {'{'}
                    </span>
                    {'\n    '}
                    <span className="text-blue-400 font-semibold">
                      &quot;ask-starknet&quot;
                    </span>
                    <span className="text-gray-400">
                      : {'{'}
                    </span>
                    {'\n      '}
                    <span className="text-purple-400">
                      &quot;type&quot;
                    </span>
                    <span className="text-gray-400">: </span>
                    <span className="text-green-400">
                      &quot;{mcpConfig.type}&quot;
                    </span>
                    <span className="text-gray-400">,</span>
                    {'\n      '}
                    <span className="text-purple-400">
                      &quot;command&quot;
                    </span>
                    <span className="text-gray-400">: </span>
                    <span className="text-green-400">
                      &quot;{mcpConfig.command}&quot;
                    </span>
                    <span className="text-gray-400">,</span>
                    {'\n      '}
                    <span className="text-purple-400">
                      &quot;args&quot;
                    </span>
                    <span className="text-gray-400">: [</span>
                    {mcpConfig.args.map((arg, i) => (
                      <span key={i}>
                        {'\n        '}
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
                    {'\n      '}
                    <span className="text-gray-400">],</span>
                    {'\n      '}
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
                            {'\n        '}
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
                    {'\n      '}
                    <span className="text-gray-400">{'}'}</span>
                    {'\n    '}
                    <span className="text-gray-400">{'}'}</span>
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
                      <strong>Tip:</strong> If the server doesn&apos;t appear automatically, use the <strong>JSON tab</strong> to copy and paste the configuration manually.
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
  );
};

export default MCPConfigSection;

