import { useState, useEffect } from 'react';
import CreateBatchModal from './CreateBatchModal';
import DashboardBatchStats from './DashboardBatchStats';
import DashboardBatchTable from './DashboardBatchTable';
import AccountsDashboardHeader from './AccountsDashboardHeader';
import { useAuth } from '../../../auth/AuthContext';

export default function AccountsDashboard() {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function searchBatches(search = '') {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/accounts/batches?search=${search}`);

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Something went wrong.');
            }
            const json = await res.json();
            setBatches(json);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        searchBatches(search);
    }, [search]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <AccountsDashboardHeader />
                {/* Stats */}
                <DashboardBatchStats />
                {/* Table */}
                <DashboardBatchTable
                    setSearch={setSearch}
                    batches={batches}
                    loading={loading}
                    error={error}
                />
            </div>

            {/* FAB */}
            {user.role === 'data_entry' && (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 active:scale-95 transition-all flex items-center justify-center text-2xl z-10"
                        aria-label="Create batch"
                    >
                        +
                    </button>

                    {/* Modal */}
                    <CreateBatchModal
                        open={open}
                        setOpen={setOpen}
                        searchBatches={searchBatches}
                    />
                </>
            )}
        </div>
    );
}
