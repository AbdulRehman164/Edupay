import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Loader from '../../../ui/Loader';
import { Search } from 'lucide-react';

function Batch() {
    const { id } = useParams();
    const [students, setStudents] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(null);
        (async function () {
            try {
                const res = await fetch(
                    `/api/accounts/batches/${id}/students/`,
                );
                if (!res.ok) {
                    throw new Error(
                        'Something went wrong while fetching students. Please try again later.',
                    );
                }
                const json = await res.json();
                setStudents(json);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function handleSubmit(s, action) {
        setStudents((prev) =>
            prev.map((student) =>
                student.id === s.id
                    ? {
                          ...student,
                          ug_form_submitted: action == 'submit' ? true : false,
                      }
                    : student,
            ),
        );
    }
    if (loading) return <Loader />;
    if (error)
        return (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                Students
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {students?.length} total entries
                            </p>
                        </div>
                        <div className="relative mb-4">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                value={searchInput}
                                onChange={(e) =>
                                    handleSearchInput(e.target.value)
                                }
                                placeholder="Search by registration no."
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Reg. No.
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Name
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        UG-Submitted
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students?.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-gray-50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {s.reg_number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {s.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 capitalize w-50">
                                            {s.ug_form_submitted ? (
                                                <span
                                                    onClick={() =>
                                                        handleSubmit(
                                                            s,
                                                            'unsubmit',
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-150"
                                                >
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2.5}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    Submitted
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleSubmit(
                                                            s,
                                                            'submit',
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
                                                >
                                                    Submit UG Form
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Batch;
