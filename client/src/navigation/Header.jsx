import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { NAV_BY_DOMAIN } from './nav.config';
import getDomain from './getDomain';
import { useAuth } from '../auth/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import Avatar from '../ui/Avatar';

const Header = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const domain = getDomain(location.pathname);
    const navItems = NAV_BY_DOMAIN[domain];

    if (!navItems || !user) return null;

    const isActive = (item) =>
        item.exact
            ? location.pathname === item.to
            : location.pathname === item.to ||
              location.pathname.startsWith(item.to + '/');

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const displayName = user.name || user.username;

    return (
        <>
            <header className="sticky top-0 z-40 bg-teal-700 border-b border-white/10 shadow-sm">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-14 items-center justify-between">
                        {/* logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 no-underline"
                        >
                            <div className="w-7.5 h-7.5 rounded-lg bg-white/20 border-[1.5px] border-white/25 flex items-center justify-center text-[14px] font-extrabold text-white shrink-0">
                                E
                            </div>

                            <span className="text-[15px] font-bold text-white tracking-[-0.01em]">
                                Edupay
                            </span>
                        </Link>

                        {/* desktop */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`rounded-[7px] px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors text-white/85 hover:bg-white/12 hover:text-white
                                ${
                                    isActive(item)
                                        ? 'bg-white/20 text-white font-semibold'
                                        : ''
                                }
                            `}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    name={displayName}
                                    dynamicColor={false}
                                />

                                <span className="text-[13px] font-medium text-white/85">
                                    {displayName}
                                </span>
                            </div>

                            <div className="w-px h-4.5 bg-white/20" />

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 rounded-[7px] px-2.75 py-1.5 text-[12px] font-semibold text-white/75 border border-white/20 bg-transparent transition-colors hover:bg-white/12 hover:text-white hover:border-white/30"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Logout
                            </button>
                        </div>

                        <button
                            aria-label="Toggle menu"
                            onClick={() => setOpen((v) => !v)}
                            className="md:hidden flex items-center justify-center p-1.5 rounded-lg bg-white/10 border border-white/20 text-white transition-colors hover:bg-white/20"
                        >
                            {open ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </nav>

                {/* mobile */}
                {open && (
                    <div className="mobile-menu md:hidden border-t border-white/10 px-4 pt-2.5 pb-3.5">
                        <div className="flex flex-col gap-0.5">
                            {navItems.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className={`block rounded-lgpx-3.5 py-2.25 text-[13px] font-medium text-white/85 transition-colors hover:bg-white/12 hover:text-white
                                ${
                                    isActive(item)
                                        ? 'bg-white/12 text-white'
                                        : ''
                                }
                            `}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Avatar and logout */}
                        <div className="mt-2.5 pt-3 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar name={displayName} />

                                <span className="text-[13px]text-white/75">
                                    {displayName}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 rounded-[7px] px-2.75 py-1.5 text-[12px] font-semibold text-white/75 border border-white/20 bg-transparent transition-colors hover:bg-white/12 hover:text-white hover:border-white/30"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
