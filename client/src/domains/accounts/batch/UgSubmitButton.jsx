import { useParams } from 'react-router';

function UgSubmitButton({ s, setStudents }) {
    const { id } = useParams();
    async function handleSubmit(s, action) {
        const res = await fetch(
            `/api/accounts/batches/${id}/students/submit/${s.id}?action=${action}`,
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
    return s.ug_form_submitted ? (
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
    );
}

export default UgSubmitButton;
