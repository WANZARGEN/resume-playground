import { TextStyle } from '../types/resume';

/**
 * Parse markdown text with all styles (emphasis, accent, highlight, links) into segments
 * - **text** → emphasis
 * - ##text## → accent
 * - `text` → highlight
 * - [text](url) → link
 */
export function parseMarkdownText(text: string): TextStyle[] {
  const segments: TextStyle[] = [];

  // Combined regex for all markdown patterns
  // Order matters: more specific patterns first
  const markdownRegex = /(\*\*([^*]+)\*\*)|(##([^#]+)##)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index)
      });
    }

    // Determine which pattern matched
    if (match[1]) {
      // **text** - emphasis
      segments.push({
        type: 'emphasis',
        text: match[2]
      });
    } else if (match[3]) {
      // ##text## - accent
      segments.push({
        type: 'accent',
        text: match[4]
      });
    } else if (match[5]) {
      // `text` - highlight
      segments.push({
        type: 'highlight',
        text: match[6]
      });
    } else if (match[7]) {
      // [text](url) - link
      segments.push({
        type: 'link',
        text: match[8],
        url: match[9]
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex)
    });
  }

  // If no patterns found, return the original text as a single segment
  if (segments.length === 0) {
    segments.push({ text });
  }

  return segments;
}

/**
 * Parse markdown text with links only (legacy function for compatibility)
 */
export function parseMarkdownLinks(text: string): TextStyle[] {
  return parseMarkdownText(text);
}

/**
 * Convert segments back to markdown text
 */
export function segmentsToMarkdown(segments: TextStyle[]): string {
  return segments.map(segment => {
    switch (segment.type) {
      case 'emphasis':
        return `**${segment.text}**`;
      case 'accent':
        return `##${segment.text}##`;
      case 'highlight':
        return `\`${segment.text}\``;
      case 'link':
        return segment.url ? `[${segment.text}](${segment.url})` : segment.text || '';
      default:
        return segment.text || '';
    }
  }).join('');
}

/**
 * Check if text contains any markdown patterns
 */
export function hasMarkdown(text: string): boolean {
  const markdownRegex = /(\*\*[^*]+\*\*)|(##[^#]+##)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/;
  return markdownRegex.test(text);
}

/**
 * Check if text contains markdown links (legacy function for compatibility)
 */
export function hasMarkdownLinks(text: string): boolean {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
  return linkRegex.test(text);
}