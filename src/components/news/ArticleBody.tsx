import type { ArticleContentBlock } from '@/lib/cms/article/types';
import { ContentParagraph } from './content/ContentParagraph';
import { ContentHeading } from './content/ContentHeading';
import { ContentImage } from './content/ContentImage';
import { ContentQuote } from './content/ContentQuote';
import { ContentList } from './content/ContentList';
import { ContentCallout } from './content/ContentCallout';

interface ArticleBodyProps {
  content: ArticleContentBlock[];
}

export function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <article className="mx-auto max-w-3xl py-12">
      {content.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return <ContentParagraph key={index} content={block.content} />;
          case 'heading':
            return (
              <ContentHeading
                key={index}
                level={block.level}
                content={block.content}
                id={block.id}
              />
            );
          case 'image':
            return (
              <ContentImage
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                credit={block.credit}
              />
            );
          case 'quote':
            return (
              <ContentQuote
                key={index}
                content={block.content}
                attribution={block.attribution}
                role={block.role}
              />
            );
          case 'list':
            return <ContentList key={index} style={block.style} items={block.items} />;
          case 'callout':
            return <ContentCallout key={index} variant={block.variant} content={block.content} />;
          default:
            return null;
        }
      })}
    </article>
  );
}
