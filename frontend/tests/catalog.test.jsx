/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Catalog from '../src/pages/Catalog';

// Mockear fetch para getProducts
beforeAll(()=>{
  global.fetch = jest.fn(() => Promise.resolve({ ok:true, json:() => Promise.resolve([
    { id:1, name:'Sandwich', category:'Comida', price:5 },
    { id:2, name:'Cafe', category:'Bebida', price:2 },
    { id:3, name:'Hamburguesa', category:'Comida', price:8 }
  ])}));
});

afterAll(()=>{ global.fetch.mockRestore(); });

test('renderiza productos y filtra por categoria', async ()=>{
  render(<Catalog />);
  expect(await screen.findByText(/Sandwich/i)).toBeInTheDocument();
  // seleccionar categoria 'Comida'
  fireEvent.change(screen.getByRole('combobox'),{target:{value:'Comida'}});
  expect(await screen.findByText(/Sandwich/i)).toBeInTheDocument();
  expect(screen.queryByText(/Cafe/i)).not.toBeInTheDocument();
});
