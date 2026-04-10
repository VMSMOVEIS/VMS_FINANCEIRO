import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TransactionProvider } from '@/src/context/TransactionContext';
import { EmployeeProvider } from '@/src/context/EmployeeContext';
import { SalesProvider } from '@/src/context/SalesContext';
import { ProductionProvider } from '@/src/context/ProductionContext';
import { PurchasingProvider } from '@/src/context/PurchasingContext';

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
          <PurchasingProvider>
            <ProductionProvider>
              <App />
            </ProductionProvider>
          </PurchasingProvider>
        </SalesProvider>
      </EmployeeProvider>
    </TransactionProvider>
  </React.StrictMode>
);