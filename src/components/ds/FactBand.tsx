import { Container } from './Container';

export interface Fact {
  value: string;
  /** Unit text beside the figure; use \n for a second line. */
  unit: string;
}

interface FactBandProps {
  facts: Fact[];
  /** Line under the figures, e.g. "Figures as of November 2026". */
  dateLine?: string;
  size?: 'xl' | 'lg';
}

/** Black band of figures with the unit beside each figure. Figures are plain HTML, no counters. */
export function FactBand({ facts, dateLine, size = 'xl' }: FactBandProps) {
  const figureClass = size === 'xl' ? 't-figure-xl' : 't-figure-lg';
  return (
    <section className="bg-ink text-white">
      <Container className="py-12 lg:py-16">
        <dl className="m-0 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          {facts.map(fact => (
            <div key={`${fact.value}-${fact.unit}`} className="flex items-baseline gap-3.5">
              <dt className="t-meta order-2 whitespace-pre-line border-l border-rule-dark-2 pl-3.5 text-on-dark-2">
                {fact.unit}
              </dt>
              <dd className={`${figureClass} order-1 m-0`}>{fact.value}</dd>
            </div>
          ))}
        </dl>
        {dateLine && (
          <p className="mt-8 mb-0 text-xs uppercase tracking-[0.06em] text-text-3">{dateLine}</p>
        )}
      </Container>
    </section>
  );
}
