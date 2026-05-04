import { useParams } from 'react-router';

function DownloadClassFormationButton() {
    const { id } = useParams();
    async function handleDownload() {
        const res = await fetch(
            `/api/accounts/batches/${id}/download-formation`,
        );
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = res.headers
            .get('content-disposition')
            ?.split('filename=')[1]
            ?.replace(/"/g, '');
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    return (
        <button
            className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium shadow-lg hover:bg-gray-700 active:scale-95 transition-all z-10 cursor-pointer"
            onClick={handleDownload}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Class Formation
        </button>
    );
}

export default DownloadClassFormationButton;
