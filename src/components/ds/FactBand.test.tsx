import { render, screen } from '@testing-library/react';
import { FactBand } from './FactBand';

describe('FactBand (AC-DS3)', () => {
  it('renders each figure as plain text with its unit beside it', () => {
    render(
      <FactBand
        facts={[
          { value: '13', unit: 'Workshops\nin Sweden' },
          { value: '~50', unit: 'People\nin the group' },
        ]}
        dateLine="Figures as of November 2026"
      />
    );
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText('~50')).toBeInTheDocument();
    expect(screen.getByText(/Workshops/)).toBeInTheDocument();
    expect(screen.getByText('Figures as of November 2026')).toBeInTheDocument();
  });

  it('pairs each figure with its unit in a description list', () => {
    const { container } = render(<FactBand facts={[{ value: '7', unit: 'Companies' }]} />);
    expect(container.querySelector('dt')).toHaveTextContent('Companies');
    expect(container.querySelector('dd')).toHaveTextContent('7');
  });
});
