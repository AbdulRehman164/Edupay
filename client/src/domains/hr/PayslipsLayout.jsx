import { useState } from 'react';
import { Outlet } from 'react-router';

export default function PayslipsLayout() {
    const [query, setQuery] = useState('');

    return <Outlet context={[query, setQuery]} />;
}
