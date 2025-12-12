import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AllScholarships from './pages/AllScholarships';
import ScholarshipDetails from './pages/ScholarshipDetails';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import AddScholarship from './pages/AddScholarship';
import ManageScholarships from './pages/ManageScholarships';
import ManageUsers from './pages/ManageUsers';
import Analytics from './pages/Analytics';
import ManageApplications from './pages/ManageApplications';
import MyApplications from './pages/Dashboard/MyApplications';
import MyWishlist from './pages/Dashboard/MyWishlist';
import MyReviews from './pages/Dashboard/MyReviews';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/scholarships',
        element: <AllScholarships />,
      },
      {
        path: '/scholarship/:id',
        element: <ScholarshipDetails />,
      },
      {
        path: '/checkout/:id',
        element: <Checkout />,
      },
      {
        path: '/payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: '/payment-failure',
        element: <PaymentFailure />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/my-profile" replace />,
      },
      {
        path: 'my-profile',
        element: <MyProfile />,
      },
      {
        path: 'add-scholarship',
        element: <AddScholarship />,
      },
      {
        path: 'manage-scholarships',
        element: <ManageScholarships />,
      },
      {
        path: 'manage-users',
        element: <ManageUsers />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'manage-applications',
        element: <ManageApplications />,
      },
      {
        path: 'my-applications',
        element: <MyApplications />,
      },
      {
        path: 'my-wishlist',
        element: <MyWishlist />,
      },
      {
        path: 'my-reviews',
        element: <MyReviews />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <div data-theme="mytheme" className="min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
