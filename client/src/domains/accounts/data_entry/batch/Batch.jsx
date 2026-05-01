import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import BatchUploadButton from './BatchUploadButton';
import BatchStudents from './BatchStudents';

function Batch() {
    const { id } = useParams();
    const [students, setStudents] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchStudents() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/accounts/batches/${id}/students/`);
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
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <BatchUploadButton fetchStudents={fetchStudents} batchId={id} />
            <div className="max-w-6xl mx-auto px-6 py-8">
                {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                <BatchStudents loading={loading} students={students} />
            </div>
        </div>
    );
}

export default Batch;
