import { TextStyle } from '../types/resume';

/**
 * Parse markdown text with links into segments
 * Example: "[SpaceONE](https://spaceone.org) is a platform"
 * -> [{ type: 'link', text: 'SpaceONE', url: 'https://spaceone.org' }, { text: ' is a platform' }]
 */
export function parseMarkdownLinks(text: string): TextStyle[] {
  const segments: TextStyle[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index)
      });
    }

    // Add the link
    segments.push({
      type: 'link',
      text: match[1],
      url: match[2]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex)
    });
  }

  // If no links found, return the original text as a single segment
  if (segments.length === 0) {
    segments.push({ text });
  }

  return segments;
}

/**
 * Convert segments back to markdown text
 */
export function segmentsToMarkdown(segments: TextStyle[]): string {
  return segments.map(segment => {
    if (segment.type === 'link' && segment.url) {
      return `[${segment.text}](${segment.url})`;
    }
    return segment.text || '';
  }).join('');
}

/**
 * Check if text contains markdown links
 */
export function hasMarkdownLinks(text: string): boolean {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  return linkRegex.test(text);
}