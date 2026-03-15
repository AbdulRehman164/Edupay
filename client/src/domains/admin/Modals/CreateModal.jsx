import Modal from './Modal';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

function CreateModal({ onConfirm, onClose, loading }) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'hr',
    });
    const [showPass, setShowPass] = useState(false);
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
        <Modal title="Create User" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Username
                    </label>
                    <input
                        value={form.username}
                        onChange={(e) => set('username', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                        placeholder="e.g. abdul_rehman"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPass ? 'text' : 'password'}
                            value={form.password}
                            onChange={(e) => set('password', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                            placeholder="Min. 8 characters"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPass ? (
                                <EyeOff size={15} />
                            ) : (
                                <Eye size={15} />
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Role
                    </label>
                    <select
                        value={form.role}
                        onChange={(e) => set('role', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition bg-white"
                    >
                        <option value="hr">HR</option>
                        <option value="accounts">Accounts</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onConfirm(form)}
                    disabled={loading || !form.username || !form.password}
                    className="flex-1 rounded-lg bg-teal-500 py-2 text-sm font-medium text-white hover:bg-teal-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    Create User
                </button>
            </div>
        </Modal>
    );
}
export default CreateModal;
