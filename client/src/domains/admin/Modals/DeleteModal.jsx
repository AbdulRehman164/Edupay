import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteModal = ({ user, onConfirm, onClose, loading }) => (
    <Modal title="Delete User" onClose={onClose}>
        <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle size={22} className="text-rose-500" />
            </div>
            <p className="text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800">
                    {user.username}
                </span>
                ? This action cannot be undone.
            </p>
        </div>
        <div className="mt-6 flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-medium text-white hover:bg-rose-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Delete
            </button>
        </div>
    </Modal>
);

export default DeleteModal;
