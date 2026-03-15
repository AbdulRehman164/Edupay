import { X } from 'lucide-react';
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-sm font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
export default Modal;
