import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import BedDetailPage from '@/components/pages/BedDetailPage';
import HospitalsPage from '@/components/pages/HospitalsPage';
import HospitalDetailPage from '@/components/pages/HospitalDetailPage';
import BookingPage from '@/components/pages/BookingPage';
import MyBookingsPage from '@/components/pages/MyBookingsPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "bed/:id",
        element: <BedDetailPage />,
        routeMetadata: {
          pageIdentifier: 'bed-detail',
        },
      },
      {
        path: "hospitals",
        element: <HospitalsPage />,
        routeMetadata: {
          pageIdentifier: 'hospitals',
        },
      },
      {
        path: "hospital/:id",
        element: <HospitalDetailPage />,
        routeMetadata: {
          pageIdentifier: 'hospital-detail',
        },
      },
      {
        path: "book/:bedId",
        element: <BookingPage />,
        routeMetadata: {
          pageIdentifier: 'booking',
        },
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
        routeMetadata: {
          pageIdentifier: 'my-bookings',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
