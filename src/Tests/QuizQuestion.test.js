import React from 'react';
import { render, waitFor, fireEvent, screen  } from '@testing-library/react';
import Quiz from '../components/Quiz';
import '@testing-library/jest-dom'; 
import axios from 'axios';
jest.mock('axios');

jest.mock('../models/QuizModel', () => ({
    fetchQuizData: jest.fn().mockResolvedValue([
        // Mock quiz data
        { id: 1, question_text: 'Question 1', options: [{ option_text: 'Option 1' }, { option_text: 'Option 2' }] },
        { id: 2, question_text: 'Question 2', options: [{ option_text: 'Option 1' }, { option_text: 'Option 2' }] },
        // ... other questions
    ])
}));


describe('<Quiz />', () => {
    it('renderiza la primera pregunta correctamente', async () => {
        const { getByText } = render(<Quiz quizId={1} />);
        await waitFor(() => {
            expect(getByText('Question 1')).toBeInTheDocument();
        });
    });

    it('actualiza el estado al hacer clic en una opción', async () => {
        const { getByText } = render(<Quiz quizId={1} />);
        await waitFor(() => {
            fireEvent.click(getByText('Option 1'));
           
        });
    });

   
  it('navega a la siguiente pregunta al hacer clic en el botón "Siguiente"', async () => {
        const { getByText } = render(<Quiz quizId={1} />);
        await waitFor(() => {
            fireEvent.click(getByText('Siguiente'));
            expect(getByText('Question 2')).toBeInTheDocument();
        });
    });


    it('envía las respuestas al hacer clic en "Enviar respuestas"', async () => {
        const { getByText } = render(<Quiz quizId={1} />);
      
        // Espera a que se cargue la primera pregunta para iniciar la navegación
        await waitFor(() => expect(getByText('Question 1')).toBeInTheDocument());
      
        // Navegar a la última pregunta
        let nextButton;
        while ((nextButton = screen.queryByText('Siguiente'))) {
          fireEvent.click(nextButton);
          await waitFor(() => {}); // Espera a que se complete la actualización del estado
        }
      
        // Comprobación de depuración - eliminar o comentar en la versión final de la prueba
        console.log(document.body.innerHTML);
      
        // Hacer clic en "Enviar respuestas"
        fireEvent.click(screen.getByText('Enviar respuestas'));
        expect(await screen.findByText('Resultados:')).toBeInTheDocument();
      });
      
});