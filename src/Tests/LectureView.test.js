import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import LectureView from '../views/LectureView';
import UserContext from '../components/UserContext';

// Mock axios
jest.mock('axios');

describe('LectureView', () => {
  it('renders the lecture content when provided with a lectureId', async () => {
    // Mock implementation of axios.get
    axios.get.mockResolvedValue({ data: 'Mocked Lecture Content' });

    // Render the component with a specific lectureId
    const { findByText } = render(
      <UserContext.Provider value={{ user: { id: '123', role: 'student' } }}>
        <LectureView lectureId="1" />
      </UserContext.Provider>
    );

    // Check if the mocked lecture content is rendered
    const content = await findByText('Mocked Lecture Content');
    expect(content).toBeInTheDocument();
  });

  // Additional tests can be added here
});
