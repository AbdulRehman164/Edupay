import Field from '../dashboard/Field';
import { DEPARTMENTS, SEMESTERS, SECTIONS } from '../../constants';
import { useState } from 'react';
import { useParams } from 'react-router';

function inputClass(error) {
    return [
        'w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all bg-white',
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100',
    ].join(' ');
}

const initialForm = { reg_no: '', name: '' };

function AddStudentModal({ open, setOpen, fetchStudents }) {
    const { id } = useParams();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function validate() {
        const e = {};
        if (!form.name) e.name = 'Name is required';
        if (!form.reg_no) e.reg_no = 'Registration No. is required';
        if (form.reg_no && !/^\d+-ag-\d+$/.test(form.reg_no))
            e.reg_no = 'Wrong registration no. format';
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
            Name: form.name,
            'Registration No.': form.reg_no,
        };
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/accounts/batches/${id}/students/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to add student');
            }
            const json = await res.json();
            if (json.skipped.length > 0) {
                throw new Error('Student already exists');
            }
            handleClose();
            await fetchStudents();
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
                                        Add Student
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        Fill in the details to add a student
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
                            <div className="grid grid-cols-2 gap-4"></div>

                            <Field label="Name" error={errors.name}>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder={`e.g. Abdul Rehman`}
                                    className={inputClass(errors.name)}
                                />
                            </Field>

                            <Field
                                label="Registration No."
                                error={errors.reg_no}
                            >
                                <input
                                    type="text"
                                    name="reg_no"
                                    value={form.reg_no}
                                    onChange={handleChange}
                                    placeholder={`e.g. 2022-ag-8701`}
                                    className={inputClass(errors.reg_no)}
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
                                {loading ? 'Adding...' : 'Add Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddStudentModal;
