import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserCog } from 'lucide-react';

const ROLE_STYLES = {
    admin: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
    hr: 'bg-amber-100  text-amber-700  hover:bg-amber-200',
    accounts: 'bg-rose-100   text-rose-700   hover:bg-rose-200',
};

const ROLES = ['admin', 'hr', 'accounts'];

function RoleBadge({ role, onRoleChange }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const btnRef = useRef(null);
    const dropRef = useRef(null);

    // Position the dropdown relative to the badge on open
    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 6,
                left: rect.left + window.scrollX,
            });
        }
        setOpen((prev) => !prev);
    };

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                btnRef.current &&
                !btnRef.current.contains(e.target) &&
                dropRef.current &&
                !dropRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    if (!onRoleChange) {
        return (
            <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                ${ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-600'}`}
            >
                {role}
            </span>
        );
    }

    return (
        <>
            <button
                ref={btnRef}
                onClick={handleOpen}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize transition
                    ${ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                {role}
                <UserCog
                    size={11}
                    className={`transition-opacity ${open ? 'opacity-100' : 'opacity-50'}`}
                />
            </button>

            {open &&
                createPortal(
                    <div
                        ref={dropRef}
                        style={{ top: coords.top, left: coords.left }}
                        className="fixed z-50 min-w-[110px] rounded-xl border border-gray-100 bg-white shadow-lg py-1"
                    >
                        {ROLES.map((r) => (
                            <button
                                key={r}
                                onClick={() => {
                                    if (r !== role) onRoleChange(r);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium capitalize transition
                                ${
                                    r === role
                                        ? 'text-gray-300 cursor-default'
                                        : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        r === 'admin'
                                            ? 'bg-indigo-400'
                                            : r === 'hr'
                                              ? 'bg-amber-400'
                                              : 'bg-rose-400'
                                    }`}
                                />
                                {r}
                                {r === role && (
                                    <span className="ml-auto text-gray-300">
                                        &#10003;
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </>
    );
}

export default RoleBadge;
