import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

function CloseBatchButton({ setError }) {
    const [closing, setClosing] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    async function handleCloseBatch() {
        if (!confirmClose) {
            setConfirmClose(true);
            return;
        }
        setClosing(true);
        setError(null);
        try {
            const res = await fetch(`/api/accounts/batches/${id}/close`, {
                method: 'PATCH',
            });
            if (!res.ok) {
                throw new Error('Failed to close batch. Please try again.');
            }
            navigate('/accounts/data_entry/');
        } catch (e) {
            setError(e.message);
            setConfirmClose(false);
        } finally {
            setClosing(false);
        }
    }
    return (
        <div className="absolute top-20 right-8 z-20 ">
            {confirmClose ? (
                <div className="flex items-center gap-2 bg-white border border-red-200 rounded-xl shadow-lg px-4 py-3 ">
                    <span className="text-sm text-red-700 font-medium">
                        Close this batch?
                    </span>
                    <button
                        onClick={handleCloseBatch}
                        disabled={closing}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                    >
                        {closing ? 'Closing…' : 'Confirm'}
                    </button>
                    <button
                        onClick={() => setConfirmClose(false)}
                        disabled={closing}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleCloseBatch}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-md hover:border-red-300 hover:text-red-600 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                    Close Batch
                </button>
            )}
        </div>
    );
}

export default CloseBatchButton;
