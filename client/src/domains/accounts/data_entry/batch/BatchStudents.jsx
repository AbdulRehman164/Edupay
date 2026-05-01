import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import StudentsTable from './StudentsTable';
import { Loader, X } from 'lucide-react';
function BatchStudents({
    loading,
    students,
    fetchStudents,
    batchId,
    setStudents,
}) {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const searchTimeout = useRef();

    useEffect(() => {
        fetchStudents(search);
    }, [search]);
    function handleSearchInput(val) {
        setSearchInput(val);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setSearch(val.trim());
        }, 400);
    }

    return (
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
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader />
                    </div>
                ) : (
                    <StudentsTable
                        students={students}
                        batchId={batchId}
                        setStudents={setStudents}
                    />
                )}
            </div>
        </div>
    );
}

export default BatchStudents;
