import { useState, useEffect, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router';
function DashboardBatchTable() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const searchTimeout = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);
        (async function () {
            try {
                const res = await fetch(
                    `/api/accounts/batches?search=${search}`,
                );

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || 'Something went wrong.');
                }
                const json = await res.json();
                setBatches(json);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [search]);

    const handleSearchInput = (val) => {
        setSearchInput(val);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setSearch(val.trim());
        }, 400);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                        Open Batches
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {batches.length} total entries
                    </p>
                </div>
                <div className="relative mb-4">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                        value={searchInput}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder="Search by reg-no or name..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                    />
                    {searchInput && (
                        <button
                            onClick={() => handleSearchInput('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {loading && <ClipLoader className="m-auto block" />}
            {loading || (
                <div className="overflow-x-auto">
                    {error ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            Something went wrong. Please try again later.
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Department
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Semester
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Section
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Year
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {batches.map((b) => (
                                    <tr
                                        key={b.id}
                                        onClick={() =>
                                            navigate(`batches/${b.id}`)
                                        }
                                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {b.department}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            Sem {b.semester}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 capitalize">
                                            {b.section}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {b.year}
                                        </td>
                                        <td className="px-6 py-4">
                                            {b.status === 'open' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Open
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                    Closed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default DashboardBatchTable;
