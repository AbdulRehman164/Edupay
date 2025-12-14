import { useState, useEffect } from 'react';
const Employees = () => {
    const [file, setFile] = useState(null);
    const [fileTypeError, setFileTypeError] = useState(false);
    const [paginationData, setPaginationData] = useState({
        employees: [],
        page: 1,
        totalPages: 1,
        isLoading: false,
    });
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        (async () => {
            const res = await fetch(
                `http://localhost:3000/api/employees?page=${currentPage}`,
                {
                    method: 'GET',
                },
            );
            const json = await res.json();
            setPaginationData({ ...json, isLoading: false });
            console.log(json);
        })();
    }, [currentPage]);
    useEffect(() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        (async function () {
            const res = await fetch(
                'http://localhost:3000/api/upload/employeefile',
                {
                    method: 'POST',
                    body: formData,
                },
            );
            const json = await res.json();
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
            <div>
                {!paginationData.isLoading
                    ? paginationData.employees.map((employee) => (
                          <div key={employee.id} className="flex">
                              <div>{employee.name}</div>
                              <div>{employee.cnic_no}</div>
                          </div>
                      ))
                    : null}
            </div>

            <button
                onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
            >
                prev
            </button>

            <button
                onClick={() => {
                    setCurrentPage((prev) =>
                        Math.min(prev + 1, paginationData?.totalPages),
                    );
                }}
            >
                next
            </button>
        </div>
    );
};

export default Employees;
