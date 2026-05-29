import type { ReactNode } from 'react';

const URL_PATTERN = /https?:\/\/[^\s]+/g;

function renderWithLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  URL_PATTERN.lastIndex = 0;
  while ((match = URL_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#C8102E] hover:underline"
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

interface ContentParagraphProps {
  content: string;
}

export function ContentParagraph({ content }: ContentParagraphProps) {
  return <p className="mb-6 text-xl leading-relaxed text-gray-700">{renderWithLinks(content)}</p>;
}
