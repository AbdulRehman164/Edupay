import UgSubmitButton from './UgSubmitButton';
import DeleteStudentButton from './DeleteStudentButton';
import FeeVerifyButton from './FeeVerifyButton';
import { useAuth } from '../../../auth/AuthContext';

function StudentsTable({ students, setStudents }) {
    const { user } = useAuth();
    return (
        <table className="w-full text-sm min-w-max">
            <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Reg. No.
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {user.role === 'data_entry'
                            ? 'UG-Submitted'
                            : 'Fee-Verified'}
                    </th>
                    {user.role === 'data_entry' && (
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            Actions
                        </th>
                    )}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {students?.map((s) => (
                    <tr
                        key={s.id}
                        className="hover:bg-gray-50 transition-colors group"
                    >
                        <td className="px-6 py-4 font-medium text-gray-900">
                            {s.reg_number}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{s.name}</td>
                        <td className="px-6 py-4 text-gray-500 capitalize w-50">
                            {user.role === 'data_entry' ? (
                                <UgSubmitButton
                                    s={s}
                                    setStudents={setStudents}
                                />
                            ) : (
                                <FeeVerifyButton
                                    s={s}
                                    setStudents={setStudents}
                                />
                            )}
                        </td>

                        {user.role === 'data_entry' && (
                            <td className="px-6 py-4">
                                <DeleteStudentButton
                                    s={s}
                                    setStudents={setStudents}
                                />
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default StudentsTable;
