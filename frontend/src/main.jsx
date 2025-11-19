import { StrictMode } from 'react' 
import { createRoot } from 'react-dom/client' 
import App from './App.jsx' 
import { BrowserRouter } from 'react-router-dom';
// browser router will ensure full page reloads dont happen 
// and keep it as a single page application (SPA)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter> 
  </StrictMode>,
)