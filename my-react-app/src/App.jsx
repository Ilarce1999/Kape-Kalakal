import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Pages
import {
  Landing,
  Menu,
  Login,
  Register,
  AboutUs,
  Settings,
  Error,
  Dashboard,
} from './pages';

// Actions and loaders
import { action as registerAction } from './pages/register';
import { action as loginAction } from './pages/login';
import { loader as dashboardLoader } from './pages/dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <Error />,  // Global error page
  },
  {
    path: '/error',
    element: <Error />,  // Error page for manual navigation to /error
  },
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
    errorElement: <Error />,  // Error page for this specific route
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: dashboardLoader,
    errorElement: <Error />,  // Error page for this specific route
  },
  {
    path: '/register',
    element: <Register />,
    action: registerAction,
    errorElement: <Error />,  // Error page for this specific route
  },
  {
    path: '/menu',
    element: <Menu />,
    errorElement: <Error />,  // Error page for this specific route
  },
  {
    path: '/aboutus',
    element: <AboutUs />,
    errorElement: <Error />,  // Error page for this specific route
  },
  {
    path: '/settings',
    element: <Settings />,
    errorElement: <Error />,  // Error page for this specific route
  },

]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
