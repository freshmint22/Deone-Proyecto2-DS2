/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Checkout from '../src/pages/Checkout';
import { CartProvider } from '../src/context/CartContext';

// Mock createOrder
jest.mock('../src/services/api', ()=>({ createOrder: jest.fn(() => Promise.resolve({ id: 'ord_123' })) }));

test('checkout crea pedido y limpia carrito', async ()=>{
  // Render checkout con provider que ya tenga items
  const initialItems = [{ id:1, name:'Sandwich', price:5, qty:2 }];
  // mock localStorage de carrito
  localStorage.setItem('deone_cart', JSON.stringify(initialItems));

  render(
    <CartProvider>
      <Checkout />
    </CartProvider>
  );

  expect(await screen.findByText(/Sandwich/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Confirmar pedido/i));
  expect(await screen.findByText(/Pedido creado correctamente/i)).toBeInTheDocument();
  // carrito debe limpiarse
  expect(JSON.parse(localStorage.getItem('deone_cart')||'[]')).toEqual([]);
});
