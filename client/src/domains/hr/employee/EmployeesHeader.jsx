import SuccessPopup from '../../../ui/SuccessPopup';
import { useState, useRef, useEffect } from 'react';
import { UploadIcon } from 'lucide-react';
import { useOutletContext } from 'react-router';
import { Spinner } from '../../../ui/Icons';

function EmployeesHeader({ isLoading, totalPages, fetchEmployees }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileUploadError, setFileUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();
    const [currentPage] = useOutletContext();

    // upload file
    useEffect(() => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        (async () => {
            try {
                const res = await fetch('/api/hr/uploads/employeefile', {
                    method: 'POST',
                    body: formData,
                });
                const json = await res.json();
                if (!res.ok) {
                    setFileUploadError(
                        json.error || 'Upload failed. Please try again.',
                    );
                } else {
                    setFileUploadError('');
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    fetchEmployees();
                }
            } catch {
                setFileUploadError(
                    'Cannot reach the server. Check your connection and try again.',
                );
            } finally {
                setIsUploading(false);
            }
        })();
    }, [file]);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        const ext = f?.name.split('.').pop();
        if (ext !== 'xls' && ext !== 'xlsx') {
            setFileUploadError(
                'Please select a valid Excel file (.xls or .xlsx).',
            );
            return;
        }
        setFileUploadError('');
        setFile(f);
    };
    return (
        <div className="flex items-center justify-between">
            <SuccessPopup
                show={showSuccess}
                message="Employees uploaded successfully"
                onClose={() => setShowSuccess(false)}
            />
            <div>
                <h1 className="text-base font-semibold text-slate-800">
                    Employees
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                    {isLoading
                        ? 'Loading…'
                        : `Page ${currentPage} of ${totalPages}`}
                </p>
            </div>

            {/* Upload zone */}
            <div>
                <div
                    className="border border-dashed border-gray-300 rounded-xl p-6 flex items-center gap-3 cursor-pointer transition-colors duration-200 hover:border-teal-700 hover:bg-teal-50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        {isUploading ? (
                            <Spinner />
                        ) : (
                            <UploadIcon className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            {isUploading
                                ? 'Uploading…'
                                : file
                                  ? file.name
                                  : 'Upload Excel'}
                        </p>
                        <p className="text-xs text-slate-400">.xls, .xlsx</p>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />
                {fileUploadError && (
                    <p className="mt-1.5 text-xs text-red-500">
                        {fileUploadError}
                    </p>
                )}
            </div>
        </div>
    );
}

export default EmployeesHeader;
