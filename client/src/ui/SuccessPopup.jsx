import { useEffect, useState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

const SuccessPopup = ({ message, show, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (show) {
            setExiting(false);
            setVisible(true);
        } else if (visible) {
            setExiting(true);
            const t = setTimeout(() => {
                setVisible(false);
                setExiting(false);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [show]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => {
            setVisible(false);
            setExiting(false);
            onClose?.();
        }, 300);
    };

    if (!visible) return null;

    return (
        <div className="fixed top-5 right-5 z-50 pointer-events-none">
            <div
                className={`pointer-events-auto ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
            >
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg flex items-center gap-2.5 px-3.5 py-3 min-w-64 max-w-sm">
                    {/* green check circle */}
                    <div className="bg-green-50 border border-green-200 rounded-full w-7 h-7 flex items-center justify-center text-green-600 shrink-0">
                        <CheckIcon className="h-4 w-4" />
                    </div>

                    {/* message */}
                    <p className="text-[13px] font-medium text-slate-900 flex-1 leading-snug">
                        {message}
                    </p>

                    {/* close */}
                    <button
                        onClick={handleClose}
                        className="bg-transparent border-none cursor-pointer p-0.5 rounded text-slate-400 flex items-center shrink-0 transition-colors duration-150 hover:text-slate-600"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
