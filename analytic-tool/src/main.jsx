import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledEngineProvider } from '@mui/material/styles';

import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
