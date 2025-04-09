'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { ComponentPropsWithoutRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import 'github-markdown-css';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="my-4 leading-relaxed text-gray-700" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-gray-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                        <em className="italic text-gray-700" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 bg-gray-50 py-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside my-4 space-y-2 text-gray-700" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="ml-4 text-gray-700" {...props} />
                    ),
                    code: ({
                        inline,
                        className,
                        children,
                        ...props
                    }: {
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                    }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={tomorrow}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg my-4"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-gray-100 rounded px-1 py-0.5 text-sm text-gray-800" {...props}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ node, ...props }) => (
                        <a
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                    img: ({ node, ...props }) => (
                        <img
                            className="rounded-lg shadow-md max-w-full h-auto my-4"
                            loading="lazy"
                            {...props}
                            alt={props.alt || 'Blog post image'}
                        />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr className="my-8 border-t border-gray-200" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="my-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />
                    ),
                    pre: ({ node, ...props }) => (
                        <pre className="overflow-auto rounded-lg bg-gray-50 p-4 my-4" {...props} />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}