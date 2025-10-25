import { useEffect, useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async function () {
            const response = await fetch('http://localhost:3000/file', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert('File uploaded successfully.');
            } else {
                alert('File upload failed.');
            }
        })();
    }, [file]);
    return (
        <>
            <input
                type="file"
                onChange={(e) => {
                    const ext = e.target.files[0].name.split('.').pop();
                    console.log(ext);
                    if (ext !== 'xls' && ext !== 'xlsx') {
                        setFileTypeError(true);
                        return;
                    }
                    setFile(e.target.files[0]);
                    setFileTypeError(false);
                }}
            />
            {fileTypeError ? <div>Please select the excel file.</div> : null}
        </>
    );
}

export default App;
