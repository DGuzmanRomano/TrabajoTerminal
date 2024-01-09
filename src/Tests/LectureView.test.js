import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import LectureView from '../views/LectureView';
import UserContext from '../components/UserContext';

// Simulación de axios
jest.mock('axios');

describe('LectureView', () => {
  it('renderiza el contenido de la lección cuando se proporciona un Id', async () => {
    // Implementación simulada de axios.get
    axios.get.mockResolvedValue({ data: 'Contenido de Leccion de prueba' });

    // Renderiza el componente con un lectureId específico
    const { findByText } = render(
      <UserContext.Provider value={{ user: { id: '123', role: 'estudiante' } }}>
        <LectureView lectureId="1" />
      </UserContext.Provider>
    );

    // Comprueba si se renderiza el contenido de la lección de prueba
    const content = await findByText('Contenido de Leccion de prueba');
    expect(content).toBeInTheDocument();
  });

});
