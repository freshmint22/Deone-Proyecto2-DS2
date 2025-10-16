/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../src/pages/Login';

test('muestra error si faltan campos', async ()=>{
  render(<Login />);
  fireEvent.click(screen.getByText(/Entrar/i));
  expect(await screen.findByText(/Completa email y contraseña/i)).toBeInTheDocument();
});

// Nota: tests de éxito deben mockear servicios y contexto; agregar cuando se instalen librerías de test.
