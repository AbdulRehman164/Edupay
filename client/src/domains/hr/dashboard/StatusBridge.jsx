const STATUS_META = {
    completed: {
        label: 'Completed',
        color: '#16a34a',
        bg: '#f0fdf4',
        dot: '#22c55e',
    },
    active: {
        label: 'Processing',
        color: '#d97706',
        bg: '#fffbeb',
        dot: '#f59e0b',
    },
    waiting: {
        label: 'Waiting',
        color: '#6366f1',
        bg: '#eef2ff',
        dot: '#818cf8',
    },
    delayed: {
        label: 'Delayed',
        color: '#6366f1',
        bg: '#eef2ff',
        dot: '#818cf8',
    },
    failed: {
        label: 'Failed',
        color: '#dc2626',
        bg: '#fef2f2',
        dot: '#f87171',
    },
    idle: { label: 'Idle', color: '#6b7280', bg: '#f9fafb', dot: '#d1d5db' },
};

function StatusBadge({ status }) {
    const s = STATUS_META[status] ?? STATUS_META.idle;
    return (
        <span
            style={{ color: s.color, background: s.bg }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        >
            <span
                style={{ background: s.dot }}
                className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'animate-pulse' : ''}`}
            />
            {s.label}
        </span>
    );
}

export default StatusBadge;
