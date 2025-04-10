import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanMarkdownForLinkedIn(content: string): string {
  // Remove headers
  content = content.replace(/#{1,6}\s/g, '');

  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  content = content.replace(/`([^`]+)`/g, '$1');

  // Remove blockquotes
  content = content.replace(/^\s*>\s*/gm, '');

  // Convert lists to plain text
  content = content.replace(/^\s*[-*+]\s+/gm, '• ');
  content = content.replace(/^\s*\d+\.\s+/gm, '');

  // Remove emphasis markers
  content = content.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');

  // Convert links to plain text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove images
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // Remove HTML tags
  content = content.replace(/<[^>]+>/g, '');

  // Remove multiple newlines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  content = content.trim();

  // LinkedIn has a character limit, truncate if necessary
  const MAX_LENGTH = 3000;
  if (content.length > MAX_LENGTH) {
    content = content.substring(0, MAX_LENGTH - 3) + '...';
  }

  return content;
}