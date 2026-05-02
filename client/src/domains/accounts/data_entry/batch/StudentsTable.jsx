function StudentsTable({ students, batchId, setStudents }) {
    async function handleSubmit(s, action) {
        const res = await fetch(
            `/api/accounts/batches/${batchId}/students/submit/${s.id}?submit=${action}`,
            { method: 'PATCH' },
        );
        if (res.ok) {
            setStudents((prev) =>
                prev.map((student) =>
                    student.id === s.id
                        ? {
                              ...student,
                              ug_form_submitted:
                                  action === 'true' ? true : false,
                          }
                        : student,
                ),
            );
        }
    }
    async function handleDelete(s) {
        if (!window.confirm('Are you sure you want to delete this student?'))
            return;
        const res = await fetch(
            `/api/accounts/batches/${batchId}/students/${s.id}`,
            { method: 'DELETE' },
        );
        if (res.ok) {
            setStudents((prev) =>
                prev.filter((student) => student.id !== s.id),
            );
        }
    }
    return (
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
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Actions
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
                        <td className="px-6 py-4 text-gray-500">{s.name}</td>
                        <td className="px-6 py-4 text-gray-500 capitalize w-50">
                            {s.ug_form_submitted ? (
                                <span
                                    onClick={() => handleSubmit(s, 'false')}
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
                                    onClick={() => handleSubmit(s, 'true')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
                                >
                                    Submit UG Form
                                </button>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => handleDelete(s)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-400 active:scale-95 transition-all duration-150 shadow-sm cursor-pointer"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default StudentsTable;
