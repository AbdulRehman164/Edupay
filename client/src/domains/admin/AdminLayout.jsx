import { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    return (
        <div className="max-w-7xl mx-auto px-4 mt-6 h-[80vh]">
            {/* Mobile top bar */}
            <div className="md:hidden flex items-center gap-3 mb-4 px-1">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-lg bg-teal-500 text-white shadow-sm hover:bg-teal-600 active:scale-95 transition-all"
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>
                <span className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
                    Admin Panel
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">
                {/* Desktop sidebar */}
                <aside className="hidden md:block md:col-span-1">
                    <Sidebar />
                </aside>

                {/* Backdrop */}
                <div
                    onClick={() => setSidebarOpen(false)}
                    className={`
                        fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden
                        transition-opacity duration-300
                        ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    `}
                />

                {/* Mobile drawer */}
                <div
                    className={`
                        fixed top-0 left-0 z-50 h-full w-72 md:hidden
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </div>

                <main className="md:col-span-4 h-full overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
