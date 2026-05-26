import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

export function CmsRichText({ content }: { content: BlocksContent }) {
  return <BlocksRenderer content={content} />;
}
