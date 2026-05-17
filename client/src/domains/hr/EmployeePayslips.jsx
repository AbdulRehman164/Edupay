import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

/* ── helpers ── */
const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

function monthLabel(month, year) {
    return `${MONTHS[(month ?? 1) - 1]} ${year}`;
}

const STATUS_META = {
    completed: {
        label: 'Completed',
        color: '#16a34a',
        bg: '#f0fdf4',
        dot: '#22c55e',
    },
    active: {
        label: 'Processing',
        color: '#d97706',
        bg: '#fffbeb',
        dot: '#f59e0b',
    },
    waiting: {
        label: 'Waiting',
        color: '#6366f1',
        bg: '#eef2ff',
        dot: '#818cf8',
    },
    delayed: {
        label: 'Delayed',
        color: '#6366f1',
        bg: '#eef2ff',
        dot: '#818cf8',
    },
    pending: {
        label: 'Pending',
        color: '#6366f1',
        bg: '#eef2ff',
        dot: '#818cf8',
    },
    failed: {
        label: 'Failed',
        color: '#dc2626',
        bg: '#fef2f2',
        dot: '#f87171',
    },
};

function StatusBadge({ status }) {
    const s = STATUS_META[status] ?? STATUS_META.pending;
    return (
        <span
            style={{ color: s.color, background: s.bg }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        >
            <span
                style={{ background: s.dot }}
                className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'animate-pulse' : ''}`}
            />
            {s.label}
        </span>
    );
}

function Spinner({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

function BackIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v6m0 0l-3-3m3 3l3-3M12 3v9"
            />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
        </svg>
    );
}

/* ── skeleton ── */
function SkeletonRow() {
    return (
        <tr>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-slate-100 animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                        <div className="h-2.5 w-28 rounded bg-slate-100 animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-3.5">
                <div className="h-2.5 w-16 rounded bg-slate-100 animate-pulse" />
            </td>
        </tr>
    );
}

/* ── main ── */
const EmployeePayslips = () => {
    const { cnic } = useParams();
    const navigate = useNavigate();
    const [payslips, setPayslips] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [job, setJob] = useState(null);
    const [error, setError] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    /* ── fetch payslips ── */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/hr/payslips/search?cnic=${cnic}`);
                const json = await res.json();
                if (res.ok) setPayslips(json);
            } finally {
                setIsFetching(false);
            }
        })();
    }, [cnic]);

    /* ── poll job status ── */
    useEffect(() => {
        if (!job?.id) return;
        const id = setInterval(async () => {
            const res = await fetch(`/api/hr/jobs/status/${job.id}`);
            const json = await res.json();
            if (res.ok)
                setJob((prev) =>
                    prev ? { ...prev, status: json.state } : prev,
                );
        }, 1000);
        return () => clearInterval(id);
    }, [job?.id]);

    /* ── auto-download on completion ── */
    useEffect(() => {
        if (job?.status !== 'completed' || !job.downloadId) return;
        setIsDownloading(true);
        (async () => {
            try {
                const res = await fetch(
                    `/api/hr/payslips/download/${job.downloadId}`,
                );
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `payslips-${cnic}.zip`;
                a.click();
                URL.revokeObjectURL(url);
            } finally {
                setIsDownloading(false);
                setJob(null);
            }
        })();
    }, [job?.status, job?.downloadId]);

    /* ── generate + download all ── */
    const handleDownloadAll = async () => {
        if (job) return;
        setError('');
        const identifiers = payslips.map((p) => ({
            cnic_no: p.cnic_no,
            month: p.month,
            year: p.year,
        }));
        const res = await fetch('/api/hr/payslips/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'identifier', identifiers }),
        });
        const json = await res.json();
        if (!res.ok) {
            setError(json.message || 'Failed to start generation.');
            return;
        }
        setJob({
            id: json.jobId,
            status: 'pending',
            downloadId: json.downloadId,
        });
    };

    /* ── cancel job ── */
    const handleCancel = async () => {
        if (!window.confirm('Cancel this job?')) return;
        await fetch(`/api/hr/jobs/cancel/${job.id}`, { method: 'DELETE' });
        setJob(null);
    };

    const jobInProgress = job && !['completed', 'failed'].includes(job.status);
    const inProgressStatuses = ['active', 'waiting', 'delayed', 'pending'];

    return (
        <div className="min-h-screen bg-slate-50">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');
                * { font-family: 'Geist', ui-sans-serif, system-ui, sans-serif; }
                .card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,.06); }
                .table-row:hover td { background:#f8fafc; }
                .btn-primary { background:#0f766e; color:#fff; border-radius:8px; padding:8px 18px; font-size:13px; font-weight:600; cursor:pointer; border:none; display:inline-flex;align-items:center;gap:6px; transition:background .15s,transform .1s; }
                .btn-primary:hover:not(:disabled) { background:#0d6660; }
                .btn-primary:active:not(:disabled) { transform:scale(.97); }
                .btn-primary:disabled { background:#9ca3af; cursor:not-allowed; }
                .btn-danger { background:transparent; color:#dc2626; border:1px solid #fca5a5; border-radius:8px; padding:6px 14px; font-size:12px; font-weight:600; cursor:pointer; transition:background .15s; }
                .btn-danger:hover { background:#fef2f2; }
                .btn-back { display:inline-flex;align-items:center;gap:5px; font-size:13px; font-weight:500; color:#64748b; background:transparent; border:none; cursor:pointer; padding:0; }
                .btn-back:hover { color:#0f172a; }
                .month-chip { display:inline-flex;align-items:center;justify-content:center; background:#f1f5f9; color:#475569; border-radius:8px; width:42px;height:38px; font-size:11px;font-weight:700;line-height:1.1;text-align:center;text-transform:uppercase; flex-shrink:0; }
            `}</style>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
                {/* ── Back ── */}
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <BackIcon /> Back
                </button>

                {/* ── Header card ── */}
                <div className="card px-6 py-5 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-base font-semibold text-slate-800">
                            Payslips
                        </h1>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {cnic}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {jobInProgress && <StatusBadge status={job.status} />}

                        {inProgressStatuses.includes(job?.status) && (
                            <button
                                className="btn-danger"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}

                        {!jobInProgress && (
                            <button
                                className="btn-primary"
                                disabled={
                                    payslips.length === 0 || isDownloading
                                }
                                onClick={handleDownloadAll}
                            >
                                {isDownloading ? (
                                    <>
                                        <Spinner /> Downloading…
                                    </>
                                ) : (
                                    <>
                                        <DownloadIcon /> Download All
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* ── Job progress bar ── */}
                {jobInProgress && (
                    <div className="card px-5 py-4 flex items-center gap-4">
                        <Spinner className="h-4 w-4 text-teal-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">
                                Generating payslips…
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                This may take a moment. The file will download
                                automatically when ready.
                            </p>
                        </div>
                        <StatusBadge status={job.status} />
                    </div>
                )}

                {/* ── Payslips table ── */}
                <div className="card overflow-hidden">
                    <div
                        className="px-5 py-3.5 flex items-center justify-between"
                        style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: '#fafafa',
                        }}
                    >
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Payslip Records
                        </p>
                        {!isFetching && (
                            <span className="text-xs text-slate-400">
                                {payslips.length}{' '}
                                {payslips.length === 1 ? 'record' : 'records'}
                            </span>
                        )}
                    </div>

                    <table className="w-full text-sm">
                        <tbody>
                            {isFetching ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonRow key={i} />
                                ))
                            ) : payslips.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="py-14 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <FileIcon />
                                            <p className="text-sm">
                                                No payslips found for this
                                                employee.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                payslips.map((p) => (
                                    <tr
                                        key={`${p.month}-${p.year}`}
                                        className="table-row"
                                        style={{
                                            borderBottom: '1px solid #f8fafc',
                                        }}
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="month-chip">
                                                    {MONTHS[(p.month ?? 1) - 1]}
                                                    <br />
                                                    {p.year}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {monthLabel(
                                                            p.month,
                                                            p.year,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Monthly Payslip
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="text-xs text-slate-300 font-mono">
                                                {p.cnic_no}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeePayslips;
