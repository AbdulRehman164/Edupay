import { Icon } from 'lucide-react';

const PaginationBtn = ({ icon: Icon, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
    >
        <Icon size={15} />
    </button>
);

export default PaginationBtn;
