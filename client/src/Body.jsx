import { useState, useEffect, useRef } from 'react';
import SuccessPopup from './SuccessPopup';

const Body = () => {
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadRes, setUploadRes] = useState({
        uploadId: null,
        isLoading: false,
    });
    const [jobId, setJobId] = useState(null);
    const prevJobIdRef = useRef();
    const [jobStatus, setJobStatus] = useState('');
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async function () {
            const res = await fetch(
                'http://localhost:3000/api/upload/payslipfile',
                {
                    method: 'POST',
                    body: formData,
                },
            );
            const json = await res.json();
            if (res.ok) {
                setFileError('');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setFileError(json.error);
            }
            setUploadRes({ uploadId: json.uploadId, isLoading: false });
        })();
    }, [file]);
    useEffect(() => {
        if (!jobId) return;
        if (jobStatus === 'completed' && prevJobIdRef.current === jobId) return;
        prevJobIdRef.current = jobId;
        const inetervalId = setInterval(async () => {
            const res = await fetch(
                `http://localhost:3000/api/job-status/${jobId}`,
            );
            const json = await res.json();
            setJobStatus(json.state);
        }, 1000);

        return () => {
            clearInterval(inetervalId);
        };
    }, [jobId, jobStatus]);
    return (
        <div className="mx-auto my-8 max-w-5xl rounded-xl border bg-white p-6 shadow-sm">
            {/* Success Popup */}
            <SuccessPopup
                show={showSuccess}
                message="Uploaded successfully"
                onClose={() => setShowSuccess(false)}
            />

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {/* File Upload */}
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Upload Excel File
                    </label>

                    <input
                        type="file"
                        className="
          block w-full text-sm text-gray-700
          file:mr-4 file:rounded-lg file:border-0
          file:bg-teal-500 file:px-4 file:py-2
          file:text-sm file:font-semibold file:text-white
          hover:file:bg-teal-600
          focus:outline-none focus:ring-2 focus:ring-teal-400
          cursor-pointer
        "
                        onChange={(e) => {
                            const ext = e.target.files[0]?.name
                                .split('.')
                                .pop();
                            if (ext !== 'xls' && ext !== 'xlsx') {
                                setFileError(
                                    'Please select a valid Excel file (.xls, .xlsx)',
                                );
                                return;
                            }
                            setFile(e.target.files[0]);
                            setFileError('');
                            setUploadRes((prev) => ({
                                ...prev,
                                isLoading: true,
                            }));
                        }}
                    />

                    {fileError && (
                        <p className="mt-2 text-sm text-red-500">{fileError}</p>
                    )}
                </div>

                {/* Generate Button */}
                <div className="flex items-end">
                    <button
                        disabled={uploadRes.uploadId === null}
                        className="
          rounded-lg bg-teal-500 px-6 py-2 text-sm font-semibold text-white
          transition
          enabled:hover:bg-teal-600 enabled:active:scale-95
          disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60
        "
                        onClick={async () => {
                            const res = await fetch(
                                'http://localhost:3000/api/payslips/generate',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        type: 'upload',
                                        uploadId: uploadRes.uploadId,
                                    }),
                                },
                            );
                            const json = await res.json();
                            setJobId(json.jobId);
                        }}
                    >
                        Generate Payslips
                    </button>
                </div>
            </div>

            {/* Job Status */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                    Status:&nbsp;
                    <span
                        className={
                            jobStatus === 'completed'
                                ? 'text-green-600'
                                : jobStatus === 'failed'
                                  ? 'text-red-500'
                                  : 'text-gray-500'
                        }
                    >
                        {jobStatus || 'Idle'}
                    </span>
                </div>

                {jobStatus === 'completed' && (
                    <button
                        onClick={async () => {
                            const res = await fetch(
                                `http://localhost:3000/api/payslips/download/${uploadRes.uploadId}`,
                            );
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'payslips.zip';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="
          rounded-lg border border-teal-500 px-5 py-2 text-sm font-semibold
          text-teal-600 transition hover:bg-teal-50 active:scale-95
        "
                    >
                        Download ZIP
                    </button>
                )}
            </div>
        </div>
    );
};

export default Body;
