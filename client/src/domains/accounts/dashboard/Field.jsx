function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}

export default Field;
