import SkeletonRow from './SkeletonRow';
import { ChevronLeft, ChevronRight, Pencil, UserIcon } from 'lucide-react';
import Avatar from '../../../ui/Avatar';
import { Link } from 'react-router';
import { useOutletContext } from 'react-router';

function EmployeesTable({ paginationData }) {
    const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const handleNext = () =>
        setCurrentPage((p) => Math.min(p + 1, paginationData.totalPages));
    const [currentPage, setCurrentPage] = useOutletContext();

    const { employees, isLoading, totalPages } = paginationData;
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-100 bg-gray-50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Employee
                        </th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            CNIC
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))
                    ) : employees.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="py-14 text-center text-sm text-slate-400"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <UserIcon />
                                    No employees found on this page.
                                </div>
                            </td>
                        </tr>
                    ) : (
                        employees.map((emp) => (
                            <tr
                                key={emp.id}
                                className="group border-b border-slate-50"
                            >
                                <td className="px-5 py-3.5 group-hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            name={emp.name}
                                            dynamicColor={true}
                                        />
                                        <div>
                                            <p className="font-medium text-slate-800 leading-tight">
                                                {emp.name}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 font-mono text-xs text-slate-500 group-hover:bg-slate-50">
                                    {emp.cnic_no}
                                </td>
                                <td className="px-5 py-3.5 text-right group-hover:bg-slate-50">
                                    <Link
                                        to={`/hr/employees/${emp.cnic_no}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 border border-teal-200 rounded-lg px-2.5 py-1 transition-colors duration-150 hover:bg-teal-50"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination footer */}
            {!isLoading && employees.length > 0 && (
                <div className="px-5 py-3.5 flex items-center justify-between border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        Page{' '}
                        <span className="font-medium text-slate-600">
                            {currentPage}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium text-slate-600">
                            {totalPages}
                        </span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="inline-flex items-center gap-1.5 border border-gray-200 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-gray-700 bg-white cursor-pointer transition-colors duration-150 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={handlePrev}
                            disabled={!hasPrev}
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </button>
                        <button
                            className="inline-flex items-center gap-1.5 border border-gray-200 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-gray-700 bg-white cursor-pointer transition-colors duration-150 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={handleNext}
                            disabled={!hasNext}
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeesTable;
