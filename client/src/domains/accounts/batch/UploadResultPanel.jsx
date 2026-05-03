function UploadResultPanel({ result, onDismiss }) {
    const { inserted = [], skipped = [] } = result;
    const total = inserted.length + skipped.length;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="font-medium text-sm text-gray-800 m-0">
                        Upload complete
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {total} rows processed
                    </p>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-gray-400 hover:text-gray-600 transition text-base leading-none cursor-pointer bg-transparent border-none p-0.5"
                >
                    ✕
                </button>
            </div>

            {/* Stat cards */}
            <div
                className={`grid grid-cols-2 gap-2.5 ${skipped.length ? 'mb-4' : ''}`}
            >
                <div className="bg-emerald-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-medium text-emerald-700 mb-1">
                        Added
                    </p>
                    <p className="text-2xl font-medium text-emerald-700">
                        {inserted.length}
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5 opacity-80">
                        new students
                    </p>
                </div>
                <div className="bg-amber-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-medium text-amber-700 mb-1">
                        Skipped
                    </p>
                    <p className="text-2xl font-medium text-amber-700">
                        {skipped.length}
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5 opacity-80">
                        already exist
                    </p>
                </div>
            </div>

            {/* Skipped rows detail */}
            {skipped.length > 0 && (
                <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
                        Skipped entries
                    </p>
                    <div className="border border-gray-100 rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                        {skipped.map((s, i) => (
                            <div
                                key={s.reg_number}
                                className={`flex items-center justify-between px-3 py-2 text-xs ${
                                    i < skipped.length - 1
                                        ? 'border-b border-gray-100'
                                        : ''
                                } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                                <span className="font-mono text-gray-800">
                                    {s.reg_number}
                                </span>
                                <span className="text-gray-500">{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadResultPanel;
