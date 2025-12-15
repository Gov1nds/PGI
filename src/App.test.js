import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Padanilathu brand name', () => {
  render(<App />);
  const brandElement = screen.getByText(/padanilathu/i);
  expect(brandElement).toBeInTheDocument();
});
