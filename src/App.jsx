import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AllScholarships from './pages/AllScholarships';
import ScholarshipDetails from './pages/ScholarshipDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import AddScholarship from './pages/AddScholarship';
import ManageScholarships from './pages/ManageScholarships';
import ManageUsers from './pages/ManageUsers';
import Analytics from './pages/Analytics';
import ErrorPage from './pages/ErrorPage';

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
    ],
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
