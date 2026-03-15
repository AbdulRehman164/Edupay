import { NavLink } from 'react-router';
import { LayoutDashboard, Users, ShieldCheck, X } from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/roles', label: 'Roles', icon: ShieldCheck },
];

function Sidebar({ onNavigate }) {
    return (
        <aside className="flex flex-col h-full rounded-xl bg-teal-600 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-teal-500/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                        <ShieldCheck size={15} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-base tracking-tight">
                        Admin
                    </span>
                </div>

                {onNavigate && (
                    <button
                        onClick={onNavigate}
                        className="md:hidden p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition"
                        aria-label="Close menu"
                    >
                        <X size={17} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${
                                isActive
                                    ? 'bg-white text-teal-700 shadow-sm'
                                    : 'text-white/85 hover:bg-white/15 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={16}
                                    className={
                                        isActive
                                            ? 'text-teal-600'
                                            : 'text-white/70'
                                    }
                                />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-teal-500/60">
                <p className="text-xs text-white/40 text-center tracking-wide">
                    Admin Console
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;
