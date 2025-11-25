import { useState, useEffect } from 'react';
const Body = () => {
    const [file, setFile] = useState(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async function () {
            const res = await fetch(
                'http://localhost:3000/upload/payslipfile',
                {
                    method: 'POST',
                    body: formData,
                },
            );
            const json = await res.json();
            console.log(json);
        })();
    }, [file]);
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
        </div>
    );
};

export default Body;
