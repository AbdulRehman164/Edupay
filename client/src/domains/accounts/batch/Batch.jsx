import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import BatchUploadButton from './BatchUploadButton';
import BatchStudents from './BatchStudents';
import AddStudentModal from './AddStudentModal';
import { useAuth } from '../../../auth/AuthContext';

function Batch() {
    const { id } = useParams();
    const [students, setStudents] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    async function fetchStudents(search = '') {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `/api/accounts/batches/${id}/students?search=${search}`,
            );
            if (!res.ok) {
                throw new Error(
                    'Something went wrong while fetching students. Please try again later.',
                );
            }
            const json = await res.json();
            if (user.role === 'accounts') {
                setStudents(json.filter((s) => s.ug_form_submitted));
            } else {
                setStudents(json);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {user.role === 'data_entry' && (
                <BatchUploadButton fetchStudents={fetchStudents} batchId={id} />
            )}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                <BatchStudents
                    loading={loading}
                    students={students}
                    fetchStudents={fetchStudents}
                    batchId={id}
                    setStudents={setStudents}
                />
            </div>

            {user.role === 'data_entry' && (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-2xl z-10"
                        aria-label="Create batch"
                    >
                        +
                    </button>

                    <AddStudentModal
                        open={open}
                        setOpen={setOpen}
                        fetchStudents={fetchStudents}
                    />
                </>
            )}
        </div>
    );
}

export default Batch;
