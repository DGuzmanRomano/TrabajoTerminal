import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ExampleModal from '../components/ExampleModal';
import '@testing-library/jest-dom';


// Mocking the clipboard and Monaco editor
beforeEach(() => {
    global.navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(),
    };
  });
  

  jest.mock('@monaco-editor/react', () => () => <div data-testid="monaco-editor" />);


describe('<ExampleModal />', () => {

    it('renders the Monaco Editor', async () => {
        const { getByTestId } = render(<ExampleModal isOpen={true} content="Test Content" onClose={jest.fn()} />);
        await waitFor(() => {
            expect(getByTestId('monaco-editor')).toBeInTheDocument();
        });
    });

    it('copies content to clipboard', async () => {
        const { getByText } = render(<ExampleModal isOpen={true} content="Test Content" onClose={jest.fn()} />);
        fireEvent.click(getByText('Copiar'));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test Content');
        await waitFor(() => getByText('Copiado al portapapeles!'));
    });

    // More tests here...
});
