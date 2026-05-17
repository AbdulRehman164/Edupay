import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import SuccessPopup from '../../../ui/SuccessPopup';

/* ── field config ── */
const FIELDS = {
    name: { label: 'Full Name', type: 'text', group: 'personal' },
    cnic_no: {
        label: 'CNIC',
        type: 'text',
        group: 'personal',
        placeholder: '12345-1234567-1',
    },
    date_of_birth: { label: 'Date of Birth', type: 'date', group: 'personal' },
    designation: { label: 'Designation', type: 'text', group: 'employment' },
    bps: { label: 'BPS', type: 'number', group: 'employment' },
    nature_of_appointment: {
        label: 'Nature of Appointment',
        type: 'text',
        group: 'employment',
    },
    date_of_joining: {
        label: 'Date of Joining',
        type: 'date',
        group: 'employment',
    },
    date_of_retirement: {
        label: 'Date of Retirement',
        type: 'date',
        group: 'employment',
    },
    account_no: { label: 'Account Number', type: 'text', group: 'financial' },
    pin_code: { label: 'PIN Code', type: 'number', group: 'financial' },
};

const GROUPS = {
    personal: 'Personal Information',
    employment: 'Employment Details',
    financial: 'Financial Information',
};

const EMPTY = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, '']));

/* ── validation ── */
function validate(data) {
    const e = {};
    if (!data.name?.trim()) e.name = 'Name is required';
    if (!data.account_no?.trim()) e.account_no = 'Account number is required';
    if (!data.cnic_no?.trim()) e.cnic_no = 'CNIC is required';
    else if (!/^\d{5}-\d{7}-\d$/.test(data.cnic_no))
        e.cnic_no = 'Format must be 12345-1234567-1';
    if (!data.bps) e.bps = 'BPS is required';
    else if (Number(data.bps) < 1) e.bps = 'Must be a valid number';
    if (!data.date_of_birth) e.date_of_birth = 'Required';
    if (!data.date_of_joining) e.date_of_joining = 'Required';
    if (!data.date_of_retirement) e.date_of_retirement = 'Required';
    if (!data.designation?.trim()) e.designation = 'Designation is required';
    if (!data.nature_of_appointment?.trim())
        e.nature_of_appointment = 'Required';
    if (!data.pin_code) e.pin_code = 'PIN code is required';
    else if (Number(data.pin_code) < 1) e.pin_code = 'PIN code is invalid';
    return e;
}

/* ── icons ── */
function BackIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
            className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold select-none flex-shrink-0"
        >
            {initials}
        </div>
    );
}

/* ── field component ── */
function Field({ fieldKey, value, error, onChange, isSaving }) {
    const cfg = FIELDS[fieldKey];
    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={fieldKey}
                className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
            >
                {cfg.label}
            </label>
            <input
                id={fieldKey}
                name={fieldKey}
                type={cfg.type}
                value={value}
                placeholder={cfg.placeholder ?? ''}
                disabled={isSaving}
                onChange={onChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition
                    disabled:bg-slate-50 disabled:text-slate-400
                    ${
                        error
                            ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                    }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

/* ── main component ── */
const EditEmployee = () => {
    const { cnic } = useParams();
    const navigate = useNavigate();
    const [employeeId, setEmployeeId] = useState(null);
    const [oldEmployee, setOldEmployee] = useState(null);
    const [employee, setEmployee] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');

    /* ── fetch employee ── */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/hr/employees?search=${cnic}`);
                const json = await res.json();
                const { id, ...rest } = json.employees[0];
                setEmployee(rest);
                setEmployeeId(id);
                setOldEmployee(rest);
            } finally {
                setIsFetching(false);
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async () => {
        const err = validate(employee);
        if (Object.keys(err).length) {
            setErrors(err);
            return;
        }
        setIsSaving(true);
        setSubmitError('');
        try {
            const res = await fetch(`/api/hr/employees/${employeeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employee),
            });
            const json = await res.json();
            if (res.ok) {
                setErrors({});
                setOldEmployee(employee);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                if (json?.details?.field) {
                    setErrors((prev) => ({
                        ...prev,
                        [json.details.field]: json.message,
                    }));
                } else {
                    setSubmitError(
                        json?.message ?? 'An error occurred. Please try again.',
                    );
                }
            }
        } catch {
            setSubmitError('Cannot reach the server. Check your connection.');
        } finally {
            setIsSaving(false);
        }
    };

    const isDirty = JSON.stringify(oldEmployee) !== JSON.stringify(employee);

    /* ── loading skeleton ── */
    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Spinner />
                    <p className="text-sm">Loading employee…</p>
                </div>
            </div>
        );
    }

    /* ── group fields ── */
    const grouped = Object.entries(GROUPS).map(([groupKey, groupLabel]) => ({
        groupKey,
        groupLabel,
        keys: Object.keys(FIELDS).filter((k) => FIELDS[k].group === groupKey),
    }));

    return (
        <div className="min-h-screen bg-slate-50">
            <SuccessPopup
                show={showSuccess}
                message="Employee updated successfully"
                onClose={() => setShowSuccess(false)}
            />

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
                {/* ── Back ── */}
                <button
                    className="inline-flex items-center gap-[5px] text-[13px] font-medium text-slate-500 bg-transparent border-none cursor-pointer p-0 hover:text-slate-900"
                    onClick={() => navigate(-1)}
                >
                    <BackIcon /> Back
                </button>

                {/* ── Employee identity header ── */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-5 flex items-center gap-4">
                    <Avatar name={employee.name} />
                    <div>
                        <h1 className="text-base font-semibold text-slate-800">
                            {employee.name || 'Employee'}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                            {employee.cnic_no}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {employee.designation}
                        </p>
                    </div>
                </div>

                {/* ── Form sections ── */}
                {grouped.map(({ groupKey, groupLabel, keys }) => (
                    <div
                        key={groupKey}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-5"
                    >
                        <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-400 pb-2.5 border-b border-slate-100 mb-3.5">
                            {groupLabel}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {keys.map((key) => (
                                <Field
                                    key={key}
                                    fieldKey={key}
                                    value={employee[key] ?? ''}
                                    error={errors[key]}
                                    onChange={handleChange}
                                    isSaving={isSaving}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* ── Submit row ── */}
                <div className="flex items-center justify-between">
                    {submitError ? (
                        <p className="text-sm text-red-500">{submitError}</p>
                    ) : (
                        <span />
                    )}
                    <button
                        className="bg-teal-700 text-white rounded-lg px-[22px] py-[9px] text-[13px] font-semibold cursor-pointer border-none inline-flex items-center gap-1.5 transition-[background,transform] duration-150 hover:enabled:bg-teal-800 active:enabled:scale-[0.97] disabled:bg-slate-400 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={!isDirty || isSaving}
                    >
                        {isSaving && <Spinner />}
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;
