import { Container } from './Container';

export interface Quote {
  id: number | string;
  text: string;
  name: string;
  /** Workshop, city and date line under the name. */
  meta: string;
}

/** Owner quotes in full length, columns divided by rules. */
export function Quotes({ quotes, title }: { quotes: Quote[]; title: string }) {
  if (quotes.length === 0) return null;
  return (
    <section className="border-b border-rule bg-white text-ink" aria-label={title}>
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {quotes.map((quote, index) => (
            <figure
              key={quote.id}
              className={`m-0 flex flex-col justify-between gap-[18px] py-8 first:pt-0 last:pb-0 lg:py-0 ${
                index > 0 ? 'border-t border-rule lg:border-l lg:border-t-0 lg:pl-9' : ''
              } ${index < quotes.length - 1 ? 'lg:pr-9' : ''}`}
            >
              <blockquote className="m-0 text-[17px] font-light leading-[1.55]">“{quote.text}”</blockquote>
              <figcaption className="border-t border-rule pt-3.5 text-sm text-text-2">
                <strong className="font-semibold text-ink">{quote.name}</strong>
                <br />
                {quote.meta}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
