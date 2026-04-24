import { useEffect, useState } from 'react';

function BatchStats() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total_batches: 0,
        open_batches: 0,
        closed_batches: 0,
        departments: 0,
    });
    useEffect(() => {
        setLoading(true);
        setError(null);
        (async function () {
            try {
                const res = await fetch('/api/accounts/batches/stats');
                if (!res.ok) {
                    const err = res.json();
                    throw new Error(err.message || 'Something went wrong.');
                }
                const json = await res.json();
                setStats(json);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    return error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Something went wrong while fetching stats. Please try again later.
        </div>
    ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
                {
                    label: 'Total Batches',
                    value: stats.total_batches,
                    sub: 'All time',
                },
                {
                    label: 'Open Batches',
                    value: stats.open_batches,
                    sub: 'Currently active',
                },
                {
                    label: 'Closed Batches',
                    value: stats.closed_batches,
                    sub: 'Completed',
                },
                {
                    label: 'Departments',
                    value: stats.departments,
                    sub: 'With batches',
                },
            ].map((s) => (
                <div
                    key={s.label}
                    className="bg-white rounded-xl border border-gray-200 px-5 py-4"
                >
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        {s.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">
                        {s.value}
                    </p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
            ))}
        </div>
    );
}

export default BatchStats;
