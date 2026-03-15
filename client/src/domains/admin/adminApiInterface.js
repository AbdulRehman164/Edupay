const api = {
    getUsers: ({ page = 1, search = '' } = {}) => {
        const params = new URLSearchParams({ page });
        if (search) params.set('search', search);
        return fetch(`/api/admin/users?${params}`).then((r) => r.json());
    },
    deleteUser: (id) => fetch(`/api/admin/users/${id}`, { method: 'DELETE' }),
    createUser: (body) =>
        fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then((r) => r.json()),
    updateUsername: (id, body) =>
        fetch(`/api/admin/users/${id}/username`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then((r) => r.json()),
    resetPassword: (id) =>
        fetch(`/api/admin/users/${id}/reset-password`, {
            method: 'POST',
        }).then((r) => r.json()),
    updateRole: (id, role) =>
        fetch(`/api/admin/users/${id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        }).then((r) => r.json()),
};

export default api;
