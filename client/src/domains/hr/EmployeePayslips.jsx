import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const EmployeePayslips = () => {
    const { cnic } = useParams();

    const [payslips, setPayslips] = useState([]);
    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);

    /* ---------------- Fetch payslips ---------------- */

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/hr/payslips/search?cnic=${cnic}`);
            const json = await res.json();

            if (res.ok) {
                setPayslips(json);
            }
        })();
    }, [cnic]);

    /* ---------------- Poll job status ---------------- */

    useEffect(() => {
        if (!job?.id) return;

        const intervalId = setInterval(async () => {
            const res = await fetch(`/api/hr/jobs/status/${job.id}`);
            const json = await res.json();

            if (res.ok) {
                setJob((prev) =>
                    prev ? { ...prev, status: json.state } : prev,
                );
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [job?.id]);

    /* ---------------- Download when completed ---------------- */

    useEffect(() => {
        if (job?.status !== 'completed' || !job.downloadId) return;

        (async () => {
            const res = await fetch(
                `/api/hr/payslips/download/${job.downloadId}`,
            );
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'payslips.zip';
            a.click();
            URL.revokeObjectURL(url);

            // reset job state
            setJob(null);
        })();
    }, [job?.status, job?.downloadId]);

    /* ---------------- Handlers ---------------- */

    async function downloadAllHandler() {
        if (job) return;

        setError(null);

        const identifiers = payslips.map((p) => ({
            cnic_no: p.cnic_no,
            month: p.month,
            year: p.year,
        }));

        const res = await fetch('/api/hr/payslips/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'identifier',
                identifiers,
            }),
        });

        const json = await res.json();

        if (!res.ok) {
            setError(json.message || 'Failed to generate payslips');
            return;
        }

        setJob({
            id: json.jobId,
            status: 'pending',
            downloadId: json.downloadId,
        });
    }

    const jobInProgress =
        job && job.status !== 'completed' && job.status !== 'failed';

    /* ---------------- UI ---------------- */

    return (
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                    Payslips
                </h3>

                <button
                    disabled={jobInProgress || payslips.length === 0}
                    onClick={downloadAllHandler}
                    className="
            rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white
            transition hover:bg-teal-700 disabled:opacity-50
          "
                >
                    {jobInProgress ? 'Generating…' : 'Download all payslips'}
                </button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            {payslips.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                    There are no payslips for this employee.
                </div>
            ) : (
                <div className="divide-y rounded-lg border">
                    {payslips.map((p) => (
                        <div
                            key={`${p.month}-${p.year}`}
                            className="flex items-center justify-between px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {new Date(
                                        2000,
                                        p.month - 1,
                                        1,
                                    ).toLocaleString('en-US', {
                                        month: 'short',
                                    })}{' '}
                                    – {p.year}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Monthly Payslip
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {job && (
                <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                    <div>
                        Status:{' '}
                        <span
                            className={
                                job.status === 'completed'
                                    ? 'text-green-600'
                                    : job.status === 'failed'
                                      ? 'text-red-600'
                                      : 'text-gray-500'
                            }
                        >
                            {job.status}
                        </span>
                    </div>
                    <div>
                        {job.status === 'active' ||
                        job.status === 'waiting' ||
                        job.status === 'delayed' ||
                        job.status === 'pending' ? (
                            <button
                                onClick={async () => {
                                    const confirmCancel = window.confirm(
                                        'Are you sure you want to cancel this job?',
                                    );
                                    if (!confirmCancel) return;

                                    await fetch(
                                        `/api/hr/jobs/cancel/${job.id}`,
                                        {
                                            method: 'DELETE',
                                        },
                                    );
                                    setJob(null);
                                }}
                                className="rounded-lg border border-red-500 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95"
                            >
                                Cancel Job
                            </button>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeePayslips;
