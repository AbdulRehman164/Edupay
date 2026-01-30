import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const EmployeePayslips = () => {
    const { cnic } = useParams();

    const [payslips, setPayslips] = useState([]);
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [downloadId, setDownloadId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch(`/api/payslips/search?cnic=${cnic}`);
            const json = await res.json();
            setPayslips(json);
        })();
    }, [cnic]);

    useEffect(() => {
        if (!jobId) return;

        const intervalId = setInterval(async () => {
            const res = await fetch(`/api/job-status/${jobId}`);
            const json = await res.json();
            setJobStatus(json.state);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [jobId]);

    useEffect(() => {
        if (jobStatus !== 'completed' || !downloadId) return;

        (async () => {
            const res = await fetch(`/api/payslips/download/${downloadId}`);
            const blob = await res.blob();

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'payslips.zip';
            a.click();
            URL.revokeObjectURL(url);

            // reset state
            setJobId(null);
            setJobStatus(null);
            setDownloadId(null);
            setIsGenerating(false);
        })();
    }, [jobStatus, downloadId]);

    async function downloadHandler() {
        if (isGenerating) return;

        setIsGenerating(true);

        const identifiers = payslips.map((p) => ({
            cnic_no: p.cnic_no,
            month: p.month,
            year: p.year,
        }));

        const res = await fetch('/api/payslips/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'identifier',
                identifiers,
            }),
        });

        const { jobId, downloadId } = await res.json();

        setJobId(jobId);
        setDownloadId(downloadId);
        setJobStatus('pending');
    }

    return (
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Payslips
            </h3>

            {payslips.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                    There are no payslips for this employee.
                </div>
            ) : (
                <div className="divide-y rounded-lg border">
                    {payslips.map((payslip) => (
                        <div
                            key={`${payslip.month}-${payslip.year}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {new Date(
                                        2000,
                                        payslip.month - 1,
                                        1,
                                    ).toLocaleString('en-US', {
                                        month: 'short',
                                    })}{' '}
                                    – {payslip.year}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Monthly Payslip
                                </p>
                            </div>

                            <button
                                disabled={isGenerating}
                                onClick={downloadHandler}
                                className="
                  rounded-md border border-teal-500 px-4 py-1.5 text-sm
                  font-semibold text-teal-600 transition
                  hover:bg-teal-50 disabled:opacity-50
                "
                            >
                                {isGenerating ? 'Generating…' : 'Download'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeePayslips;
