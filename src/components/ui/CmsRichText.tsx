'use client';

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

export function CmsRichText({ content }: { content: BlocksContent }) {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
        quote: ({ children }) => (
          <blockquote className="my-8 border-l-4 border-[#C8102E] pl-6 text-xl italic font-medium text-[#1C1C1E] leading-relaxed">
            {children}
          </blockquote>
        ),
      }}
    />
  );
}
