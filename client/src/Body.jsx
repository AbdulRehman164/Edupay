import { useState, useEffect, useRef } from 'react';
const Body = () => {
    const [file, setFile] = useState(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    const [uploadRes, setUploadRes] = useState({
        uploadId: null,
        isLoading: true,
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
        <div className="mx-6 my-3 flex gap-5 items-center justify-center">
            <input
                type="file"
                className="
        block w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-medium
        file:bg-teal-400 file:text-white
        hover:file:bg-teal-500
        focus:outline-none
        focus:ring-2 focus:ring-teal-400
        cursor-pointer
    "
                onChange={(e) => {
                    const ext = e.target.files[0]?.name.split('.').pop();
                    if (ext !== 'xls' && ext !== 'xlsx') {
                        setFileTypeError(true);
                        return;
                    }
                    setFile(e.target.files[0]);
                    setFileTypeError(false);
                    setUploadRes((prev) => ({ ...prev, isLoading: true }));
                }}
            />
            {fileTypeError ? <div>Please select the excel file.</div> : null}
            <button
                disabled={uploadRes.uploadId === null}
                className=" disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 text-sm text-gray-700 bg-teal-400 py-2 px-4 text-white font-bold rounded-lg hover:bg-teal-500 focus:outline-none cursor-pointer w-100 "
                onClick={async () => {
                    const res = await fetch(
                        'http://localhost:3000/api/generatepayslips',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
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
            <div>{jobStatus}</div>
            {jobStatus === 'completed' ? (
                <button
                    onClick={async () => {
                        const res = await fetch(
                            `http://localhost:3000/api/download/${uploadId}`,
                            {
                                method: 'GET',
                            },
                        );
                        console.log(res);
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'payslips.zip';
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                >
                    Download
                </button>
            ) : null}
        </div>
    );
};

export default Body;
