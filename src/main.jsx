import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Settings from './Pages/Settings.jsx'
import { PopupContextProvider } from './Contexts/PopupContext.jsx'

const isProd = import.meta.env.PROD 


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Error</div>,

    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/settings',
        element: <Settings/>
      }
    ]
    
  }
],isProd ? { basename: '/index.html' } : undefined)

createRoot(document.getElementById('root')).render(
  <PopupContextProvider>
    <RouterProvider router={router}/>
  </PopupContextProvider>
)
