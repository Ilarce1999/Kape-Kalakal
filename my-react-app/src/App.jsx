import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'; // Import the global styles
import { Landing, Menu, Login, Register, AboutUs, Settings, Error, Dashboard } from './pages';  

import { action as registerAction } from './pages/register';
import { action as loginAction } from './pages/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,  
  },

  {
    path: '/error',
    element: <Error />, 
  },

  {
    path: '/login',
    element: <Login />,  
    action: loginAction,  // Ensure this handles the login logic
  },

  {
    path: '/dashboard',
    element: <Dashboard />,  
    // You could add a middleware here for authentication if needed
  },

  {
    path: '/register',
    element: <Register />,
    action: registerAction,  // Ensure this handles the registration logic
  },

  {
    path: '/menu',
    element: <Menu />,  
    // Ensure loginAction makes sense here
    action: loginAction, // Maybe this is used for when a user tries to access the menu
  },

  {
    path: '/aboutus',
    element: <AboutUs />,
  },

  {
    path: '/settings',
    element: <Settings />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
