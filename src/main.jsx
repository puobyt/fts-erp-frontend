import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import './global.css'
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <HelmetProvider>
      <NextUIProvider>
        <BrowserRouter>
          {/* Add a fallback for Suspense */}
          <Suspense fallback={<div>Loading...</div>}>
            <App />
          </Suspense>
        </BrowserRouter>
      </NextUIProvider>
    </HelmetProvider>
  </StrictMode>
);
