import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { NAV_BY_DOMAIN } from './nav.config';
import getDomain from './getDomain';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router';

const Header = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const domain = getDomain(location.pathname);
    const navItems = NAV_BY_DOMAIN[domain];

    // No header on login / unknown routes
    if (!navItems || !user) return null;

    return (
        <header className="shadow-sm">
            <nav className="mx-auto max-w-7xl bg-teal-500 px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between text-white">
                    {/* App Name */}
                    <div className="text-xl font-extrabold tracking-wide">
                        Edu<span className="text-teal-100">Pay</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
                        <ul className="flex items-center gap-6 text-sm font-semibold">
                            {navItems.map((item) => {
                                const isActive = item.exact
                                    ? location.pathname === item.to
                                    : location.pathname === item.to ||
                                      location.pathname.startsWith(
                                          item.to + '/',
                                      );

                                return (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className={`rounded-md px-3 py-2 transition
                        ${isActive ? 'bg-teal-600' : 'hover:bg-teal-600'}
                      `}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* User info */}
                        <div className="ml-6 flex items-center gap-3 text-sm">
                            <span className="text-teal-100">
                                {user.name || user.username}
                            </span>
                            <button
                                onClick={async () => {
                                    await logout();
                                    navigate('/login', { replace: true });
                                }}
                                className="rounded-md px-3 py-2 hover:bg-teal-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden rounded-md p-2 hover:bg-teal-600"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Navigation */}
                {open && (
                    <div className="md:hidden border-t border-teal-400 pb-3 pt-2 text-white">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-4 py-2 text-sm font-semibold hover:bg-teal-600"
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="mt-2 border-t border-teal-400 pt-2 px-4 text-sm">
                            <div className="mb-2 text-teal-100">
                                {user.name || user.username}
                            </div>
                            <button
                                onClick={logout}
                                className="w-full text-left rounded-md py-2 font-semibold hover:bg-teal-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
