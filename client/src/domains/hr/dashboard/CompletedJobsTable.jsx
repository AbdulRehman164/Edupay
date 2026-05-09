import { useState, useEffect } from 'react';
import { DownloadIcon } from 'lucide-react';
import StatusBadge from './StatusBridge';

function formatDate(ts) {
    if (!ts) return '—';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(ts));
}

function CompletedJobsTable({ handleDownload }) {
    const [completedJobs, setCompletedJobs] = useState([]);

    // poll completed jobs every 10 s
    useEffect(() => {
        const fetchCompleted = async () => {
            const res = await fetch('/api/hr/jobs/completed');
            const json = await res.json();
            if (res.ok) setCompletedJobs(json);
        };
        fetchCompleted();
        const id = setInterval(fetchCompleted, 10_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">
                    Recent Completed Jobs
                </h2>
                <span className="text-xs text-slate-400">
                    Last 10 · auto-refreshes every 10 s
                </span>
            </div>

            {completedJobs.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-sm text-slate-400">
                        No completed jobs yet.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-gray-50">
                                {[
                                    'Job ID',
                                    'Type',
                                    'Completed At',
                                    'Status',
                                    '',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {completedJobs.map((job, i) => (
                                <tr
                                    key={job.jobId ?? i}
                                    className={`group ${i < completedJobs.length - 1 ? 'border-b border-slate-50' : ''}`}
                                >
                                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500 group-hover:bg-slate-50">
                                        {job.jobId}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600 capitalize group-hover:bg-slate-50">
                                        {job.type === 'generate-for-upload'
                                            ? 'Upload'
                                            : job.type ===
                                                'generate-for-identifier'
                                              ? 'Employee'
                                              : null}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 text-xs group-hover:bg-slate-50">
                                        {formatDate(job.completedAt)}
                                    </td>
                                    <td className="px-5 py-3.5 group-hover:bg-slate-50">
                                        <StatusBadge status="completed" />
                                    </td>
                                    <td className="px-5 py-3.5 text-right group-hover:bg-slate-50">
                                        {job.downloadId && (
                                            <button
                                                className="bg-transparent text-teal-700 border border-teal-200 rounded-lg px-3 py-1.25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() =>
                                                    handleDownload(
                                                        job.downloadId,
                                                        `payslips-${job.jobId}.zip`,
                                                    )
                                                }
                                            >
                                                <DownloadIcon className="h-3.5 w-3.5" />
                                                Download
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CompletedJobsTable;
