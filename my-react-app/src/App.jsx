import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'; // Import the global styles
import { Landing,
         Menu,
         Login,
         Register,
         AboutUs,
         Settings,
         Error,
         Dashboard,
 } from './pages';  


 import { action as registerAction } from './pages/register';
 import { action as loginAction } from './pages/login';
 

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,  
    //element: <Dashboard />,  
  },

  {
    path: '/error',
    element: <Error/>,
  },

  {
    path: '/login',
    element: <Login />,  
  },

  {
    path: '/dashboard',
    element: <Dashboard />,  
  },

  {
    path: '/register',
    element: <Register />,
    action:registerAction
  },

  {
    path: '/menu',
    element: <Menu />,  
    action:loginAction
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
