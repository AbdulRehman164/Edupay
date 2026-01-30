import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

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

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6">
            <div
                className="
          w-full max-w-md rounded-2xl bg-white
          p-6 sm:p-8
          shadow-sm border
        "
            >
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
                        Sign in
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Access your account securely
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Username
                        </label>
                        <input
                            className="
                mt-1 w-full rounded-md border border-slate-300
                px-3 py-2.5 text-sm text-slate-800
                focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600
              "
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="
                mt-1 w-full rounded-md border border-slate-300
                px-3 py-2.5 text-sm text-slate-800
                focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600
              "
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full rounded-md bg-teal-600 py-2.5 text-sm font-semibold text-white
              hover:bg-teal-700 transition
              disabled:opacity-50
            "
                    >
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 border-t pt-4 text-center text-xs text-slate-500">
                    © Abdul Rehman
                </div>
            </div>
        </div>
    );
}

export default Login;
