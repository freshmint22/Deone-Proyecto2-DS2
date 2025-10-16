/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationBell from '../src/components/NotificationBell';

// Mock socket service: on will call callback immediately with sample order
jest.mock('../src/services/socket', ()=>({
  connectSocket: jest.fn(() => Promise.resolve({})),
  on: (ev,cb) => { if(ev === 'new_order') cb({ id:'ord_1', total: 10 }); },
  off: jest.fn()
}));

test('muestra alerta cuando llega nueva orden', async ()=>{
  render(<NotificationBell />);
  expect(await screen.findByText(/Nuevo pedido/i)).toBeInTheDocument();
});
