const ActionBtn = ({ icon: Icon, label, color, onClick, loading }) => (
    <button
        onClick={onClick}
        disabled={loading}
        title={label}
        className={`p-2 rounded-lg transition ${color} disabled:opacity-40`}
    >
        <Icon size={15} />
    </button>
);

export default ActionBtn;
