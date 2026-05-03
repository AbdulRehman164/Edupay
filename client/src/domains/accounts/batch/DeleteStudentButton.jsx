import { useParams } from 'react-router';

function DeleteStudentButton({ s, setStudents }) {
    const { id } = useParams();
    async function handleDelete(s) {
        if (!window.confirm('Are you sure you want to delete this student?'))
            return;
        const res = await fetch(
            `/api/accounts/batches/${id}/students/${s.id}`,
            { method: 'DELETE' },
        );
        if (res.ok) {
            setStudents((prev) =>
                prev.filter((student) => student.id !== s.id),
            );
        }
    }
    return (
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
    );
}

export default DeleteStudentButton;
