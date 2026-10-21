import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Server, Bot } from 'lucide-react';

interface McpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpGuideModal: React.FC<McpGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const stdioJsonConfig = `{
  "mcpServers": {
    "api-docs-hub": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/lioneliqi/Desktop/api-docs-hub/mcp-server/index.ts"
      ]
    }
  }
}`;

  const httpJsonConfig = `{
  "mcpServers": {
    "api-docs-hub-http": {
      "type": "http",
      "url": "http://localhost:3001/api"
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-modal rounded-3xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/20 border border-neon-green/30 flex items-center justify-center text-neon-green">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Connect MCP Server to Your LLM</h2>
              <p className="text-xs text-surface-300">
                Give Claude, Cursor, Antigravity, or ChatGPT instant access to accurate API documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-surface-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Overview Callout */}
          <div className="p-4 rounded-2xl bg-surface-900/80 border border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-accent-300">
              <Bot className="w-4 h-4" />
              <span>How LLMs use this MCP Server</span>
            </div>
            <p className="text-xs text-surface-200 leading-relaxed">
              When an LLM is answering a user request (e.g. &quot;How do I accept Stripe subscriptions in Next.js?&quot;),
              the LLM automatically invokes <code className="text-accent-300 font-mono">search_apis</code> or <code className="text-accent-300 font-mono">get_api_docs</code> to inject <strong>targeted, accurate documentation, endpoints, and quickstarts</strong> directly into its context window.
              When asked &quot;What APIs do I need for this task?&quot;, it calls <code className="text-accent-300 font-mono">recommend_apis</code> to outline the complete architectural blueprint and expected outcome.
            </p>
          </div>

          {/* Option 1: Local Stdio (Claude Desktop, Cursor, Antigravity) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-neon-cyan" />
                <span>Option 1: Local stdio Config (Claude Desktop / Cursor / Antigravity)</span>
              </h3>
              <button
                onClick={() => copySnippet(stdioJsonConfig, 1)}
                className="flex items-center space-x-1 text-xs text-accent-400 hover:text-accent-300"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <p className="text-xs text-surface-400">
              Add this block to your <code className="text-surface-200">.mcp.json</code> or Claude Desktop config:
            </p>
            <pre className="p-4 rounded-2xl bg-surface-950 border border-white/10 text-xs font-mono text-surface-200 overflow-x-auto">
              <code>{stdioJsonConfig}</code>
            </pre>
          </div>

          {/* Option 2: HTTP Transport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-neon-purple" />
                <span>Option 2: HTTP Server (Remote & Web Access)</span>
              </h3>
              <button
                onClick={() => copySnippet('npm run mcp:http', 2)}
                className="flex items-center space-x-1 text-xs text-accent-400 hover:text-accent-300"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-neon-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <p className="text-xs text-surface-400">
              Launch the standalone HTTP MCP server on port 3001:
            </p>
            <pre className="p-3 rounded-2xl bg-surface-950 border border-white/10 text-xs font-mono text-neon-green">
              <code>npm run mcp:http</code>
            </pre>
          </div>

          {/* MCP Tools summary */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400">
              Exposed MCP Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface-900/60 border border-white/5">
                <span className="font-mono text-accent-300 font-semibold">search_apis</span>
                <p className="text-surface-400 text-[11px] mt-0.5">Fuzzy search directory by keywords or category</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-900/60 border border-white/5">
                <span className="font-mono text-neon-green font-semibold">get_api_docs</span>
                <p className="text-surface-400 text-[11px] mt-0.5">Retrieve auth, endpoints, and quickstarts for an API</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-900/60 border border-white/5">
                <span className="font-mono text-neon-purple font-semibold">recommend_apis</span>
                <p className="text-surface-400 text-[11px] mt-0.5">Task architectural planning & expected outcomes</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-900/60 border border-white/5">
                <span className="font-mono text-neon-cyan font-semibold">compare_apis</span>
                <p className="text-surface-400 text-[11px] mt-0.5">Side-by-side comparison matrix</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
