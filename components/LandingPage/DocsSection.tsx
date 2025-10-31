'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Search, ChevronDown } from 'lucide-react';
import { copyToClipboard } from '@/lib/mcpDeepLink';
import StarknetAgentAnimation from './StarknetAgentAnimation';
import { PLUGINS_DATA, type PluginsData } from './data/pluginsData';

type DocsTabType = 'what' | 'getting-started' | 'plugins' | 'environments';

type DocsSectionProps = {
  activeDocsTab: DocsTabType;
  setActiveDocsTab: (tab: DocsTabType) => void;
};

const DocsSection = ({ activeDocsTab, setActiveDocsTab }: DocsSectionProps) => {
  const [copiedGettingStarted, setCopiedGettingStarted] = useState<boolean>(false);
  const [pluginSearch, setPluginSearch] = useState<string>('');
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);

  // Filtered plugins based on search
  const filteredPlugins = useMemo(() => {
    if (!pluginSearch.trim()) {
      return Object.entries(PLUGINS_DATA);
    }
    const search = pluginSearch.toLowerCase();
    return Object.entries(PLUGINS_DATA).filter(([name, plugin]) => {
      return (
        name.toLowerCase().includes(search) ||
        plugin.description.toLowerCase().includes(search) ||
        plugin.promptInfo.expertise.toLowerCase().includes(search) ||
        plugin.promptInfo.tools.some(tool => tool.toLowerCase().includes(search))
      );
    });
  }, [pluginSearch]);

  const handleCopyGettingStartedConfig = async () => {
    const configJson = JSON.stringify({
      mcpServers: {
        'ask-starknet': {
          type: 'stdio',
          command: 'npx',
          args: ['-y', '@kasarlabs/ask-starknet-mcp'],
          env: {
            PROVIDER_API_KEY: 'your-model-api-key-here',
          },
        },
      },
    }, null, 2);
    const success = await copyToClipboard(configJson);
    if (success) {
      setCopiedGettingStarted(true);
      setTimeout(() => setCopiedGettingStarted(false), 2000);
    }
  };

  return (
    <div
      className="bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 transition-all duration-500 ease-in-out overflow-visible"
      style={{
        minHeight: activeDocsTab === 'what' ? '600px' : '450px',
        maxHeight: '70vh',
      }}
    >
      {/* Tabs Navigation */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="flex gap-4 sm:gap-6 border-b border-light-200 dark:border-dark-200">
          <button
            onClick={() => setActiveDocsTab('what')}
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
            onClick={() => setActiveDocsTab('getting-started')}
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
            onClick={() => setActiveDocsTab('plugins')}
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
            onClick={() => setActiveDocsTab('environments')}
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
        </div>
      </div>

      {/* Content Container */}
      <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
        <div className="relative overflow-y-auto overflow-x-hidden docs-scrollbar" style={{ maxHeight: 'calc(70vh - 120px)' }}>
          {/* What? Tab */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeDocsTab === 'what'
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 -translate-x-4 hidden'
            }`}
          >
            <div className="space-y-6">
              {/* Animation */}
              <StarknetAgentAnimation />
              
              {/* Documentation Text */}
              <div>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                  Ask Starknet is an advanced MCP server that enables interaction with the entire Starknet network. 
                  It leverages a graph-based architecture, meaning that where a traditional MCP redirects a request 
                  to a single tool, Ask Starknet routes requests through a graph containing multiple category-specific 
                  agents (DeFi, social, gaming, etc.), each containing numerous prompt-tuned agents responsible for 
                  their own set of tools.
                </p>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                  The goal is to simplify the user experience, improve the developer experience, reduce hallucinations, 
                  and increase success rates for static and chained executions.
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started Tab */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeDocsTab === 'getting-started'
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-4 hidden'
            }`}
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                  To use Ask Starknet, you just need to get an API key (
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:opacity-70 transition-opacity">OpenAI</a>, {' '}
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:opacity-70 transition-opacity">Anthropic</a>, {' '}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:opacity-70 transition-opacity">Gemini</a>, etc.) and configure your{' '}
                  <a href="https://modelcontextprotocol.io/docs/learn/server-concepts" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:opacity-70 transition-opacity">MCP server</a> with any{' '}
                  <a href="https://modelcontextprotocol.io/docs/learn/client-concepts" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white underline hover:opacity-70 transition-opacity">MCP client</a>:
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden relative">
                <button
                  onClick={handleCopyGettingStartedConfig}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 sm:p-2 text-gray-400 hover:text-white hover:scale-110 rounded-lg transition-all"
                >
                  {copiedGettingStarted ? (
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
                      <span className="text-purple-400">
                        &quot;mcpServers&quot;
                      </span>
                      <span className="text-gray-400">: {'{'}
                      </span>
                      {'\n    '}
                      <span className="text-blue-400 font-semibold">
                        &quot;ask-starknet&quot;
                      </span>
                      <span className="text-gray-400">: {'{'}
                      </span>
                      {'\n      '}
                      <span className="text-purple-400">
                        &quot;type&quot;
                      </span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">
                        &quot;stdio&quot;
                      </span>
                      <span className="text-gray-400">,</span>
                      {'\n      '}
                      <span className="text-purple-400">
                        &quot;command&quot;
                      </span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">
                        &quot;npx&quot;
                      </span>
                      <span className="text-gray-400">,</span>
                      {'\n      '}
                      <span className="text-purple-400">
                        &quot;args&quot;
                      </span>
                      <span className="text-gray-400">: [</span>
                      {'\n        '}
                      <span className="text-green-400">
                        &quot;-y&quot;
                      </span>
                      <span className="text-gray-400">,</span>
                      {'\n        '}
                      <span className="text-green-400">
                        &quot;@kasarlabs/ask-starknet-mcp&quot;
                      </span>
                      {'\n      '}
                      <span className="text-gray-400">],</span>
                      {'\n      '}
                      <span className="text-purple-400">
                        &quot;env&quot;
                      </span>
                      <span className="text-gray-400">: {'{'}
                      </span>
                      {'\n        '}
                      <span className="text-orange-400">
                        &quot;PROVIDER_API_KEY&quot;
                      </span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-400">
                        &quot;your-model-api-key-here&quot;
                      </span>
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

              <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                And that&apos;s it! You can now start using Ask Starknet.
              </p>

              <div className="flex gap-2 items-start text-xs sm:text-sm text-black/70 dark:text-white/70">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="leading-relaxed">
                  Note: For simplicity, the MCP server environment management is dynamic. 
                  If you make an RPC request, for example, the <code className="bg-black/10 dark:bg-white/10 px-1 rounded">STARKNET_RPC_URL</code> environment variable may be necessary. 
                  If you make a request via the extended agent, an <code className="bg-black/10 dark:bg-white/10 px-1 rounded">EXTENDED_API_KEY</code> may be recommended depending on the tool called.{' '}
                  <button 
                    onClick={() => setActiveDocsTab('environments')}
                    className="text-black dark:text-white underline hover:opacity-70 transition-opacity"
                  >
                    Learn more
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Plugins Tab */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeDocsTab === 'plugins'
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-4 hidden'
            }`}
          >
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-black/40 dark:text-white/40" />
                  <input
                    type="text"
                    value={pluginSearch}
                    onChange={(e) => setPluginSearch(e.target.value)}
                    placeholder="Search plugins, tools, descriptions..."
                    className="w-full pl-10 pr-4 py-3 bg-light-primary dark:bg-dark-primary border-0 rounded-lg text-sm sm:text-base text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-0"
                  />
                </div>
                {pluginSearch && (
                  <p className="mt-2 text-xs sm:text-sm text-black/60 dark:text-white/60">
                    {filteredPlugins.length} {filteredPlugins.length === 1 ? 'plugin' : 'plugins'} found
                  </p>
                )}
              </div>

              {/* Plugins Grid */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {filteredPlugins.map(([name, plugin]) => (
                  <div
                    key={name}
                    className="bg-light-primary dark:bg-dark-primary border border-light-200 dark:border-dark-200 rounded-lg p-4 hover:border-white/30 transition-all cursor-pointer"
                    onClick={() => setSelectedPlugin(selectedPlugin === name ? null : name)}
                  >
                    {/* Plugin Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-1 capitalize">
                          {name}
                        </h4>
                        <p className="text-xs sm:text-sm text-black/70 dark:text-white/70 leading-relaxed">
                          {plugin.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-black/50 dark:text-white/50 transition-transform ${
                            selectedPlugin === name ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Plugin Details (Expandable) */}
                    {selectedPlugin === name && (
                      <div className="mt-4 pt-4 border-t border-light-200 dark:border-dark-200 space-y-4">
                        {/* Expertise */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-black dark:text-white mb-2">
                            Expertise
                          </h5>
                          <p className="text-xs sm:text-sm text-black/70 dark:text-white/70">
                            {plugin.promptInfo.expertise}
                          </p>
                        </div>

                        {/* Tools */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-black dark:text-white mb-2">
                            Tools ({plugin.promptInfo.tools.length})
                          </h5>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {plugin.promptInfo.tools.map((tool) => (
                              <span
                                key={tool}
                                className="text-xs px-2 py-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded border border-light-200 dark:border-dark-200 font-mono"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Environment Variables */}
                        {plugin.client.env && typeof plugin.client.env === 'object' && Object.keys(plugin.client.env).length > 0 && (
                          <div>
                            <h5 className="text-xs sm:text-sm font-semibold text-black dark:text-white mb-2">
                              Environment Variables
                            </h5>
                            <div className="space-y-1">
                              {Object.keys(plugin.client.env).map((envKey) => (
                                <code
                                  key={envKey}
                                  className="block text-xs px-2 py-1 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded font-mono"
                                >
                                  {envKey}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Installation Command */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-semibold text-black dark:text-white mb-2">
                            Installation
                          </h5>
                          <div className="bg-[#1a1a1a] rounded p-3 overflow-x-auto">
                            <code className="text-xs text-white font-mono whitespace-nowrap">
                              {plugin.client.command} {plugin.client.args.join(' ')}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* No results message */}
                {filteredPlugins.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm sm:text-base text-black/60 dark:text-white/60">
                      No plugins found matching &quot;{pluginSearch}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Environments Tab */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeDocsTab === 'environments'
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-4 hidden'
            }`}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3">
                  Required Environment Variables
                </h4>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                  The Snaknet MCP requires at least one LLM API key to function:
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                <div className="px-3 sm:px-4 py-3 sm:py-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm font-mono leading-relaxed">
                    <code>
                      <span className="text-gray-500"># At least one of these is required</span>
                      {'\n'}
                      <span className="text-purple-400">export</span>
                      <span className="text-white"> ANTHROPIC_API_KEY</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-green-400">&quot;sk-...&quot;</span>
                      <span className="text-gray-500">     # For Claude models (recommended)</span>
                      {'\n'}
                      <span className="text-purple-400">export</span>
                      <span className="text-white"> GEMINI_API_KEY</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-green-400">&quot;...&quot;</span>
                      <span className="text-gray-500">           # For Google Gemini models</span>
                      {'\n'}
                      <span className="text-purple-400">export</span>
                      <span className="text-white"> OPENAI_API_KEY</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-green-400">&quot;sk-...&quot;</span>
                      <span className="text-gray-500">        # For OpenAI models</span>
                      {'\n\n'}
                      <span className="text-gray-500"># Optional: specify model name (defaults based on API key provider)</span>
                      {'\n'}
                      <span className="text-purple-400">export</span>
                      <span className="text-white"> MODEL_NAME</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-green-400">&quot;claude-sonnet-4-20250514&quot;</span>
                    </code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3">
                  Optional Environment Variables
                </h4>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                  Depending on which Starknet operations you want to perform, you may need additional environment variables. The router dynamically loads all environment variables and passes them to the appropriate MCPs as needed.
                </p>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-4">
                  For example:
                </p>
              </div>

              <div className="bg-light-primary dark:bg-dark-primary rounded-lg p-4 sm:p-6 border border-light-200 dark:border-dark-200">
                <ul className="space-y-2 text-sm sm:text-base text-black/70 dark:text-white/70">
                  <li className="flex items-start">
                    <span className="font-mono text-black dark:text-white mr-2">STARKNET_RPC_URL</span>
                    <span>- For interacting with Starknet blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-mono text-black dark:text-white mr-2">EXTENDED_API_KEY</span>
                    <span>- For Extended MCP executions</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2 items-start text-xs sm:text-sm text-black/70 dark:text-white/70">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="leading-relaxed">
                  Note: Simply add any environment variables required by the MCPs you want to use, and they will be automatically available to the router.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsSection;

