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
  Admin,
} from './pages';

// Actions and loaders
import { action as registerAction } from './pages/register';
import { action as loginAction } from './pages/login';
import { loader as loginLoader } from './pages/login'; // Import loader for login
import { loader as dashboardLoader } from './pages/dashboard';
import { loader as aboutusLoader } from './pages/aboutus';
import { loader as menuLoader } from './pages/menu';
import { loader as settingsLoader } from './pages/settings';
import { loader as adminDashboardLoader } from './pages/admin';

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
    loader: loginLoader,  // Use the imported loader for login
    errorElement: <Error />,
  },
  {
    path: '/admin',
    element: <Admin />,
    loader: adminDashboardLoader,
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
    loader: menuLoader,
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
    loader: settingsLoader,
    errorElement: <Error />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
