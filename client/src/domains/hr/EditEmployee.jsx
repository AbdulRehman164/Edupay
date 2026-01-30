import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SuccessPopup from '../../ui/SuccessPopup';

const EditEmployee = () => {
    const { cnic } = useParams();
    const [employeeId, setEmployeeId] = useState();
    const [oldEmployee, setOldEmployee] = useState();
    const [showSuccess, setShowSuccess] = useState(false);
    const [employee, setEmployee] = useState({
        account_no: '',
        bps: '',
        cnic_no: '',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        designation: '',
        name: '',
        nature_of_appointment: '',
        pin_code: '',
    });
    const [errors, setErrors] = useState({
        account_no: '',
        bps: '',
        cnic_no: '',
        date_of_birth: '',
        date_of_joining: '',
        date_of_retirement: '',
        designation: '',
        name: '',
        nature_of_appointment: '',
        pin_code: '',
    });

    const inputTypes = {
        account_no: 'text',
        bps: 'number',
        cnic_no: 'text',
        date_of_birth: 'date',
        date_of_joining: 'date',
        date_of_retirement: 'date',
        designation: 'text',
        name: 'text',
        nature_of_appointment: 'text',
        pin_code: 'number',
    };

    const validateEmployee = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!data.account_no.trim()) {
            errors.account_no = 'Account number is required';
        }

        if (!data.cnic_no.trim()) {
            errors.cnic_no = 'CNIC is required';
        } else if (!/^\d{5}-\d{7}-\d$/.test(data.cnic_no)) {
            errors.cnic_no = 'CNIC format must be 12345-1234567-1';
        }

        if (!data.bps) {
            errors.bps = 'BPS is required';
        } else if (Number(data.bps) < 1) {
            errors.bps = 'BPS must be a valid number';
        }

        if (!data.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
        }

        if (!data.date_of_joining) {
            errors.date_of_joining = 'Date of joining is required';
        }

        if (!data.date_of_retirement) {
            errors.date_of_retirement = 'Date of retirement is required';
        }

        if (!data.designation.trim()) {
            errors.designation = 'Designation is required';
        }

        if (!data.nature_of_appointment.trim()) {
            errors.nature_of_appointment = 'Nature of appointment is required';
        }

        if (!data.pin_code) {
            errors.pin_code = 'Pin code is required';
        } else if (Number(data.pin_code) < 1) {
            errors.pin_code = 'Pin code is invalid';
        }
        return errors;
    };

    useEffect(() => {
        (async function () {
            const res = await fetch(`/api/employees?search=${cnic}`);
            const json = await res.json();
            const { id, ...rest } = json.employees[0];
            setEmployee(rest);
            setEmployeeId(id);
            setOldEmployee(rest);
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const err = validateEmployee(employee);
        if (Object.keys(err).length !== 0) {
            setErrors(err);
            return;
        }
        (async function () {
            const res = await fetch(`/api/employees/${employeeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employee),
            });
            const json = await res.json();
            if (res.ok) {
                setErrors({});
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                setOldEmployee(employee);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    [json?.details?.field]: json?.message,
                }));
            }
        })();
    };

    return (
        <div className="max-w-3xl mx-auto mt-5 rounded-xl border bg-white p-8 shadow-sm">
            {/* Success Popup */}
            <SuccessPopup
                show={showSuccess}
                message="Updated successfully"
                onClose={() => setShowSuccess(false)}
            />
            <h2 className="mb-8 text-2xl font-semibold text-gray-800">
                Edit Employee
            </h2>
            <div className="flex flex-col gap-y-1 justify-center">
                {Object.keys(employee).map((key) => (
                    <div
                        className="grid grid-cols-1 gap-y-1 md:grid-cols-2 md:items-center"
                        key={key}
                    >
                        <label
                            className="text-sm font-medium text-gray-600"
                            htmlFor={key}
                        >
                            {key
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                        <div>
                            <input
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
              ${
                  errors[key]
                      ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-300'
              }
            `}
                                id={key}
                                type={inputTypes[key] || 'text'}
                                name={key}
                                value={employee[key]}
                                onChange={handleChange}
                            />
                            {errors[key] && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors[key]}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex justify-end">
                <button
                    className="rounded-lg bg-teal-400 px-6 py-2 text-sm font-semibold text-white cursor-pointer
                 transition enabled:hover:bg-teal-500 enabled:active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={
                        JSON.stringify(oldEmployee) === JSON.stringify(employee)
                    }
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditEmployee;
