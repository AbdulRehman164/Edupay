const ROLE_STYLES = {
    admin: 'bg-indigo-100 text-indigo-700',
    hr: 'bg-amber-100  text-amber-700',
    accounts: 'bg-rose-100   text-rose-700',
};

function RoleBadge({ role }) {
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
        ${ROLE_STYLES[role] ?? 'bg-gray-100 text-gray-600'}`}
        >
            {role}
        </span>
    );
}

export default RoleBadge;
