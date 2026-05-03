import { useAuth } from '../../../auth/AuthContext';
function AccountsDashboardHeader() {
    const { user } = useAuth();
    return (
        <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Accounts &rsaquo;{' '}
                {user.role === 'data_entry' ? 'Data Entry' : 'Accounts'}
            </p>
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Batch Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create and track academic batches across departments
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AccountsDashboardHeader;
