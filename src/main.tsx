import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TransactionProvider } from '@/src/context/TransactionContext';
import { EmployeeProvider } from '@/src/context/EmployeeContext';
import { SalesProvider } from '@/src/context/SalesContext';
import { ProductionProvider } from '@/src/context/ProductionContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TransactionProvider>
      <EmployeeProvider>
        <SalesProvider>
          <ProductionProvider>
            <App />
          </ProductionProvider>
        </SalesProvider>
      </EmployeeProvider>
    </TransactionProvider>
  </React.StrictMode>
);