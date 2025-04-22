import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'; // Import the global styles
import { Dashboard,
         Menu,
         Login,
         Register,
         AboutUs,
         Settings,
 } from './pages';  

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,  
  },

  {
    path: '/login',
    element: <Login />,  
  },

  {
    path: '/register',
    element: <Register />,
  },

  {
    path: '/menu',
    element: <Menu />,  
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
