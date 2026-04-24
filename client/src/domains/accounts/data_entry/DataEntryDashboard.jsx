import { useState } from 'react';
import CreateBatchModal from './CreateBatchModal';
import BatchStats from './BatchStats';
import BatchTable from './BatchTable';
import DataEntryDashboardHeader from './DataEntryDashboardHeader';

const PLACEHOLDER_BATCHES = [];

export default function DataEntryDashboard() {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <DataEntryDashboardHeader />
                {/* Stats */}
                <BatchStats batches={PLACEHOLDER_BATCHES} />
                {/* Table */}
                <BatchTable batches={PLACEHOLDER_BATCHES} />
            </div>

            {/* FAB */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-2xl z-10"
                aria-label="Create batch"
            >
                +
            </button>

            {/* Modal */}
            <CreateBatchModal open={open} setOpen={setOpen} />
        </div>
    );
}
