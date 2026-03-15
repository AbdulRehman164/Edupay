import Modal from './Modal';
import { Check, KeyRound } from 'lucide-react';
import { useState } from 'react';

function NewPasswordModal({ password, onClose }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal title="Password Reset" onClose={onClose}>
            <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <KeyRound size={20} className="text-teal-600" />
                </div>
                <p className="text-sm text-gray-500">
                    New password generated. Share it securely.
                </p>
                <div className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 font-mono text-sm text-gray-800 text-left">
                    {password}
                </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button
                    onClick={copy}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                    {copied ? (
                        <Check size={14} className="text-teal-500" />
                    ) : null}
                    {copied ? 'Copied!' : 'Copy Password'}
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 rounded-lg bg-teal-500 py-2 text-sm font-medium text-white hover:bg-teal-600 transition"
                >
                    Done
                </button>
            </div>
        </Modal>
    );
}
export default NewPasswordModal;
