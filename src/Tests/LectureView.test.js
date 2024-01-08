import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import LectureView from '../views/LectureView';
import UserContext from '../components/UserContext';

// Datos de prueba
const mockLectures = [
  { lecture_id: '1', lecture_title: 'Lecture 1' },
  { lecture_id: '2', lecture_title: 'Lecture 2' },
];

// Simular fetch o cualquier módulo necesario
global.fetch = jest.fn((url) =>
  Promise.resolve({
    ok: true, // Asegúrate de agregar esto
    json: () => Promise.resolve(mockLectures),
  })
);


describe('LectureView', () => {
  it('renderiza las lecciones correctas según la selección del dropdown', async () => {
    // Renderizar el componente en el contexto del usuario
    const user = { id: '123', name: 'User', role: 'student' };
    const { getByText, getAllByRole, findByText } = render(
      <UserContext.Provider value={{ user }}>
        <LectureView />
      </UserContext.Provider>
    );

    // Simular la interacción con el dropdown
    fireEvent.click(getByText('Lecciones'));
    const options = getAllByRole('option');
    fireEvent.click(options[1]); // Seleccionar la segunda lección

    // Esperar a que se actualice el contenido y verificar
    const lectureContent = await findByText('Lecture 2');
    expect(lectureContent).toBeInTheDocument();
  });
});
