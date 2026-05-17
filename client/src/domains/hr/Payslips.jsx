import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';

/* ── icons ── */
function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
            />
        </svg>
    );
}

function ArrowRight() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
}

function ClearIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

function Spinner() {
    return (
        <svg
            className="animate-spin h-4 w-4 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}

/* ── avatar ── */
function Avatar({ name }) {
    const initials =
        name
            ?.split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase() || '?';
    const hue =
        [...(name ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return (
        <div
            style={{
                background: `hsl(${hue},45%,88%)`,
                color: `hsl(${hue},45%,30%)`,
            }}
            className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold select-none flex-shrink-0"
        >
            {initials}
        </div>
    );
}

/* ── skeleton row ── */
function SkeletonRow() {
    return (
        <tr>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-36 rounded bg-slate-100 animate-pulse" />
                        <div className="h-2.5 w-28 rounded bg-slate-100 animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-3.5 text-right">
                <div className="h-7 w-16 rounded-md bg-slate-100 animate-pulse ml-auto" />
            </td>
        </tr>
    );
}

/* ── main ── */
const Payslips = () => {
    const [query, setQuery] = useOutletContext();
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /* ── debounced search ── */
    useEffect(() => {
        if (!query.trim()) {
            setEmployees([]);
            return;
        }

        const t = setTimeout(async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch(
                    `/api/hr/employees?search=${encodeURIComponent(query)}`,
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setEmployees(data?.employees ?? []);
            } catch {
                setError(
                    'Could not fetch results. Check your connection and try again.',
                );
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => clearTimeout(t);
    }, [query]);

    const showEmpty =
        !isLoading && query.trim() && employees.length === 0 && !error;
    const showIdle = !query.trim();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
                {/* ── Page header ── */}
                <div>
                    <h1 className="text-base font-semibold text-slate-800">
                        Payslip Search
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Search by employee name or CNIC
                    </p>
                </div>

                {/* ── Search bar ── */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SearchIcon />
                    </span>
                    <input
                        className="w-full border-[1.5px] border-slate-200 rounded-[10px] py-2.5 pl-10 pr-10 text-sm outline-none transition-[border-color,box-shadow] duration-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:shadow-[0_0_0_3px_rgba(15,118,110,0.08)]"
                        type="text"
                        placeholder="Search by name or CNIC…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {isLoading && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Spinner />
                        </span>
                    )}
                    {!isLoading && query && (
                        <button
                            className="absolute right-[11px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-[3px] rounded text-slate-400 flex items-center hover:text-slate-600"
                            onClick={() => setQuery('')}
                        >
                            <ClearIcon />
                        </button>
                    )}
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* ── Results table ── */}
                {(isLoading || employees.length > 0) && (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Results
                            </p>
                            {!isLoading && (
                                <span className="text-xs text-slate-400">
                                    {employees.length}{' '}
                                    {employees.length === 1
                                        ? 'employee'
                                        : 'employees'}
                                </span>
                            )}
                        </div>
                        <table className="w-full text-sm">
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                          <SkeletonRow key={i} />
                                      ))
                                    : employees.map((emp) => (
                                          <tr
                                              key={emp.id}
                                              className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                                              onClick={() =>
                                                  navigate(
                                                      `/hr/payslips/${emp.cnic_no}`,
                                                  )
                                              }
                                          >
                                              <td className="px-5 py-3.5">
                                                  <div className="flex items-center gap-3">
                                                      <Avatar name={emp.name} />
                                                      <div>
                                                          <p className="font-medium text-slate-800 leading-tight">
                                                              {emp.name}
                                                          </p>
                                                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                              {emp.cnic_no}
                                                          </p>
                                                      </div>
                                                  </div>
                                              </td>
                                              <td className="px-5 py-3.5 text-right">
                                                  <button
                                                      className="inline-flex items-center gap-[5px] text-xs font-semibold text-teal-700 border border-teal-200 rounded-[7px] px-3 py-[5px] bg-transparent cursor-pointer transition-colors duration-150 whitespace-nowrap hover:bg-teal-50"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          navigate(
                                                              `/hr/payslips/${emp.cnic_no}`,
                                                          );
                                                      }}
                                                  >
                                                      Open <ArrowRight />
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Empty state ── */}
                {showEmpty && (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-12 text-center">
                        <div className="flex justify-center">
                            <SearchIcon />
                        </div>
                        <p className="text-sm font-medium text-slate-600 mt-3">
                            No employees found
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Try a different name or CNIC number.
                        </p>
                    </div>
                )}

                {/* ── Idle state ── */}
                {showIdle && (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-12 text-center">
                        <div className="flex justify-center mb-3 opacity-30">
                            <SearchIcon />
                        </div>
                        <p className="text-sm text-slate-400">
                            Start typing to search for an employee.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payslips;
