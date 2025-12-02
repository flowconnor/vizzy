'use client'

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
   code: string;
   language?: string;
   showLineNumbers?: boolean;
   className?: string;
   showCopyButton?: boolean;
}

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const customStyle = {
   ...vscDarkPlus,
   'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'rgba(30, 41, 59, 0.98)',
      borderRadius: '1rem',
      padding: '1.5rem',
      margin: '1rem 0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      fontSize: '0.9rem',
      lineHeight: '1.5',
   },
   'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      textShadow: 'none',
   },
   'pre[class*="language-"]::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
   },
   'pre[class*="language-"]::-webkit-scrollbar-track': {
      background: 'rgba(148, 163, 184, 0.1)',
      borderRadius: '4px',
   },
   'pre[class*="language-"]::-webkit-scrollbar-thumb': {
      background: 'rgba(148, 163, 184, 0.2)',
      borderRadius: '4px',
      '&:hover': {
         background: 'rgba(148, 163, 184, 0.3)',
      },
   },
};

const CodeSnippet: React.FC<CodeSnippetProps> = ({
   code,
   language = 'typescript',
   showLineNumbers = true,
   className = '',
   showCopyButton = true,
}) => {
   const [isCopied, setIsCopied] = useState(false);

   const handleCopy = async () => {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
   };

   return (
      <div className={`relative group ${className}`}>
         {/* Gradient border effect */}
         <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-sky-500/30 opacity-20 group-hover:opacity-30 transition-opacity rounded-lg blur"></div>
         
         {/* Code container */}
         <div className="relative">
            {showCopyButton && (
               <button
                  onClick={handleCopy}
                  className="absolute right-4 top-4 p-2 rounded-md bg-slate-700/50 hover:bg-slate-700/70 transition-colors text-slate-300 hover:text-white"
                  title="Copy code"
               >
                  {isCopied ? <CheckIcon /> : <CopyIcon />}
               </button>
            )}
            
            <SyntaxHighlighter
               language={language}
               style={customStyle}
               showLineNumbers={showLineNumbers}
               wrapLines={true}
               customStyle={{
                  margin: 0,
                  background: 'transparent',
                  backdropFilter: 'blur(8px)',
               }}
               lineNumberStyle={{
                  minWidth: '2.5em',
                  paddingRight: '1em',
                  color: 'rgba(148, 163, 184, 0.4)',
                  textAlign: 'right',
                  userSelect: 'none',
               }}
            >
               {code}
            </SyntaxHighlighter>
         </div>
      </div>
   );
};

export default CodeSnippet;
