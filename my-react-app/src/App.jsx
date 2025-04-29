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
  Checkout,
  Payment,
  OrderHistory,
} from './pages';

// Actions and loaders
import { action as registerAction } from './pages/register';
import { action as loginAction } from './pages/login';
import { loader as dashboardLoader } from './pages/dashboard';
import { loader as aboutusLoader } from './pages/aboutus';


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
    path: '/register',
    element: <Register />,
    action: registerAction,
    errorElement: <Error />,
  },
  
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
    errorElement: <Error />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: dashboardLoader,
    errorElement: <Error />,
  },
  {
    path: '/menu',
    element: <Menu />,
    errorElement: <Error />,
  },
  {
    path: '/checkout', 
    element: <Checkout />,
    errorElement: <Error />,
  },
  {
    path: '/payment',
    element: <Payment />,
    errorElement: <Error />,
  },
  {
    path: '/orderHistory', 
    element: <OrderHistory />,
    errorElement: <Error />,
  },
  {
    path: '/aboutus',
    element: <AboutUs />,
    loader: aboutusLoader,
    errorElement: <Error />,
  },
  {
    path: '/settings',
    element: <Settings />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
