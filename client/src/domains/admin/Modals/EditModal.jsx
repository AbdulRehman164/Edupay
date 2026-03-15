import Modal from './Modal';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function EditModal({ user, onConfirm, onClose, loading }) {
    const [username, setUsername] = useState(user.username);

    return (
        <Modal title="Edit Username" onClose={onClose}>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    New Username
                </label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                    placeholder="New username"
                />
            </div>
            <div className="mt-6 flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(username)}
                    disabled={
                        loading || !username || username === user.username
                    }
                    className="flex-1 rounded-lg bg-teal-500 py-2 text-sm font-medium text-white hover:bg-teal-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Save
                </button>
            </div>
        </Modal>
    );
}
export default EditModal;
