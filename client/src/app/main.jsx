import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import AppLayout from '../layouts/AppLayout';
import HrDashboard from '../domains/hr/HrDashboard';
import Employees from '../domains/hr/Employees';
import EditEmployee from '../domains/hr/EditEmployee';
import Payslips from '../domains/hr/Payslips';
import EmployeePayslips from '../domains/hr/EmployeePayslips';
import Login from '../pages/Login';
import { AuthProvider } from '../auth/AuthContext';
import RequireAuth from '../auth/RequireAuth';
import PublicLayout from '../layouts/PublicLayout';
import RequireRole from '../auth/RequireRole';
import RedirectRole from '../auth/RedirectRole';
import AdminDashboard from '../domains/admin/AdminDashboard';

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
    {
        element: <RequireAuth />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <RedirectRole />,
                    },
                    {
                        path: '/hr',
                        element: <RequireRole roles={['hr']} />,
                        children: [
                            {
                                index: true,
                                element: <HrDashboard />,
                            },
                            {
                                path: 'employees',
                                element: <Employees />,
                            },
                            {
                                path: 'employees/:cnic',
                                element: <EditEmployee />,
                            },

                            {
                                path: 'payslips',
                                element: <Payslips />,
                            },

                            {
                                path: 'payslips/:cnic',
                                element: <EmployeePayslips />,
                            },
                        ],
                    },
                    {
                        path: '/admin',
                        element: <RequireRole roles={['admin']} />,
                        children: [
                            {
                                index: true,
                                element: <AdminDashboard />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
);
