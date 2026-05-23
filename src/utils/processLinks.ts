/**
 * Process HTML content to make links clickable and open in new tabs
 * @param htmlContent - The HTML content string
 * @returns Processed HTML string with links configured to open in new tabs
 */
export function processLinksInContent(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Replace anchor tags to add target="_blank" and rel="noopener noreferrer"
  const processedContent = htmlContent.replace(
    /<a\s+([^>]*?)>/gi,
    (match, attributes) => {
      // Check if target attribute already exists
      const hasTarget = /target\s*=/i.test(attributes);
      const hasRel = /rel\s*=/i.test(attributes);
      
      let newAttributes = attributes;
      
      if (!hasTarget) {
        newAttributes += ' target="_blank"';
      }
      
      if (!hasRel) {
        newAttributes += ' rel="noopener noreferrer"';
      } else {
        // Ensure noopener noreferrer is included in existing rel
        newAttributes = newAttributes.replace(
          /rel\s*=\s*["']([^"']*)["']/i,
          (relMatch, relValue) => {
            const relValues = relValue.split(/\s+/);
            if (!relValues.includes('noopener')) relValues.push('noopener');
            if (!relValues.includes('noreferrer')) relValues.push('noreferrer');
            return `rel="${relValues.join(' ')}"`;
          }
        );
      }
      
      return `<a ${newAttributes}>`;
    }
  );
  
  return processedContent;
}
