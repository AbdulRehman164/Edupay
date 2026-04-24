function BatchStats({ batches }) {
    const totalBatches = batches.length;
    const openBatches = batches.filter((b) => b.status === 'open').length;
    const closedBatches = batches.filter((b) => b.status === 'closed').length;
    const departments = new Set(batches.map((b) => b.department)).size;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
                {
                    label: 'Total Batches',
                    value: totalBatches,
                    sub: 'All time',
                },
                {
                    label: 'Open Batches',
                    value: openBatches,
                    sub: 'Currently active',
                },
                {
                    label: 'Closed Batches',
                    value: closedBatches,
                    sub: 'Completed',
                },
                {
                    label: 'Departments',
                    value: departments,
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
