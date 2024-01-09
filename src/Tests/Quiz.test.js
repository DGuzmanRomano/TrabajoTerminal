import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line
import QuizModal from '../components/QuizModal';

describe('<QuizModal />', () => {
    it('renders the modal when open', () => {
        const { getByText } = render(<QuizModal isOpen={true} title="Quiz Title" onClose={jest.fn()} />);
        expect(getByText('Quiz Title')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { queryByText } = render(<QuizModal isOpen={false} title="Quiz Title" onClose={jest.fn()} />);
        expect(queryByText('Quiz Title')).not.toBeInTheDocument();
    });

    it('triggers onClose when close button is clicked', () => {
        const mockOnClose = jest.fn();
        const { getByRole } = render(<QuizModal isOpen={true} onClose={mockOnClose} />);
        fireEvent.click(getByRole('button'));
        expect(mockOnClose).toHaveBeenCalled();
    });
});
