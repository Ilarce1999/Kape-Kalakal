import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Pages (excluding Login from this grouped import to avoid duplication)
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
} from './pages';

//import Users from './pages/admin/users';
import AllUsers from './pages/superadmin/allUsers';
import AddUser from './pages/superadmin/addUser';
import EditUser from './pages/superadmin/editUser';
import DeleteUser from './pages/superadmin/deleteUser';
import Products from './pages/superadmin/manageProducts';
import UpdateProduct from './pages/superadmin/updateProduct';
import DeleteProduct from './pages/superadmin/deleteProduct';

import AllOrders from './pages/admin/orders';
import AdminProducts from './pages/admin/products';


// ✅ Login imported separately with loader and action
import Login, { loader as loginLoader, action as loginAction } from './pages/login';

// Actions and loaders
import { action as registerAction } from './pages/register';
import { loader as dashboardLoader } from './pages/dashboard';
import { loader as aboutusLoader } from './pages/aboutus';
import { loader as menuLoader } from './pages/menu';
import { loader as settingsLoader } from './pages/settings';
import { loader as adminDashboardLoader } from './pages/admin';
import { loader as superAdminLoader } from './pages/superadmin';
import { loader as allUsersLoader } from './pages/superadmin/allUsers';


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
  {
    path: '/admin',
    element: <Admin />,
    loader: adminDashboardLoader,
    errorElement: <Error />,
  },
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
    //loader: allUsersLoader,
    errorElement: <Error />,
  },
  {
    path: '/superadmin/editUser/:userId',
    element: <EditUser />,
    // loader: allUsersLoader,
    errorElement: <Error />,
  },

  {
    path: '/superadmin/deleteUser/:userId',
    element: <DeleteUser />,
   // loader: allUsersLoader,
    errorElement: <Error />,
  },
  {
    path: '/superadmin/updateProduct/:id',
    element: <UpdateProduct />,
    // loader: allUsersLoader,
    errorElement: <Error />,
  },

  {
    path: '/superadmin/deleteProduct/:id',
    element: <DeleteProduct />,
   // loader: allUsersLoader,
    errorElement: <Error />,
  },
  {
    path: '/superadmin/manageProducts',
    element: <Products />,
   // loader: allUsersLoader,
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
