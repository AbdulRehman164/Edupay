import { useState } from 'react';
import { Outlet } from 'react-router';

export default function EmployeesLayout() {
    const [currentPage, setCurrentPage] = useState(1);

    return <Outlet context={[currentPage, setCurrentPage]} />;
}
