/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderTracker from '../src/pages/OrderTracker';

jest.mock('../src/services/api', ()=>({ getOrder: jest.fn((id) => Promise.resolve({ id, status: 'recibido' })) }));
jest.mock('../src/services/socket', ()=>({ connectSocket: jest.fn(()=>Promise.resolve({})), on: (ev,cb)=>{ if(ev==='orderStatusUpdated') setTimeout(()=>cb({ id:'123', status:'en preparación' }),50); }, off: jest.fn() }));

test('actualiza estado cuando llega event orderStatusUpdated', async ()=>{
  render(<OrderTracker />);
  const input = screen.getByPlaceholderText(/ID de pedido/i);
  fireEvent.change(input,{target:{value:'123'}});
  fireEvent.click(screen.getByText(/Buscar/i));
  expect(await screen.findByText(/recibido/i)).toBeInTheDocument();
  // espera el mock event
  expect(await screen.findByText(/en preparación/i)).toBeInTheDocument();
});
