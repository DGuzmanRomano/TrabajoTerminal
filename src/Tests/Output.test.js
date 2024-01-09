import React from 'react';
import { render } from '@testing-library/react';
import OutputPanel from '../views/OutputPanelView';
import '@testing-library/jest-dom'; 

it('renders output correctly', () => {
    const { getByText } = render(<OutputPanel output="Test Output" />);
    expect(getByText('Test Output')).toBeInTheDocument();
});
