/*import React from 'react';
import { render } from '@testing-library/react';
import Toolbar from '../views/ToolbarView';
import UserContext from '../components/UserContext';
import '@testing-library/jest-dom';

// Mock fetch y otros módulos necesarios
jest.mock('../controllers/QuizzesController', () => ({
  fetchQuizzes: jest.fn(() => Promise.resolve([])),
}));

// Mock global de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Puedes ajustar esto para simular diferentes respuestas
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('Toolbar', () => {
  it('muestra controles de profesor para usuarios con rol de profesor', async () => {
    const user = { id: '123', name: 'Profesor', role: 'professor' };

    const { findByText } = render(
      <UserContext.Provider value={{ user }}>
        <Toolbar />
      </UserContext.Provider>
    );

    const welcomeText = await findByText(`Bienvenido, profesor ${user.name}`);
    expect(welcomeText).toBeInTheDocument();
    // Agrega más expectativas según los elementos específicos de la UI para profesores
  });

  it('muestra controles de estudiante para usuarios con rol de estudiante', async () => {
    const user = { name: 'Estudiante', role: 'student' };

    const { findByText } = render(
      <UserContext.Provider value={{ user }}>
        <Toolbar />
      </UserContext.Provider>
    );

    const welcomeText = await findByText('Bienvenido, Estudiante');
    expect(welcomeText).toBeInTheDocument();
    // Agrega más expectativas según los elementos específicos de la UI para estudiantes
  });

  // Agrega más pruebas según sea necesario
});
*/