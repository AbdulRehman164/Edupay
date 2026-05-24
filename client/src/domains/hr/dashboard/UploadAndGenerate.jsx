import { UploadIcon, DownloadIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Spinner } from '../../../ui/Icons';
import SuccessPopup from '../../../ui/SuccessPopup';
import StatusBadge from './StatusBridge';

function UploadAndGenerate({ handleDownload }) {
    const fileInputRef = useRef();
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [generateError, setGenerateError] = useState('');
    const [uploadRes, setUploadRes] = useState({
        batchId: null,
        isLoading: false,
    });
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState('');
    const [downloadId, setDownloadId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [emailState, setEmailState] = useState({
        loading: false,
        error: '',
        status: null,
    });

    // Use a ref so the polling callback always reads the latest downloadId
    const downloadIdRef = useRef(downloadId);
    useEffect(() => {
        downloadIdRef.current = downloadId;
    }, [downloadId]);

    const handleRetryFailed = async (batchId) => {
        setEmailState((prev) => ({ ...prev, loading: true, error: '' })); // ✅ preserve status
        const res = await fetch(`/api/hr/emails/${batchId}/retry`, {
            method: 'POST',
        });
        const json = await res.json();
        if (!res.ok) {
            setEmailState((prev) => ({
                ...prev,
                loading: false,
                error: json.message,
            })); // ✅ preserve status
            return;
        }
        pollEmailSendStatus(batchId);
    };

    const handleSendEmails = async (batchId) => {
        setEmailState((prev) => ({ ...prev, loading: true, error: '' })); // ✅ preserve status
        const res = await fetch(`/api/hr/emails/${batchId}/send`, {
            method: 'POST',
        });
        const json = await res.json();
        if (!res.ok) {
            setEmailState((prev) => ({
                ...prev,
                loading: false,
                error: json.message,
            })); // ✅ preserve status
            return;
        }
        pollEmailSendStatus(batchId);
    };

    const pollEmailSendStatus = (batchId) => {
        const id = setInterval(async () => {
            const statusRes = await fetch(`/api/hr/emails/${batchId}/status`);
            const statusJson = await statusRes.json();
            if (!statusRes.ok) {
                clearInterval(id);
                setEmailState({
                    loading: false,
                    error: statusJson.message,
                    status: null,
                });
                return;
            }
            setEmailState({
                loading: statusJson.pending > 0,
                error: '',
                status: statusJson,
            });
            if (statusJson.pending === 0) clearInterval(id);
        }, 1000);
        return id;
    };

    const handleCancel = async () => {
        if (!window.confirm('Cancel the running job?')) return;
        await fetch(`/api/hr/jobs/cancel/${jobId}`, {
            method: 'DELETE',
        });
        setJobStatus('');
        setJobId(null);
    };

    const handleGenerate = async () => {
        const res = await fetch('/api/hr/payslips/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'upload',
                batchId: uploadRes.batchId,
            }),
        });
        const json = await res.json();
        if (res.ok) {
            setJobId(json.jobId);
            setGenerateError('');
            setDownloadId(json.downloadId);
            setJobStatus('waiting');
        } else {
            setGenerateError(json.message);
        }
    };

    // Poll active job status
    useEffect(() => {
        if (!jobId) return;

        let id;
        const poll = async () => {
            const res = await fetch(`/api/hr/jobs/status/${jobId}`);
            const json = await res.json();
            if (res.ok) setJobStatus(json.state);

            if (json.state === 'completed' || json.state === 'failed') {
                clearInterval(id);
                if (downloadIdRef.current) {
                    pollEmailSendStatus(downloadIdRef.current);
                }
            }
        };

        poll();
        id = setInterval(poll, 1000);
        return () => clearInterval(id);
    }, [jobId]);

    // Fetch active jobs on mount
    useEffect(() => {
        (async () => {
            const res = await fetch('/api/hr/jobs/active');
            const job = await res.json();
            if (res.ok) {
                setJobId(job.jobId);
                setDownloadId(job.downloadId);

                // ✅ fetch email status immediately so the correct button renders on first paint
                if (job.downloadId) {
                    const statusRes = await fetch(
                        `/api/hr/emails/${job.downloadId}/status`,
                    );
                    const statusJson = await statusRes.json();
                    if (statusRes.ok) {
                        setEmailState({
                            loading: statusJson.pending > 0,
                            error: '',
                            status: statusJson,
                        });
                        // resume polling if there are still pending emails
                        if (statusJson.pending > 0) {
                            pollEmailSendStatus(job.downloadId);
                        }
                    }
                }
            }
        })();
    }, []);

    // Upload file
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async () => {
            const res = await fetch('/api/hr/uploads/payslipfile', {
                method: 'POST',
                body: formData,
            });
            const json = await res.json();
            if (res.ok) {
                setFileError('');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setUploadRes({ batchId: json.batchId, isLoading: false });
            } else {
                setFileError(json.message);
                setUploadRes((p) => ({ ...p, isLoading: false }));
            }
        })();
    }, [file]);

    const isActive = ['active', 'waiting', 'delayed'].includes(jobStatus);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <SuccessPopup
                show={showSuccess}
                message="File uploaded successfully"
                onClose={() => setShowSuccess(false)}
            />
            <h2 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
                <UploadIcon />
                Upload & Generate
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Drop zone */}
                <div className="flex-1">
                    <div
                        className="border border-dashed border-gray-300 rounded-xl p-7 text-center cursor-pointer transition-colors duration-200 hover:border-teal-700 hover:bg-teal-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                <UploadIcon />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {file
                                        ? file.name
                                        : 'Click to upload Excel file'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    .xls, .xlsx accepted
                                </p>
                            </div>
                            {uploadRes.isLoading && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Spinner /> Uploading…
                                </div>
                            )}
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files[0];
                            const ext = f?.name.split('.').pop();
                            if (ext !== 'xls' && ext !== 'xlsx') {
                                setFileError(
                                    'Please select a valid Excel file (.xls, .xlsx)',
                                );
                                return;
                            }
                            setFile(f);
                            setFileError('');
                            setUploadRes((p) => ({
                                ...p,
                                isLoading: true,
                            }));
                        }}
                    />
                    {fileError && (
                        <p className="mt-2 text-xs text-red-500">{fileError}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-40">
                    <button
                        className="bg-teal-700 text-white rounded-lg px-5 py-2 text-[13px] font-semibold transition-colors duration-150 cursor-pointer border-none hover:bg-teal-800 active:scale-[.97] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={!uploadRes.batchId || isActive}
                        onClick={handleGenerate}
                    >
                        {isActive ? 'Generating…' : 'Generate Payslips'}
                    </button>

                    {isActive && (
                        <button
                            className="bg-transparent text-red-600 border border-red-300 rounded-lg px-4 py-1.75 text-xs font-semibold transition-colors duration-150 cursor-pointer hover:bg-red-50"
                            onClick={handleCancel}
                        >
                            Cancel Job
                        </button>
                    )}

                    {generateError && (
                        <p className="text-xs text-red-500">{generateError}</p>
                    )}
                </div>
            </div>

            {/* Current job status bar */}
            {jobId && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {isActive && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                        <div>
                            <p className="text-xs text-slate-400">
                                Current job
                            </p>
                            <p className="text-sm font-medium text-slate-700 font-mono">
                                {jobId}
                            </p>
                        </div>
                        <StatusBadge status={jobStatus || 'idle'} />
                    </div>

                    {jobStatus === 'completed' && downloadId && (
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="flex gap-x-2">
                                <button
                                    className="bg-transparent text-teal-700 border border-teal-200 rounded-lg px-3 py-1.25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleDownload(downloadId)}
                                >
                                    <DownloadIcon className="h-3.5 w-3.5" />
                                    Download ZIP
                                </button>

                                {emailState.status?.pending <= 0 &&
                                emailState.status?.failed > 0 ? (
                                    <button
                                        className="bg-transparent text-teal-700 border border-teal-200 rounded-lg px-3 py-1.25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() =>
                                            handleRetryFailed(downloadId)
                                        }
                                        disabled={emailState.loading}
                                    >
                                        Retry Failed
                                    </button>
                                ) : (
                                    <button
                                        className="bg-transparent text-teal-700 border border-teal-200 rounded-lg px-3 py-1.25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() =>
                                            handleSendEmails(downloadId)
                                        }
                                        disabled={emailState.loading}
                                    >
                                        {emailState.loading && <Spinner />}
                                        {emailState.loading
                                            ? 'Sending…'
                                            : 'Send Emails'}
                                    </button>
                                )}
                            </div>
                            {emailState.error && (
                                <p className="text-xs text-red-500">
                                    {emailState.error}
                                </p>
                            )}
                            {emailState.status && (
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="text-amber-500 font-medium">
                                        {emailState.status.pending} pending
                                    </span>
                                    <span className="text-teal-600 font-medium">
                                        {emailState.status.sent} sent
                                    </span>
                                    {emailState.status.failed > 0 && (
                                        <span className="text-red-500 font-medium">
                                            {emailState.status.failed} failed
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UploadAndGenerate;
