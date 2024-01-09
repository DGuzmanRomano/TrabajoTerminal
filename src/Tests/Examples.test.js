import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ExampleModal from '../components/ExampleModal';
import '@testing-library/jest-dom';

// Simulando el portapapeles y el editor Monaco
beforeEach(() => {
  global.navigator.clipboard = {
    writeText: jest.fn().mockResolvedValue(),
  };
});

jest.mock('@monaco-editor/react', () => () => <div data-testid="monaco-editor" />);

describe('<ExampleModal />', () => {

  it('renderiza el Editor Monaco', async () => {
    const { getByTestId } = render(<ExampleModal isOpen={true} content="Contenido de Prueba" onClose={jest.fn()} />);
    await waitFor(() => {
      expect(getByTestId('monaco-editor')).toBeInTheDocument();
    });
  });

  it('copia el contenido al portapapeles', async () => {
    const { getByText } = render(<ExampleModal isOpen={true} content="Contenido de Prueba" onClose={jest.fn()} />);
    fireEvent.click(getByText('Copiar'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Contenido de Prueba');
    await waitFor(() => getByText('Copiado al portapapeles!'));
  });

});
