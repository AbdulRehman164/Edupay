import UploadResultPanel from './UploadResultPanel';
import { useState } from 'react';
function BatchUploadButton({ fetchStudents, batchId }) {
    const [fileError, setFileError] = useState(null);
    const [uploadRes, setUploadRes] = useState(null);

    async function handleFileUpload(e) {
        setFileError(null);
        try {
            const ext = e.target.files[0]?.name.split('.').pop();
            if (ext !== 'xls' && ext !== 'xlsx') {
                throw new Error(
                    'Please select a valid Excel file (.xls, .xlsx)',
                );
            }
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            const res = await fetch(
                `/api/accounts/batches/${batchId}/students/upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Something went wrong');
            }
            const json = await res.json();
            setUploadRes(json);
            await fetchStudents();
        } catch (e) {
            setFileError(e.message);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 pt-8">
            {fileError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
                    {fileError}
                </div>
            )}
            {uploadRes && (
                <UploadResultPanel
                    result={uploadRes}
                    onDismiss={() => setUploadRes(null)}
                />
            )}
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition mb-4">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                </svg>
                Upload student list
                <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                />
            </label>
        </div>
    );
}

export default BatchUploadButton;
