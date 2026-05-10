import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import EmployeesHeader from './EmployeesHeader';
import EmployeesTable from './EmployeesTable';

const Employees = () => {
    const [paginationData, setPaginationData] = useState({
        employees: [],
        page: 1,
        totalPages: 1,
        isLoading: true,
    });
    const [currentPage] = useOutletContext();

    // fetch employees
    const fetchEmployees = async () => {
        setPaginationData((p) => ({ ...p, isLoading: true }));
        const res = await fetch(`/api/hr/employees?page=${currentPage}`);
        const json = await res.json();
        setPaginationData({ ...json, isLoading: false });
    };
    useEffect(() => {
        fetchEmployees();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-5">
                <EmployeesHeader
                    isLoading={paginationData.isLoading}
                    totalPages={paginationData.totalPages}
                    fetchEmployees={fetchEmployees}
                />
                <EmployeesTable paginationData={paginationData} />
            </div>
        </div>
    );
};

export default Employees;
