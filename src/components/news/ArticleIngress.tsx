interface ArticleIngressProps {
  ingress: string;
}

/**
 * Lead paragraph ("ingress" in Swedish journalism) — a short, bold summary
 * shown between the article header and the main body.
 */
export function ArticleIngress({ ingress }: ArticleIngressProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <p className="whitespace-pre-line text-xl font-semibold leading-relaxed text-[#1C1C1E] sm:text-2xl">
        {ingress}
      </p>
    </div>
  );
}
