import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import App from './App.jsx';
import Body from './Body';
import Employees from './Employees';
import EditEmployee from './EditEmployee.jsx';
import Payslips from './Payslips.jsx';
import EmployeePayslips from './EmployeePayslips.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Body />,
            },
            {
                path: '/employees',
                element: <Employees />,
            },
            {
                path: '/employees/:cnic',
                element: <EditEmployee />,
            },

            {
                path: '/payslips',
                element: <Payslips />,
            },

            {
                path: '/payslips/:cnic',
                element: <EmployeePayslips />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
