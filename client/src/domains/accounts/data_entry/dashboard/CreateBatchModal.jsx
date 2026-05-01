import Field from './Field';
import { DEPARTMENTS, SEMESTERS, SECTIONS } from '../../constants';
import { useState } from 'react';

function inputClass(error) {
    return [
        'w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all bg-white',
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100',
    ].join(' ');
}

const initialForm = { department: '', semester: '', year: '', section: '' };

function CreateBatchModal({ open, setOpen }) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentYear = new Date().getFullYear();

    function validate() {
        const e = {};
        if (!form.department) e.department = 'Department is required';
        if (!form.semester) e.semester = 'Semester is required';
        if (!form.year) {
            e.year = 'Year is required';
        } else {
            const y = parseInt(form.year);
            if (isNaN(y) || y < 2000 || y > currentYear + 1)
                e.year = `Must be between 2000 and ${currentYear + 1}`;
        }
        if (!form.section) e.section = 'Section is required';
        return e;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    }

    async function handleSubmit() {
        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }
        const payload = {
            department: form.department.toLowerCase(),
            semester: Number(form.semester),
            year: parseInt(form.year),
            section: form.section,
        };
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/accounts/batches', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to create batch');
            }
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        setOpen(false);
        setForm(initialForm);
        setErrors({});
        setError(null);
    }
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) =>
                        e.target === e.currentTarget && handleClose()
                    }
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal header */}
                        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Create Batch
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Fill in the details to open a new batch
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-xl leading-none mt-0.5"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-4">
                            <Field label="Department" error={errors.department}>
                                <select
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    className={inputClass(errors.department)}
                                >
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Semester" error={errors.semester}>
                                    <select
                                        name="semester"
                                        value={form.semester}
                                        onChange={handleChange}
                                        className={inputClass(errors.semester)}
                                    >
                                        <option value="">Select</option>
                                        {SEMESTERS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Section" error={errors.section}>
                                    <select
                                        name="section"
                                        value={form.section}
                                        onChange={handleChange}
                                        className={inputClass(errors.section)}
                                    >
                                        <option value="">Select</option>
                                        {SECTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() +
                                                    s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <Field label="Year" error={errors.year}>
                                <input
                                    type="number"
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    placeholder={`e.g. ${currentYear}`}
                                    min="2000"
                                    max={currentYear + 1}
                                    className={inputClass(errors.year)}
                                />
                            </Field>
                            {/* API error */}
                            {error && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                            >
                                {loading ? 'Creating...' : 'Create Batch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateBatchModal;
