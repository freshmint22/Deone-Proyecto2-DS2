import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './styles/global.css';
// App-specific dark theme (scoped to .app-shell)
import './styles/app-theme.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<AuthProvider>
		<CartProvider>
			<App />
		</CartProvider>
	</AuthProvider>
);
