'use client';

import { useEffect } from 'react';
import { useLocalizedPaths } from '@/contexts/localizedPathContext';

interface ArticleLocalizedPathSetterProps {
  localizedSlugs: Record<string, string>;
  basePath: string;
}

export function ArticleLocalizedPathSetter({
  localizedSlugs,
  basePath,
}: ArticleLocalizedPathSetterProps) {
  const { setPaths, clearPaths } = useLocalizedPaths();

  useEffect(() => {
    const paths: Record<string, string> = {};
    for (const [locale, slug] of Object.entries(localizedSlugs)) {
      paths[locale] = `${basePath}/${slug}`;
    }
    setPaths(paths);
    return clearPaths;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
