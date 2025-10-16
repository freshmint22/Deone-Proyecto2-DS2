/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../src/pages/Register';

// Tests básicos: validaciones y envío
test('muestra error si email no es institucional', async ()=>{
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Nombre/i),{target:{value:'Juan'}});
  fireEvent.change(screen.getByLabelText(/Correo institucional/i),{target:{value:'juan@gmail.com'}});
  fireEvent.change(screen.getByLabelText(/Contraseña/i),{target:{value:'123456'}});
  fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i),{target:{value:'123456'}});
  fireEvent.click(screen.getByText(/Registrar/i));
  expect(await screen.findByText(/correo institucional/i)).toBeInTheDocument();
});

test('muestra error si contraseñas no coinciden', async ()=>{
  render(<Register />);
  fireEvent.change(screen.getByLabelText(/Nombre/i),{target:{value:'Juan'}});
  fireEvent.change(screen.getByLabelText(/Correo institucional/i),{target:{value:'juan@uni.edu.co'}});
  fireEvent.change(screen.getByLabelText(/Contraseña/i),{target:{value:'123456'}});
  fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i),{target:{value:'654321'}});
  fireEvent.click(screen.getByText(/Registrar/i));
  expect(await screen.findByText(/contraseñas no coinciden/i)).toBeInTheDocument();
});

// Nota: test de envío debería mockear fetch / servicio; ese caso se puede añadir cuando se configuren deps de test.
