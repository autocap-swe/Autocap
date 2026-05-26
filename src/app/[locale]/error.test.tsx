import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './error';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('Error boundary page', () => {
  it('renders a headline', () => {
    render(<ErrorPage reset={jest.fn()} error={new Error('test')} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('renders a try-again button', () => {
    render(<ErrorPage reset={jest.fn()} error={new Error('test')} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls reset when the try-again button is clicked', () => {
    const reset = jest.fn();
    render(<ErrorPage reset={reset} error={new Error('test')} />);
    fireEvent.click(screen.getByRole('button'));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
