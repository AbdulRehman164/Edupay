const SuccessPopup = ({ message, show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed top-6 right-6 z-50">
            <div className="flex items-center gap-3 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg animate-slide-in">
                <span>✅</span>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 text-white/80 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default SuccessPopup;
