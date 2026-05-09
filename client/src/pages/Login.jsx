import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { EyeIcon, Spinner } from '../ui/Icons';
import { TriangleAlert } from 'lucide-react';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Invalid credentials');
            }
            const json = await res.json();
            setUser(json);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const inputBase =
        'w-full rounded-[9px] border-[1.5px] px-3.5 py-2.5 text-[13px] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300 bg-white';
    const inputNormal =
        'border-gray-200 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10';
    const inputError = 'border-red-400 bg-red-50/50';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
            <div className="w-full max-w-sm animate-[fade-up_.35s_cubic-bezier(.16,1,.3,1)_both]">
                {/* Logo / wordmark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-700 text-white text-xl font-bold mb-3.5 shadow-[0_2px_8px_rgba(15,118,110,.3)]">
                        E
                    </div>
                    <h1 className="text-[20px] font-bold text-slate-900 m-0">
                        Edupay
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-1">
                        Sign in to your account
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-[14px] px-7 pt-7 pb-6 shadow-[0_1px_3px_rgba(0,0,0,.06),0_4px_16px_rgba(0,0,0,.04)]">
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-4">
                            {/* Username */}
                            <div>
                                <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 uppercase tracking-[.05em]">
                                    Username
                                </label>
                                <input
                                    className={`${inputBase} ${error ? inputError : inputNormal}`}
                                    autoComplete="username"
                                    autoFocus
                                    value={username}
                                    placeholder="Enter your username"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError('');
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[12px] font-semibold text-slate-500 mb-1.5 uppercase tracking-[.05em]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className={`${inputBase} pr-10 ${error ? inputError : inputNormal}`}
                                        type={showPw ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPw((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors duration-150 bg-transparent border-none cursor-pointer"
                                    >
                                        <EyeIcon open={showPw} />
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-[13px] text-red-600">
                                    <TriangleAlert className="w-3.5 h-3.5" />
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !username || !password}
                                className="w-full flex items-center justify-center gap-1.5 rounded-[9px] bg-teal-700 text-white py-[11px] text-[13px] font-semibold border-none cursor-pointer transition-all duration-150 hover:bg-teal-800 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Spinner /> Signing in…
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[12px] text-slate-300 mt-5">
                    &copy; {new Date().getFullYear()} Abdul Rehman · Edupay
                </p>
            </div>
        </div>
    );
}

export default Login;
