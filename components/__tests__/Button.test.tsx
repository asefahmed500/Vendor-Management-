import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is clickable when not disabled', () => {
    const { container } = render(<Button>Submit</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button).not.toBeDisabled();
  });
});
