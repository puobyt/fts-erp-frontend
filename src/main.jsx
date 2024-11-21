import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import CircularProgress from '@mui/material/CircularProgress';
import App from './app';
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import './global.css'
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
const CenteredFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Full viewport height
    }}
  >
    <CircularProgress />
  </div>
);
root.render(
  <StrictMode>
    <HelmetProvider>
      <NextUIProvider>
        <BrowserRouter>
          {/* Add a fallback for Suspense */}
          <Suspense fallback={<CenteredFallback/>}>
            <App />
          </Suspense>
        </BrowserRouter>
      </NextUIProvider>
    </HelmetProvider>
  </StrictMode>
);
