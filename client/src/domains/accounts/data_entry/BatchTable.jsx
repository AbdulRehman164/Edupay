function BatchTable({ batches }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                        All Batches
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {batches.length} total entries
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
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
                                className="hover:bg-gray-50 transition-colors group"
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
            </div>
        </div>
    );
}

export default BatchTable;
