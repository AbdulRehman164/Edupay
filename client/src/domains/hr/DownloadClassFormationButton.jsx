import { DownloadIcon } from 'lucide-react';

function DownloadClassFormationButton({ id, isDisabled }) {
    async function handleDownload(e) {
        e.stopPropagation();
        window.location.href = `/api/hr/${id}/download-formation`;
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isDisabled}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all whitespace-nowrap
                ${
                    isDisabled
                        ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 hover:bg-gray-50 active:scale-95 cursor-pointer'
                }`}
        >
            <DownloadIcon size={13} />
            Download
        </button>
    );
}

export default DownloadClassFormationButton;
