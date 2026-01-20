import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import SuccessPopup from './SuccessPopup';

const Employees = () => {
    const [file, setFile] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paginationData, setPaginationData] = useState({
        employees: [],
        page: 1,
        totalPages: 1,
        isLoading: false,
    });
    const [fileUploadError, setFileUploadError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        (async () => {
            const res = await fetch(
                `http://localhost:3000/api/employees?page=${currentPage}`,
                {
                    method: 'GET',
                },
            );
            const json = await res.json();
            setPaginationData({ ...json, isLoading: false });
        })();
    }, [currentPage]);
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async function () {
            try {
                const res = await fetch(
                    'http://localhost:3000/api/upload/employeefile',
                    {
                        method: 'POST',
                        body: formData,
                    },
                );
                const json = await res.json();
                console.log(json);
                if (!res.ok) {
                    setFileUploadError(json.error || 'Server Error');
                } else {
                    setFileUploadError('');
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            } catch {
                setFileUploadError(
                    'Cannot reach the server. Check your internet or try again later.',
                );
            }
        })();
    }, [file]);
    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () =>
        setCurrentPage((prev) =>
            Math.min(prev + 1, paginationData?.totalPages),
        );

    const handleFileInputChange = (e) => {
        const ext = e.target.files[0].name.split('.').pop();
        if (ext !== 'xls' && ext !== 'xlsx') {
            setFileUploadError(
                'Please select a valid Excel file (.xls, .xlsx)',
            );
            return;
        }
        setFile(e.target.files[0]);
    };

    return (
        <div className="mx-auto mt-10 max-w-4xl rounded-xl border bg-white p-6 shadow-sm">
            {/* Success Popup */}
            <SuccessPopup
                show={showSuccess}
                message="Uploaded successfully"
                onClose={() => setShowSuccess(false)}
            />

            {/* File Upload */}
            <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Excel File
                </label>
                <div>
                    <input
                        type="file"
                        onChange={handleFileInputChange}
                        className="block w-full cursor-pointer rounded-md border border-gray-300
                 text-sm file:mr-4 file:rounded-md file:border-0
                 file:bg-teal-500 file:px-4 file:py-2
                 file:text-white hover:file:bg-teal-600"
                    />
                    {fileUploadError && (
                        <p className="text-red-500 text-sm">
                            {fileUploadError}
                        </p>
                    )}
                </div>
            </div>

            {/* Employee List */}
            <div className="divide-y rounded-lg border">
                {!paginationData.isLoading &&
                    paginationData.employees.map((employee) => (
                        <div
                            key={employee.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">
                                    {employee.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {employee.cnic_no}
                                </span>
                            </div>

                            <Link
                                to={`/employees/${employee.cnic_no}`}
                                className="text-sm font-semibold text-teal-600 hover:underline"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}

                {paginationData.isLoading && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        Loading employees…
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    className="rounded-md border px-4 py-2 text-sm
                 hover:bg-gray-100 disabled:opacity-50"
                >
                    Prev
                </button>

                <button
                    onClick={handleNext}
                    className="rounded-md border px-4 py-2 text-sm
                 hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Employees;
