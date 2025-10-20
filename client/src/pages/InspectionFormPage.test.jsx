import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import InspectionFormPage from './InspectionFormPage';

// Mocks remain the same
vi.mock('react-router-dom', () => ({
  useParams: () => ({ farmId: '1' }),
  useNavigate: () => vi.fn(),
}));
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { farmId: 1, farmName: 'Test Farm' } })),
    post: vi.fn(() => Promise.resolve()),
  },
}));

describe('InspectionFormPage', () => {
  // --- CHANGE 1: The test function is now 'async' ---
  test('submit button should be disabled until all questions are answered', async () => {
    render(<InspectionFormPage />);
    
    // --- CHANGE 2: Use 'findByRole' which waits for the element to appear ---
    // This pauses the test until the "Loading..." message is gone and the form is rendered.
    const submitButton = await screen.findByRole('button', { name: /submit inspection/i });
    
    // The rest of the test can now proceed, as we know the form is visible.
    const yesButtons = screen.getAllByRole('button', { name: 'Yes' });
    
    // Initially, the button should be disabled
    expect(submitButton).toBeDisabled();
    
    // Click all but one "Yes" button
    for (let i = 0; i < yesButtons.length - 1; i++) {
      fireEvent.click(yesButtons[i]);
      expect(submitButton).toBeDisabled();
    }
    
    // Click the final "Yes" button
    fireEvent.click(yesButtons[yesButtons.length - 1]);
    
    // Now, the submit button should be enabled
    expect(submitButton).not.toBeDisabled();
  });
});