import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

function FinalizeFormationButton({ setError }) {
    const [finalizing, setFinalizing] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    async function handleFinalizeFormation() {
        if (!confirm) {
            setConfirm(true);
            return;
        }
        setFinalizing(true);
        setError(null);
        try {
            const res = await fetch(
                `/api/accounts/batches/${id}/finalize_formation`,
                {
                    method: 'PATCH',
                },
            );
            if (!res.ok) {
                throw new Error(
                    'Failed to finalize formation. Please try again.',
                );
            }
            navigate('/accounts/accounts/');
        } catch (e) {
            setError(e.message);
            setConfirm(false);
        } finally {
            setFinalizing(false);
        }
    }
    return (
        <div className="absolute top-20 right-8 z-20 ">
            {confirm ? (
                <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl shadow-lg px-4 py-3 ">
                    <span className="text-sm text-green-700 font-medium">
                        Finalize this formation?
                    </span>
                    <button
                        onClick={handleFinalizeFormation}
                        disabled={finalizing}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                    >
                        {finalizing ? 'finalizing…' : 'Confirm'}
                    </button>
                    <button
                        onClick={() => setConfirm(false)}
                        disabled={finalizing}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleFinalizeFormation}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-md hover:border-green-300 hover:text-green-600 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                    Finalize Formation
                </button>
            )}
        </div>
    );
}

export default FinalizeFormationButton;
