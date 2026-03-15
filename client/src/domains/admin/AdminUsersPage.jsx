import { useEffect, useState, useCallback, useRef } from 'react';
import {
    Users,
    Plus,
    Trash2,
    Pencil,
    KeyRound,
    X,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import DeleteModal from './Modals/DeleteModal';
import NewPasswordModal from './Modals/NewPasswordModal';
import EditModal from './Modals/EditModal';
import CreateModal from './Modals/CreateModal';
import api from './adminApiInterface';
import RoleBadge from './RoleBadge';
import PaginationBtn from './PaginationBtn';
import ActionBtn from './ActionBtn';

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [modal, setModal] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const searchTimeout = useRef(null);

    const closeModal = () => setModal(null);

    // Fetch
    const loadUsers = useCallback(async (p, s) => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getUsers({ page: p, search: s });
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers(page, search);
    }, [page, search, loadUsers]);

    // Debounced search
    const handleSearchInput = (val) => {
        setSearchInput(val);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            setSearch(val.trim());
        }, 400);
    };

    // Actions
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await api.deleteUser(modal.user.id);
            // If last item on page > 1, go back
            const newPage = users.length === 1 && page > 1 ? page - 1 : page;
            setPage(newPage);
            if (newPage === page) loadUsers(page, search);
            closeModal();
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreate = async (form) => {
        setActionLoading(true);
        try {
            await api.createUser(form);
            loadUsers(page, search);
            closeModal();
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditUsername = async (username) => {
        setActionLoading(true);
        try {
            const updated = await api.updateUsername(modal.user.id, {
                username,
            });
            setUsers((u) => u.map((x) => (x.id === updated.id ? updated : x)));
            closeModal();
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetPassword = async (user) => {
        setActionLoading(true);
        try {
            const updated = await api.resetPassword(user.id);
            setModal({ type: 'newPassword', data: updated.password });
        } finally {
            setActionLoading(false);
        }
    };

    // Helper
    function getPaginationRange(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (current >= total - 3)
            return [
                1,
                '...',
                total - 4,
                total - 3,
                total - 2,
                total - 1,
                total,
            ];
        return [1, '...', current - 1, current, current + 1, '...', total];
    }

    return (
        <div className="p-1">
            {/* Page header */}
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                        <Users size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 leading-none">
                            Users
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Page {page} of {totalPages}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setModal({ type: 'create' })}
                    className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 active:scale-95 transition-all shadow-sm"
                >
                    <Plus size={15} />
                    New User
                </button>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search by username or role…"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                />
                {searchInput && (
                    <button
                        onClick={() => handleSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Loading skeletons */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-14 rounded-xl bg-gray-100 animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
                    {error}
                </div>
            )}

            {/* Table Desktop*/}
            {!loading && !error && (
                <>
                    <div className="hidden sm:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    <th className="px-5 py-3 text-left">
                                        User
                                    </th>
                                    <th className="px-5 py-3 text-left">
                                        Role
                                    </th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users?.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50/70 transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs uppercase">
                                                    {user.username?.[0]}
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
                                                <ActionBtn
                                                    icon={Pencil}
                                                    label="Edit username"
                                                    color="text-indigo-500 hover:bg-indigo-50"
                                                    onClick={() =>
                                                        setModal({
                                                            type: 'edit',
                                                            user,
                                                        })
                                                    }
                                                />
                                                <ActionBtn
                                                    icon={KeyRound}
                                                    label="Reset password"
                                                    color="text-amber-500 hover:bg-amber-50"
                                                    onClick={() =>
                                                        handleResetPassword(
                                                            user,
                                                        )
                                                    }
                                                    loading={actionLoading}
                                                />
                                                <ActionBtn
                                                    icon={Trash2}
                                                    label="Delete user"
                                                    color="text-rose-500 hover:bg-rose-50"
                                                    onClick={() =>
                                                        setModal({
                                                            type: 'delete',
                                                            user,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users?.length === 0 && (
                            <div className="py-16 text-center text-sm text-gray-400">
                                {search
                                    ? `No users found for "${search}"`
                                    : 'No users yet.'}
                            </div>
                        )}
                    </div>
                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-2">
                        {users?.length === 0 && (
                            <div className="py-16 text-center text-sm text-gray-400">
                                {search
                                    ? `No users found for "${search}"`
                                    : 'No users yet.'}
                            </div>
                        )}
                        {users?.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left: avatar + name + role */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 shrink-0 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm uppercase">
                                            {user.username?.[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 text-sm truncate">
                                                {user.username}
                                            </p>
                                            <div className="mt-0.5">
                                                <RoleBadge role={user.role} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: action buttons always visible */}
                                    <div className="flex items-center gap-1 shrink-0 ml-3">
                                        <ActionBtn
                                            icon={Pencil}
                                            label="Edit username"
                                            color="text-indigo-500 hover:bg-indigo-50"
                                            onClick={() =>
                                                setModal({ type: 'edit', user })
                                            }
                                        />
                                        <ActionBtn
                                            icon={KeyRound}
                                            label="Reset password"
                                            color="text-amber-500 hover:bg-amber-50"
                                            onClick={() =>
                                                handleResetPassword(user)
                                            }
                                            loading={actionLoading}
                                        />
                                        <ActionBtn
                                            icon={Trash2}
                                            label="Delete user"
                                            color="text-rose-500 hover:bg-rose-50"
                                            onClick={() =>
                                                setModal({
                                                    type: 'delete',
                                                    user,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Page{' '}
                                <span className="font-semibold text-gray-600">
                                    {page}
                                </span>{' '}
                                of {totalPages}
                            </p>
                            <div className="flex items-center gap-1">
                                <PaginationBtn
                                    icon={ChevronLeft}
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                />

                                {/* Page number pills */}
                                {getPaginationRange(page, totalPages).map(
                                    (p, i) =>
                                        p === '...' ? (
                                            <span
                                                key={`dots-${i}`}
                                                className="px-1 text-gray-300 text-sm select-none"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition
                                                ${
                                                    p === page
                                                        ? 'bg-teal-500 text-white shadow-sm'
                                                        : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ),
                                )}

                                <PaginationBtn
                                    icon={ChevronRight}
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {modal?.type === 'delete' && (
                <DeleteModal
                    user={modal.user}
                    onConfirm={handleDelete}
                    onClose={closeModal}
                    loading={actionLoading}
                />
            )}
            {modal?.type === 'create' && (
                <CreateModal
                    onConfirm={handleCreate}
                    onClose={closeModal}
                    loading={actionLoading}
                />
            )}
            {modal?.type === 'edit' && (
                <EditModal
                    user={modal.user}
                    onConfirm={handleEditUsername}
                    onClose={closeModal}
                    loading={actionLoading}
                />
            )}
            {modal?.type === 'newPassword' && (
                <NewPasswordModal password={modal.data} onClose={closeModal} />
            )}
        </div>
    );
}

export default AdminUsersPage;
