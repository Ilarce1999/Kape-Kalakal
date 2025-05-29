import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Pages
import {
  Landing,
  Menu,
  Register,
  AboutUs,
  Settings,
  Error,
  Dashboard,
  Checkout,
  Payment,
  OrderHistory,
  Admin,
  SuperAdmin,
  ViewMyOrder,
  Profile,
} from './pages';

import AllUsers from './pages/superadmin/allUsers';
import AddUser from './pages/superadmin/addUser';
import EditUser from './pages/superadmin/editUser';
import DeleteUser from './pages/superadmin/deleteUser';
import Products from './pages/superadmin/manageProducts';
import UpdateProduct from './pages/superadmin/updateProduct';
import DeleteProduct from './pages/superadmin/deleteProduct';

import AllOrders from './pages/admin/orders';
import AdminProducts from './pages/admin/products';

import Login, { loader as loginLoader, action as loginAction } from './pages/login';

import { action as registerAction } from './pages/register';
import { loader as dashboardLoader } from './pages/dashboard';
import { loader as aboutusLoader } from './pages/aboutus';
import { loader as viewMyOrder } from './pages/viewMyOrder';
import { loader as menuLoader } from './pages/menu';
import { loader as settingsLoader } from './pages/settings';
import { loader as adminDashboardLoader } from './pages/admin';
import { loader as superAdminLoader } from './pages/superadmin';
import { loader as allUsersLoader } from './pages/superadmin/allUsers';

import Layout from './components/Layout';
import AdminLayout from './pages/admin/AdminComponents/AdminLayout';
import SuperAdminLayout from './pages/superadmin/SuperadminComponents/SuperadminLayout';


// Shared layout loader
async function layoutLoader() {
  try {
    const response = await fetch('/api/auth/user');
    if (!response.ok) throw new Error('Failed to fetch user');
    const user = await response.json();
    return { user };
  } catch (error) {
    return { user: null };
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    path: '/error',
    element: <Error />,
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
    loader: loginLoader,
    action: loginAction,
    errorElement: <Error />,
  },

  // ✅ AdminLayout with children
  {
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: <Admin />,
        loader: adminDashboardLoader,
        errorElement: <Error />,
      },
      {
        path: '/admin/orders',
        element: <AllOrders />,
        errorElement: <Error />,
      },
      {
        path: '/admin/products',
        element: <AdminProducts />,
        errorElement: <Error />,
      },
    ],
  },

  {
    element: <SuperAdminLayout />,
    children: [
      {
        path: '/superadmin',
        element: <SuperAdmin />,
        loader: superAdminLoader,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/allUsers',
        element: <AllUsers />,
        loader: allUsersLoader,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/addUser',
        element: <AddUser />,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/editUser/:userId',
        element: <EditUser />,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/deleteUser/:userId',
        element: <DeleteUser />,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/manageProducts',
        element: <Products />,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/updateProduct/:id',
        element: <UpdateProduct />,
        errorElement: <Error />,
      },
      {
        path: '/superadmin/deleteProduct/:id',
        element: <DeleteProduct />,
        errorElement: <Error />,
      },
    ],
  },

  // Others
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
    path: '/profile',
    element: <Profile />,
    errorElement: <Error />,
  },

  // Main user pages wrapped in Layout
  {
    element: <Layout />,
    loader: layoutLoader,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: dashboardLoader,
        errorElement: <Error />,
      },
      {
        path: '/aboutus',
        element: <AboutUs />,
        loader: aboutusLoader,
        errorElement: <Error />,
      },
      {
        path: '/viewMyOrder',
        element: <ViewMyOrder />,
        loader: viewMyOrder,
        errorElement: <Error />,
      },
      {
        path: '/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: '/settings',
        element: <Settings />,
        loader: settingsLoader,
        errorElement: <Error />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
