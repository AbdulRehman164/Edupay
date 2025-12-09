import { useState, useEffect, useRef } from 'react';
const Body = () => {
    const [file, setFile] = useState(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    const [uploadId, setUploadId] = useState(null);
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
            setUploadId(json.uploadId);
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
        <div>
            <input
                type="file"
                onChange={(e) => {
                    const ext = e.target.files[0].name.split('.').pop();
                    if (ext !== 'xls' && ext !== 'xlsx') {
                        setFileTypeError(true);
                        return;
                    }
                    setFile(e.target.files[0]);
                    setFileTypeError(false);
                }}
            />
            {fileTypeError ? <div>Please select the excel file.</div> : null}
            <button
                onClick={async () => {
                    const res = await fetch(
                        'http://localhost:3000/api/generatepayslips',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ uploadId }),
                        },
                    );
                    const json = await res.json();
                    setJobId(json.jobId);
                }}
            >
                Generate Payslips
            </button>
            <div>{jobStatus}</div>
        </div>
    );
};

export default Body;
