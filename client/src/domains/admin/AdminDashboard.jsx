import { useEffect, useState } from 'react';
import {
    Users,
    ShieldCheck,
    UserCog,
    Calculator,
    TrendingUp,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, accent }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}
        >
            <Icon size={20} className="text-white" />
        </div>
        <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-0.5">
                {value ?? '—'}
            </p>
        </div>
    </div>
);

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (!res.ok) throw new Error('Failed to fetch stats');
                const json = await res.json();
                setStats(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const cards = [
        {
            label: 'Total Users',
            value: stats?.users?.total,
            icon: Users,
            accent: 'bg-teal-500',
        },
        {
            label: 'Admins',
            value: stats?.users?.roles?.admin,
            icon: ShieldCheck,
            accent: 'bg-indigo-500',
        },
        {
            label: 'HR',
            value: stats?.users?.roles?.hr,
            icon: UserCog,
            accent: 'bg-amber-500',
        },
        {
            label: 'Accounts',
            value: stats?.users?.roles?.accounts,
            icon: Calculator,
            accent: 'bg-rose-500',
        },
    ];

    return (
        <div className="p-1">
            {/* Page header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-gray-800 leading-none">
                        Dashboard
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        System overview
                    </p>
                </div>
            </div>

            {/* States */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 rounded-xl h-24 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
                    Failed to load stats: {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
