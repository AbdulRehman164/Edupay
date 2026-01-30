import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Payslips = () => {
    const [query, setQuery] = useState('');
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setEmployees([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError('');

                const res = await fetch(
                    `/api/employees?search=${encodeURIComponent(query)}`,
                );

                if (!res.ok) {
                    throw new Error('Failed to fetch payslips');
                }

                const data = await res.json();
                setEmployees(data?.employees);
            } catch (err) {
                setError('Cannot fetch payslips. Try again later.');
            } finally {
                setIsLoading(false);
            }
        }, 400); // debounce delay

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="mx-auto mt-10 max-w-5xl rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Search Payslips
            </h2>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search employee by name…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="
            w-full rounded-lg border px-4 py-2 text-sm
            outline-none transition
            focus:border-teal-500 focus:ring-2 focus:ring-teal-300
          "
                />
            </div>

            {/* Status */}
            {isLoading && <p className="text-sm text-gray-500">Searching…</p>}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* employees */}
            {!isLoading && employees.length > 0 && (
                <div className="divide-y rounded-lg border">
                    {employees.map((employee) => (
                        <div
                            key={employee.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        >
                            <div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">
                                        {employee.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {employee.cnic_no}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    navigate(
                                        `/hr/payslips/${employee.cnic_no}`,
                                    );
                                }}
                                className="
                  rounded-md border border-teal-500 px-4 py-1.5 text-sm
                  font-semibold text-teal-600
                  transition hover:bg-teal-50 active:scale-95
                "
                            >
                                Open
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && query && employees.length === 0 && (
                <p className="text-sm text-gray-500">No payslips found.</p>
            )}
        </div>
    );
};

export default Payslips;
